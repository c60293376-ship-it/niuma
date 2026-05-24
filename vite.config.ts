import { defineConfig, loadEnv, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { IncomingMessage, ServerResponse } from "http";

interface InterpreterPayload {
  originalQuestion?: string;
  normalizedQuestion?: string;
  questionType?: string;
  scene?: string;
  mainHexagram?: string;
  mainHexagramNo?: number | string;
  mainHexagramKeywords?: string[];
  mainHexagramMeaning?: string;
  changedHexagram?: string;
  changedHexagramNo?: number | string;
  changedHexagramKeywords?: string[];
  changedHexagramMeaning?: string;
  movingLine?: string;
  movingLines?: string[];
  displayTendency?: string;
  poem?: string;
  ruleBasedInterpretation?: string;
  ruleBasedActionAdvice?: string[];
}

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

/* ================================================================
   开发环境 API 中间件 — 本地提供 /api/classify-question

   使用 Vite loadEnv 显式加载 .env.local，确保
   process.env.DEEPSEEK_API_KEY 在中间件中可用。
   ================================================================ */

function apiDevMiddleware(mode: string) {
  // 加载 .env.local 到 process.env（Vite 默认只加载 VITE_ 前缀的变量）
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith("DEEPSEEK_") || !process.env[key]) {
      process.env[key] = value;
    }
  }

  // 安全调试日志（不打印完整 key）
  console.log("[classify-question env]", {
    hasKey: !!process.env.DEEPSEEK_API_KEY,
    prefix: process.env.DEEPSEEK_API_KEY?.slice(0, 7),
    length: process.env.DEEPSEEK_API_KEY?.length,
  });

  return {
    name: "api-dev-middleware",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        "/api/classify-question",
        async (req: IncomingMessage, res: ServerResponse) => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");

          if (req.method === "OPTIONS") {
            res.writeHead(200);
            res.end();
            return;
          }

          if (req.method !== "POST") {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "只支持 POST 请求" }));
            return;
          }

          const body = await readBody(req);
          let question: string;
          let scene: string;
          try {
            const parsed = JSON.parse(body);
            question = parsed.question;
            scene = parsed.scene || "随问";
          } catch {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "无效的 JSON body" }));
            return;
          }

          if (!question || typeof question !== "string" || !question.trim()) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "question 不能为空" }));
            return;
          }

          try {
            const { classifyWithDeepSeek } = await import(
              "./api/_lib/deepseekClassifier"
            );
            const result = await classifyWithDeepSeek(
              question.trim(),
              scene,
            );
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ...result, source: "deepseek" }));
          } catch (err) {
            console.warn(
              "DeepSeek API 失败 → 返回 500 让前端 fallback 到 mock：",
              (err as Error).message,
            );
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: "AI 分类暂不可用",
                message: (err as Error).message,
              }),
            );
          }
        },
      );

      // ====== /api/interpret-ask-result（AI 解签转译）======
      server.middlewares.use(
        "/api/interpret-ask-result",
        async (req: IncomingMessage, res: ServerResponse) => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");

          if (req.method === "OPTIONS") {
            res.writeHead(200); res.end(); return;
          }
          if (req.method !== "POST") {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "只支持 POST" }));
            return;
          }

          const body = await readBody(req);
          let parsed: InterpreterPayload;
          try { parsed = JSON.parse(body); } catch {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "无效 JSON" }));
            return;
          }
          if (!parsed.originalQuestion) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "originalQuestion required" }));
            return;
          }

          try {
            const apiKey = process.env.DEEPSEEK_API_KEY;
            const baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
            const model =
              process.env.DEEPSEEK_INTERPRETER_MODEL ||
              process.env.DEEPSEEK_MODEL ||
              "deepseek-v4-pro";
            if (!apiKey) throw new Error("DEEPSEEK_API_KEY not set");

            const r = await fetch(`${baseURL}/chat/completions`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model,
                messages: [
                  {
                    role: "system",
                    content: `你是「牛马命历」问事一卦解卦器。只解读，不起卦，不改本卦、变卦、动爻、签诗、行动倾向。必须只输出 JSON：{"interpretation":"string","actionAdvice":["string","string","string"]}。interpretation 用中文100-160字最多3句：先说本卦当前态势，再说变卦变化方向，最后落到用户原问题。actionAdvice固定3条中文建议，每条10-18字。不要说一定、保证、必然、绝对。`,
                  },
                  {
                    role: "user",
                    content: [
                      `用户原问题：${parsed.originalQuestion}`,
                      `占问主题：${parsed.normalizedQuestion || parsed.originalQuestion}`,
                      `问题类型：${parsed.questionType || "action_decision"}`,
                      `场景：${parsed.scene || "随问"}`,
                      `本卦：${parsed.mainHexagram}，第 ${parsed.mainHexagramNo ?? "?"} 卦`,
                      `本卦关键词：${(parsed.mainHexagramKeywords || []).join("、")}`,
                      `本卦简义：${parsed.mainHexagramMeaning || ""}`,
                      `变卦：${parsed.changedHexagram}，第 ${parsed.changedHexagramNo ?? "?"} 卦`,
                      `变卦关键词：${(parsed.changedHexagramKeywords || []).join("、")}`,
                      `变卦简义：${parsed.changedHexagramMeaning || ""}`,
                      `动爻：${parsed.movingLine || "无"}`,
                      `全部动爻：${(parsed.movingLines || []).length > 0 ? (parsed.movingLines || []).join("、") : "无"}`,
                      `行动倾向：${parsed.displayTendency}`,
                      `签诗：${parsed.poem || ""}`,
                      `规则卦象短解：${parsed.ruleBasedInterpretation || ""}`,
                      `请基于卦象解读用户原问题。不要只解释签诗。不要只给建议。先做卦象判断，再给 3 条建议。`,
                    ].filter(Boolean).join("\n\n"),
                  },
                ],
                response_format: { type: "json_object" },
                temperature: 0.45,
                max_tokens: 420,
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
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
              interpretation: p.interpretation || parsed.ruleBasedInterpretation || "",
              actionAdvice: (Array.isArray(p.actionAdvice) && p.actionAdvice.length >= 2)
                ? p.actionAdvice.slice(0, 3)
                : (parsed.ruleBasedActionAdvice || []),
              source: "deepseek",
              model,
            }));
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
            } else if (errMsg.includes("Empty") || errMsg.includes("empty")) {
              errorType = "empty_response";
            } else if (errMsg.includes("JSON") || errMsg.includes("parse")) {
              errorType = "json_parse_failed";
            } else if (errMsg.includes("fetch") || errMsg.includes("network") || errMsg.includes("ENOTFOUND")) {
              errorType = "network_error";
            }
            console.warn("AI interpret failed, fallback:", { errorType, errorMessage: errMsg });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
              interpretation: parsed.ruleBasedInterpretation || "",
              actionAdvice: parsed.ruleBasedActionAdvice || [],
              source: "error",
              model: process.env.DEEPSEEK_INTERPRETER_MODEL || process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
              errorType,
              errorMessage: errMsg.slice(0, 300),
            }));
          }
        },
      );
    },
  };
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: Buffer) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), apiDevMiddleware(mode)],
}));
