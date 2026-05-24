import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

// ---- 读取环境变量 ----
let apiKey = "";
let model = "deepseek-v4-flash";
let baseURL = "https://api.deepseek.com";

try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (key === "DEEPSEEK_API_KEY") apiKey = value;
    if (key === "DEEPSEEK_MODEL") model = value;
    if (key === "DEEPSEEK_BASE_URL") baseURL = value;
  }
} catch {
  console.error("❌ 无法读取 .env.local");
  process.exit(1);
}

if (!apiKey) {
  console.error("❌ DEEPSEEK_API_KEY 未设置");
  process.exit(1);
}

// ---- System Prompt ----
const SYSTEM_PROMPT = `你是「问事一卦」的问题识别器。
你不算卦，不解签，不预测未来。
你的任务只有一个：判断用户的问题是否适合进入问卦流程。

问事一卦只适合回答"我该怎么做"的行动决策问题。
适合的问题包括：
- 我要不要做某事
- 我该不该推进某事
- 这件事适合进、缓、守、止，还是换方式
- 沟通、选择、项目、学习、工作机会、情绪处理等行动问题

不适合的问题包括：
1. 客观事实查询：天气、时间、地点、成绩、结果；
2. 结果预测：会不会发生、能不能遇到、他会不会来、会不会考上；
3. 他人读心或评价：他是不是喜欢我、老师人怎么样、领导怎么看我；
4. 医疗、法律、金融、危险行为等高风险问题；
5. 让系统替用户断定他人命运、行为或真实想法的问题。

如果问题不适合，请给出 2-4 个更适合问卦的行动型改写建议。

只输出 JSON，不要输出解释性段落。

JSON schema：
{
  "valid": boolean,
  "type": "action_decision | choice_tradeoff | project_deadline | communication | study_exam | work_opportunity | emotion_reset | fact_query | outcome_prediction | person_judgment | high_risk | unclear",
  "scene": "随问 | 感情 | 学业 | 工作 | 人际 | 选择",
  "normalizedQuestion": "string",
  "reason": "string",
  "suggestions": ["string"]
}`;

// ---- 测试用例 ----
const TEST_CASES = [
  // invalid
  { question: "下午下雨吗？",              expectValid: false, expectType: "fact_query" },
  { question: "后天我能不能结婚？",        expectValid: false, expectType: "outcome_prediction" },
  { question: "下午出门会不会碰到帅哥？",  expectValid: false, expectType: "outcome_prediction" },
  { question: "这门课的老师人怎么样？",    expectValid: false, expectType: "person_judgment" },
  { question: "他是不是喜欢我？",          expectValid: false, expectType: "person_judgment" },
  { question: "我是不是生病了？",          expectValid: false, expectType: "high_risk" },
  // valid
  { question: "我要不要接这份 offer？",    expectValid: true },
  { question: "我要不要催导师回消息？",    expectValid: true },
  { question: "我要不要和对方讨论结婚安排？", expectValid: true },
  { question: "这个项目今天要不要先做最小版本？", expectValid: true },
  { question: "下午要不要出门社交？",      expectValid: true },
];

// ---- 调用 DeepSeek ----
async function classify(question, scene = "随问") {
  const res = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify({ question, scene }) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  return JSON.parse(content);
}

// ---- 主流程 ----
const maskedKey = apiKey.slice(0, 7) + "..." + apiKey.slice(-4);

console.log("═══════════════════════════════════════");
console.log("  DeepSeek 分类器批量测试");
console.log("═══════════════════════════════════════");
console.log(`  Key  : ${maskedKey}`);
console.log(`  Model: ${model}`);
console.log(`  用例 : ${TEST_CASES.length} 条`);
console.log("═══════════════════════════════════════\n");

let failed = 0;
const results = [];

for (let i = 0; i < TEST_CASES.length; i++) {
  const tc = TEST_CASES[i];
  const idx = String(i + 1).padStart(2, "0");
  const label = tc.expectValid === false ? "INVALID" : "VALID  ";

  try {
    const r = await classify(tc.question);
    const validOk = r.valid === tc.expectValid;
    const typeOk = tc.expectType ? r.type === tc.expectType : true;
    const ok = validOk && typeOk;

    const icon = ok ? "✅" : "❌";
    const validStr = r.valid ? "true " : "false";
    const typeStr = (r.type ?? "?").padEnd(22);

    let detail = "";
    if (!validOk) {
      detail = `  valid 期望 ${tc.expectValid}，实际 ${r.valid}`;
    }
    if (!typeOk) {
      detail = `  type 期望 ${tc.expectType}，实际 ${r.type}`;
    }

    console.log(`${icon} [${idx}] ${label} │ ${validStr} │ ${typeStr} │ ${tc.question}`);

    if (detail) {
      console.log(`   ${detail}`);
      failed++;
    }

    results.push({ ...tc, result: r, ok });
  } catch (err) {
    console.log(`❌ [${idx}] ERROR │ ${tc.question}`);
    console.log(`   ${err.message}`);
    failed++;
  }
}

console.log("\n═══════════════════════════════════════");
const passed = TEST_CASES.length - failed;
console.log(`  通过: ${passed}/${TEST_CASES.length}`);
if (failed > 0) {
  console.log(`  失败: ${failed}`);
  console.log("═══════════════════════════════════════");
  process.exit(1);
}
console.log("  🎉 全部通过！");
console.log("═══════════════════════════════════════");
