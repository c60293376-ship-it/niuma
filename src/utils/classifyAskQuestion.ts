/* ================================================================
   问事一卦 — 类型兼容层

   所有类型定义已迁移到 src/types/ask.ts。
   本文件保留向后兼容的 re-export 和一个极简的 classifyAskQuestion
   （仅用于 buildAskResult 内部的兜底类型判断，不做拦截）。
   ================================================================ */

export type {
  AskQuestionType,
  ClassificationMode,
  AskScene,
  AskQuestionClassification,
} from "../types/ask";

export interface ClassifyResult {
  type: import("../types/ask").AskQuestionType;
  valid: boolean;
  reason?: string;
  suggestions?: string[];
}

/** 极简兜底：只返回类型，不做拦截 */
export function classifyAskQuestion(
  question: string,
  scene: string,
): ClassifyResult {
  void question;
  void scene;
  return { type: "action_decision", valid: true };
}
