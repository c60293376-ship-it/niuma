import type { VercelRequest, VercelResponse } from "@vercel/node";

/* ══════════════════════════════════════════
   服务端常量 — 必须与 src/constants/ask.ts 保持一致
   ══════════════════════════════════════════ */
const AI_INTERPRETER_MAX_TOKENS = 420;
const AI_INTERPRETER_TEMPERATURE = 0.45;

interface DeepSeekChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface InterpreterJsonResponse {
  interpretation?: string;
  actionAdvice?: unknown[];
}

/* ══════════════════════════════════════════
   System Prompt
   ══════════════════════════════════════════ */

const SYSTEM_PROMPT = `你是「牛马命历」问事一卦解卦器。只解读，不起卦，不改本卦、变卦、动爻、签诗、行动倾向。
必须只输出 JSON：{"interpretation":"string","actionAdvice":["string","string","string"]}
interpretation 用中文 100-160 字，最多 3 句：先说本卦当前态势，再说变卦变化方向，最后落到用户原问题。
actionAdvice 固定 3 条中文建议，每条 10-18 字。
不要说一定、保证、必然、绝对。`;

/* ══════════════════════════════════════════
   Handler
   ══════════════════════════════════════════ */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "只支持 POST" });

  const body = req.body || {};
  if (!body.originalQuestion) return res.status(400).json({ error: "originalQuestion required" });

  const model = process.env.DEEPSEEK_INTERPRETER_MODEL || process.env.DEEPSEEK_MODEL || "deepseek-v4-pro";

  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("DEEPSEEK_API_KEY not set");

    const userMsg = [
      `用户原问题：${body.originalQuestion}`,
      `占问主题：${body.normalizedQuestion || body.originalQuestion}`,
      `问题类型：${body.questionType || "action_decision"}`,
      `场景：${body.scene || "随问"}`,
      `本卦：${body.mainHexagram}，第 ${body.mainHexagramNo ?? "?"} 卦`,
      `本卦关键词：${(body.mainHexagramKeywords || []).join("、")}`,
      `本卦简义：${body.mainHexagramMeaning || ""}`,
      `变卦：${body.changedHexagram}，第 ${body.changedHexagramNo ?? "?"} 卦`,
      `变卦关键词：${(body.changedHexagramKeywords || []).join("、")}`,
      `变卦简义：${body.changedHexagramMeaning || ""}`,
      `动爻：${body.movingLine || "无"}`,
      `全部动爻：${(body.movingLines || []).length > 0 ? body.movingLines.join("、") : "无"}`,
      `行动倾向：${body.displayTendency || ""}`,
      `签诗：${body.poem || ""}`,
      `规则卦象短解：${body.ruleBasedInterpretation || ""}`,
      `请基于卦象解读用户原问题。不要只解释签诗。不要只给建议。先做卦象判断，再给 3 条建议。`,
    ].filter(Boolean).join("\n\n");

    const r = await fetch(`${process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com"}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMsg },
        ],
        response_format: { type: "json_object" },
        temperature: AI_INTERPRETER_TEMPERATURE,
        max_tokens: AI_INTERPRETER_MAX_TOKENS,
      }),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      const error: Error & { code?: string } = new Error(`DeepSeek ${r.status}: ${text.slice(0, 200)}`);
      error.code = `deepseek_http_${r.status}`;
      throw error;
    }
    const data = (await r.json()) as DeepSeekChatResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty");

    let p: InterpreterJsonResponse;
    try {
      p = JSON.parse(content);
    } catch (parseError) {
      const error: Error & { code?: string } = new Error(
        `JSON parse failed: ${(parseError as Error).message}; content=${content.slice(0, 200)}`,
      );
      error.code = "json_parse_failed";
      throw error;
    }
    return res.status(200).json({
      interpretation: p.interpretation || body.ruleBasedInterpretation || "",
      actionAdvice: (Array.isArray(p.actionAdvice) && p.actionAdvice.length >= 2)
        ? p.actionAdvice.slice(0, 3)
        : (body.ruleBasedActionAdvice || ["先思考", "不要急", "做好眼前的事"]),
      source: "deepseek",
      model,
    });
  } catch (err) {
    const errMsg = (err as Error).message || "";
    const explicitCode = (err as Error & { code?: string }).code;
    let errorType = "unknown";
    if (explicitCode) {
      errorType = explicitCode;
    } else if (errMsg.includes("DEEPSEEK_API_KEY") || errMsg.includes("not set")) {
      errorType = "api_key_missing";
    } else if (errMsg.includes("401")) {
      errorType = "api_401";
    } else if (errMsg.includes("403")) {
      errorType = "api_403";
    } else if (errMsg.includes("429")) {
      errorType = "api_429";
    } else if (errMsg.includes("DeepSeek 5")) {
      errorType = "deepseek_5xx";
    } else if (errMsg.includes("Empty") || errMsg.includes("empty")) {
      errorType = "empty_response";
    } else if (errMsg.includes("JSON") || errMsg.includes("parse")) {
      errorType = "json_parse_failed";
    } else if (errMsg.includes("abort") || errMsg.includes("timeout")) {
      errorType = "timeout";
    } else if (errMsg.includes("fetch") || errMsg.includes("network") || errMsg.includes("ENOTFOUND")) {
      errorType = "network_error";
    }
    console.error("[AI Interpreter Error]", { errorType, errorMessage: errMsg });
    return res.status(200).json({
      interpretation: body.ruleBasedInterpretation || "",
      actionAdvice: body.ruleBasedActionAdvice || ["先思考", "不要急", "做好眼前的事"],
      source: "error",
      model,
      errorType,
      errorMessage: errMsg.slice(0, 300),
    });
  }
}
