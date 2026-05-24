/* ================================================================
   AI 解签 — 前端服务封装
   超时和 max_tokens 统一从 src/constants/ask.ts 读取
   ================================================================ */

import {
  AI_INTERPRETER_TIMEOUT_MS,
} from "../constants/ask";

export interface InterpretInput {
  originalQuestion: string;
  normalizedQuestion: string;
  mode: string;
  questionType: string;
  scene: string;
  mainHexagram: string;
  mainHexagramNo: number;
  mainHexagramKeywords: string[];
  mainHexagramMeaning: string;
  changedHexagram: string;
  changedHexagramNo: number;
  changedHexagramKeywords: string[];
  changedHexagramMeaning: string;
  movingLine: string;
  movingLines: number[];
  displayTendency: string;
  poem: string;
  basis: string;
  playfulNotice: string;
  ruleBasedInterpretation: string;
  ruleBasedActionAdvice: string[];
  _sessionId?: number | string;
}

export interface InterpretOutput {
  interpretation: string;
  actionAdvice: string[];
  source?: string;
  model?: string;
  errorType?: string;
  errorMessage?: string;
}

export type AiInterpretStatus = "applied" | "timeout" | "rejected" | "error";

export interface InterpretServiceResult {
  aiStatus: AiInterpretStatus;
  interpretation?: string;
  actionAdvice?: string[];
  source: "deepseek" | "error" | "timeout" | "rejected";
  model?: string;
  errorCode?: string;
  errorMessage?: string;
  elapsedMs?: number;
}

/** 内容相关性校验 */
function validateAIResult(
  result: InterpretOutput,
  questionType: string,
): boolean {
  const interp = result.interpretation || "";
  if (!interp || interp.length > 360) return false;
  if (!Array.isArray(result.actionAdvice) || result.actionAdvice.length < 2) return false;
  if (result.actionAdvice.some((s) => !s || s.trim().length === 0)) return false;

  const combined = `${interp}\n${result.actionAdvice.join("\n")}`;
  const kwMap: Record<string, RegExp> = {
    weather_travel: /天气|出行|伞|路线|安排|变动|天色|户外/,
    wealth_luck: /财|钱|收益|支出|成本|搞钱|花销/,
    communication: /说|发|问|沟通|语气|回复|消息|催/,
    work_opportunity: /offer|工作|岗位|成长|成本|边界|机会/,
    project_deadline: /项目|demo|闭环|功能|需求|展示|DDL|可展示/,
    course_absence: /课|缺课|点名|笔记|平时分|补救|影响/,
    person_attitude: /老板|老师|对方|态度|信号|表现|互动|汇报|相处/,
    workplace_dynamic: /老板|领导|职场|态度|汇报|信号|表现|互动/,
    playful_fortune: /桃花|好运|运势|气场|状态|出门|机会|缘分|露面|社交|轻松|顺势|主动|节奏|变卦|本卦|卦象/,
    emotion_reset: /情绪|心|焦虑|内耗|放下|缓冲|暂停/,
    relationship_dynamic: /关系|气口|推进|对方|节奏|互动|等待/,
    study_school: /作业|分数|高分|老师|评分|课程|论文|要求|结构|材料|修改|完成度|学|考试|复习/,
    choice_tradeoff: /取舍|选择|代价|长期|放弃|成长/,
    future_timing: /时间|节奏|条件|推进|准备|等待/,
  };

  const regex = kwMap[questionType];
  if (regex && !regex.test(combined)) {
    console.warn("[AI rejected: irrelevant]", { questionType, interp: interp.slice(0, 80) });
    return false;
  }
  return true;
}

