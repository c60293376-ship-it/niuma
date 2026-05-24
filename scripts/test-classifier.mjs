import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ---- 读取 .env.local ----
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

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
  console.error("❌ 无法读取 .env.local，请先在项目根目录创建该文件并设置 DEEPSEEK_API_KEY");
  process.exit(1);
}

if (!apiKey) {
  console.error("❌ .env.local 中未找到 DEEPSEEK_API_KEY");
  process.exit(1);
}

// ---- System Prompt（与 api/_lib/deepseekClassifier.ts 保持一致）----
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

// ---- 测试问题 ----
const TEST_QUESTION = "下午下雨吗？";
const TEST_SCENE = "随问";

// ---- 主流程 ----
const maskedKey = apiKey.slice(0, 7) + "..." + apiKey.slice(-4);

console.log("═══════════════════════════════════════");
console.log("  DeepSeek 分类器连通性测试");
console.log("═══════════════════════════════════════");
console.log(`  API Key : ${maskedKey}`);
console.log(`  Model   : ${model}`);
console.log(`  URL     : ${baseURL}/chat/completions`);
console.log(`  Question: "${TEST_QUESTION}"`);
console.log(`  Scene   : ${TEST_SCENE}`);
console.log("═══════════════════════════════════════\n");

console.log("⏳ 正在请求 DeepSeek...\n");

const startTime = Date.now();

try {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify({ question: TEST_QUESTION, scene: TEST_SCENE }) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  if (!response.ok) {
    const errorText = await response.text().catch(() => "(无响应体)");
    console.log(`❌ HTTP ${response.status}（${elapsed}s）`);
    console.log(`   响应: ${errorText.slice(0, 300)}`);
    process.exit(1);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    console.log(`❌ 响应为空（${elapsed}s）`);
    console.log("   完整响应:", JSON.stringify(data, null, 2).slice(0, 500));
    process.exit(1);
  }

  const parsed = JSON.parse(content);

  console.log(`✅ 请求成功（${elapsed}s）\n`);
  console.log("───────────────────────────────────────");
  console.log("  DeepSeek 返回：");
  console.log("───────────────────────────────────────");
  console.log(JSON.stringify(parsed, null, 2));
  console.log("───────────────────────────────────────\n");

  // 断言检查
  let passed = true;

  if (parsed.valid !== false) {
    console.log("❌ 断言失败: valid 应为 false，实际为", parsed.valid);
    passed = false;
  } else {
    console.log("✅ valid = false  ✓");
  }

  if (parsed.type !== "fact_query") {
    console.log("⚠️  type 期望 fact_query，实际为", parsed.type);
  } else {
    console.log("✅ type = fact_query  ✓");
  }

  if (!parsed.suggestions || parsed.suggestions.length === 0) {
    console.log("⚠️  suggestions 为空（非致命）");
  } else {
    console.log(`✅ suggestions: ${parsed.suggestions.length} 条`);
  }

  console.log("");
  if (passed) {
    console.log("🎉 核心断言全部通过！分类器工作正常。");
    process.exit(0);
  } else {
    console.log("⚠️  部分断言未通过，请检查上方输出。");
    process.exit(1);
  }
} catch (err) {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`❌ 网络错误（${elapsed}s）: ${err.message}`);
  process.exit(1);
}
