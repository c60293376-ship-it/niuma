/* ================================================================
   问事一卦 — 统一类型定义
   全项目共享，避免多文件重复定义
   ================================================================ */

export type ClassificationMode = "allow" | "playful_reframe" | "block";

export type AskQuestionType =
  | "action_decision"
  | "relationship_dynamic"
  | "person_attitude"
  | "study_school"
  | "workplace_dynamic"
  | "future_timing"
  | "playful_fortune"
  | "wealth_luck"
  | "weather_travel"
  | "course_absence"
  | "choice_tradeoff"
  | "project_deadline"
  | "communication"
  | "emotion_reset"
  | "work_opportunity"
  | "health_risk"
  | "legal_risk"
  | "dangerous_or_illicit"
  | "unclear";

export type AskScene = "随问" | "感情" | "学业" | "工作" | "人际" | "选择";

export interface AskQuestionClassification {
  valid: boolean;
  mode: ClassificationMode;
  type: AskQuestionType;
  scene: AskScene;
  originalQuestion?: string;
  normalizedQuestion?: string;
  reason?: string;
  suggestions?: string[];
  source?: string;
}
