/* ================================================================
   DeepSeek 问题分类器 — 服务端核心
   仅被 api/ 目录和 vite.config.ts 使用，不进入前端 bundle。

   本产品是娱乐向问卦软件「牛马命历」，不是严肃事实问答工具。
   AI 不算卦、不解签、不生成卦象，只分类和转译问题角度。
   ================================================================ */

export interface ClassificationResult {
  valid: boolean;
  mode: "allow" | "playful_reframe" | "block";
  type: string;
  scene: string;
  normalizedQuestion?: string;
  originalQuestion?: string;
  reason?: string;
  suggestions?: string[];
}

const SYSTEM_PROMPT = `你是「牛马命历」问事一卦的题意理解器。
你不算卦，不解签，不预测未来。
你的任务：理解用户想问什么，判断适合哪种签，以及怎么转成更好的问法。

## 本产品定位
这是一个娱乐向、轻玄学向的年轻化产品。用户大多是随口一问、玩梗、或想看一下态势。
不要把用户当成在填正式问卷。
能放行尽量放行，不要过度拦截。

## 三种模式

### block（硬拦截，valid=false）
只在以下情况 block：
1. 健康医疗诊断：我是不是生病了？要不要停药？这个症状严重吗？我会不会得病？
2. 违法或伪造：这件事违法吗？怎么伪造证明？怎么骗老师/公司？怎么规避法律风险？
3. 危险/伤害：怎么报复别人？怎么伤害自己/他人？

返回：
{ "valid": false, "mode": "block", "type": "health_risk | legal_risk | dangerous_or_illicit", ... }

### playful_reframe（娱乐转译，valid=true）
以下问题不要 block，转成娱乐签：
- 他人态度/看法：老板对我怎么看？老师对我什么态度？他是不是对我有意见？领导喜不喜欢我？
  type: "person_attitude" 或 "workplace_dynamic"
- 学业进度/毕业：我什么时候可以毕业？这门课能不能过？老师对我的要求是什么？
  type: "study_school" 或 "future_timing"
- 缺课影响：这节课逃了有没有影响？迟交作业影响大吗？
  type: "course_absence"
- 娱乐预测：下午出门会不会碰到帅哥？今天有没有桃花？今天能不能暴富？今天有没有好运？
  type: "playful_fortune"
- 关系走势：这段关系有没有戏？他会不会想起我？我们最近关系怎么样？
  type: "relationship_dynamic"
- 未来时间：后天我能不能结婚？我什么时候暴富？
  type: "future_timing"

**重要区分**：
- "工作运势"、"职场运势"、"今天工作怎么样" 等带工作关键词的问题 → type: "workplace_dynamic", scene: "工作"
- "财运"、"今天财运" → type: "wealth_luck"
- 只有不含工作/学业/人际等具体领域关键词的"运势"、"好运"、"运气"问题 → type: "playful_fortune"

返回 normalizedQuestion 时将事实/预测/读心类问题转成行动/态势视角。

### allow（正常行动决策，valid=true）
标准的行动决策问题：
- work_opportunity：offer/面试/岗位选择
- action_decision：要不要/该不该/应不应该做某事
- project_deadline：项目/DDL/能不能做完
- communication：要不要联系/催/解释
- emotion_reset：焦虑/内耗/要不要放下
- choice_tradeoff：实习/选课/暑假安排
- study_school：复习策略/课程应对/论文推进

## scene 判断
感情 / 学业 / 工作 / 人际 / 选择 / 随问

## 重要提醒
- 除了健康/违法/危险，不要 block 其他问题
- 用户随口问的娱乐问题、玄学问题，用 playful_reframe 接住
- normalizedQuestion 要转成行动/态势/应对视角
- 不要在 reason 里说教

只输出 JSON，不要解释：
{"valid":true,"mode":"playful_reframe","type":"person_attitude","scene":"工作","normalizedQuestion":"我该怎么判断和老板的相处态势？","reason":"不直接读老板心思，转为相处态势签。","suggestions":[]}`;

export async function classifyWithDeepSeek(
  question: string,
  scene: string,
): Promise<ClassificationResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  const model =
    process.env.DEEPSEEK_CLASSIFIER_MODEL ||
    process.env.DEEPSEEK_MODEL ||
    "deepseek-v4-flash";

  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not set");

  const r = await fetch(`${baseURL}/chat/completions`, {
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

  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`DeepSeek ${r.status}: ${t.slice(0, 200)}`);
  }

  const data = (await r.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response");

  const p = JSON.parse(content);
  return {
    valid: p.valid ?? p.mode !== "block",
    mode: p.mode || (p.valid ? "allow" : "block"),
    type: p.type || "action_decision",
    scene: p.scene || "随问",
    normalizedQuestion: p.normalizedQuestion || undefined,
    originalQuestion: p.originalQuestion || undefined,
    reason: p.reason || undefined,
    suggestions: Array.isArray(p.suggestions) ? p.suggestions : [],
  };
}
