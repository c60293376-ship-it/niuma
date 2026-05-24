/* ================================================================
   Vercel Serverless Function — /api/classify-question

   POST { question: string, scene: string }
   → 返回分类结果 JSON
   ================================================================ */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { classifyWithDeepSeek } from "./_lib/deepseekClassifier";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持 POST 请求" });
  }

  const { question, scene } = req.body || {};

  if (!question || typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "question 不能为空" });
  }

  try {
    const result = await classifyWithDeepSeek(
      question.trim(),
      scene || "随问",
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("DeepSeek classification error:", error);
    // 返回 500 让前端 fallback 到 mock classifier
    return res.status(500).json({
      error: "AI 分类暂不可用",
      message: (error as Error).message,
    });
  }
}