export async function interpretAskResultWithAI(
  input: InterpretInput,
): Promise<InterpretServiceResult> {
  console.log("[Ask Debug - AI Request]", {
    sessionId: (input._sessionId ?? "unknown"),
    originalQuestion: input.originalQuestion,
    normalizedQuestion: input.normalizedQuestion,
    questionType: input.questionType,
    scene: input.scene,
    mainHexagram: input.mainHexagram,
    changedHexagram: input.changedHexagram,
    movingLine: input.movingLine,
    displayTendency: input.displayTendency,
    poem: input.poem,
  });

  const controller = new AbortController();
  const startedAt = Date.now();
  const timer = setTimeout(() => controller.abort(), AI_INTERPRETER_TIMEOUT_MS);

  try {
    const r = await fetch("/api/interpret-ask-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!r.ok) {
      return {
        aiStatus: "error",
        source: "error",
        errorCode: `api_http_${r.status}`,
        errorMessage: `API ${r.status}`,
        elapsedMs: Date.now() - startedAt,
      };
    }

    const data = await r.json() as InterpretOutput;

    // 检查 API 返回的 source 是否 error（API 内部捕获的异常）
    if (data.source === "error") {
      console.warn("[AI Interpreter Error]", {
        sessionId: input._sessionId ?? "unknown",
        status: "api_returned_error",
        errorType: data.errorType || "unknown",
        errorMessage: data.errorMessage || "No error message from API",
      });
      console.log("[Ask Debug - AI Response]", {
        sessionId: input._sessionId ?? "unknown",
        source: "error",
        aiStatus: "error",
        errorType: data.errorType,
      });
      return {
        aiStatus: data.errorType === "timeout" ? "timeout" : "error",
        source: "error",
        model: data.model,
        errorCode: data.errorType || "api_returned_error",
        errorMessage: data.errorMessage || "No error message from API",
        elapsedMs: Date.now() - startedAt,
      };
    }

    if (!validateAIResult(data, input.questionType)) {
      console.warn("[AI Interpreter Error]", {
        sessionId: input._sessionId ?? "unknown",
        status: "rejected",
        errorType: "validate_rejected",
        errorMessage: "AI response failed content relevance check for questionType=" + input.questionType,
        interpretation: data.interpretation?.slice(0, 60),
      });
      console.log("[Ask Debug - AI Response]", {
        sessionId: (input._sessionId ?? "unknown"),
        source: "rejected",
        model: data.model,
        aiStatus: "rejected",
        interpretation: data.interpretation,
        actionAdvice: data.actionAdvice,
      });
      return {
        aiStatus: "rejected",
        source: "rejected",
        model: data.model,
        errorCode: "validate_rejected",
        errorMessage: "AI response failed content relevance check for questionType=" + input.questionType,
        elapsedMs: Date.now() - startedAt,
      };
    }

    console.log("[Ask Debug - AI Response]", {
      sessionId: (input._sessionId ?? "unknown"),
      source: data.source ?? "deepseek",
      model: data.model,
      aiStatus: "applied",
      interpretation: data.interpretation,
      actionAdvice: data.actionAdvice,
    });

    return {
      aiStatus: "applied",
      interpretation: data.interpretation,
      actionAdvice: data.actionAdvice,
      source: (data.source as "deepseek") ?? "deepseek",
      model: data.model,
      elapsedMs: Date.now() - startedAt,
    };
  } catch (err) {
    clearTimeout(timer);
    const sid = input._sessionId ?? "unknown";
    if ((err as Error).name === "AbortError") {
      console.warn("[AI Interpreter Error]", {
        sessionId: sid,
        status: "timeout",
        errorType: "timeout",
        errorMessage: "Request aborted after " + AI_INTERPRETER_TIMEOUT_MS + "ms",
      });
      console.log("[Ask Debug - AI Response]", {
        sessionId: sid,
        source: "timeout",
        aiStatus: "timeout",
        interpretation: null,
      });
      return {
        aiStatus: "timeout",
        source: "timeout",
        errorCode: "timeout",
        errorMessage: "Request aborted after " + AI_INTERPRETER_TIMEOUT_MS + "ms",
        elapsedMs: Date.now() - startedAt,
      };
    } else {
      const errMsg = (err as Error).message || "Unknown error";
      let errorType = "unknown";
      if (errMsg.includes("fetch") || errMsg.includes("network") || errMsg.includes("ENOTFOUND") || errMsg.includes("Failed to fetch")) {
        errorType = "network_error";
      }
      console.warn("[AI Interpreter Error]", {
        sessionId: sid,
        status: "error",
        errorType,
        errorMessage: errMsg.slice(0, 300),
      });
      console.log("[Ask Debug - AI Response]", {
        sessionId: sid,
        source: "error",
        aiStatus: "error",
        errorType,
        interpretation: null,
      });
      return {
        aiStatus: "error",
        source: "error",
        errorCode: errorType,
        errorMessage: errMsg.slice(0, 300),
        elapsedMs: Date.now() - startedAt,
      };
    }
  }
}
