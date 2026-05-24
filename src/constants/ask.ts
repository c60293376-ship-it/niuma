/* ================================================================
   问事一卦 — 统一常量

   前端和后端必须使用相同的值。
   服务端 api/interpret-ask-result.ts 中定义了同名常量，
   修改这里时请同步更新服务端。
   ================================================================ */

/** AI 解卦超时（毫秒） */
export const AI_INTERPRETER_TIMEOUT_MS = 20000;

/** AI 解卦 max_tokens */
export const AI_INTERPRETER_MAX_TOKENS = 420;

/** AI 解卦 temperature */
export const AI_INTERPRETER_TEMPERATURE = 0.45;
