import { createDivinationSeed } from "../lib/iching/seed";
import { castSixLines, type CastResult } from "../lib/iching/castLines";
import {
  getBaseHexagram,
  getChangedHexagram,
  getPrimaryMovingLine,
} from "../lib/iching/hexagram";
import {
  getDefaultTendency,
  getAllHexagrams,
  getHexagramByBinaryId,
} from "../data/hexagrams";
import { selectSignPoem } from "./selectSignPoem";
import type { AskQuestionType } from "../types/ask";
import { classifyAskQuestion } from "./classifyAskQuestion";
import { getDisplayTendency } from "./displayTendency";
import { buildRuleBasedHexagramReading } from "./buildRuleBasedHexagramReading";

export interface AskResultInput {
  question: string;
  originalQuestion?: string;
  scene: string;
  selectedScene?: string;
  classifiedScene?: string;
  timestamp: number;
  mode?: "allow" | "playful_reframe" | "block";
  sessionId?: number | string;
}

export interface AskResultDebug {
  sessionId: number | string;

  originalQuestion: string;
  normalizedQuestion: string;

  selectedScene: string;
  rawClassification?: unknown;
  finalClassification?: unknown;

  finalMode: string;
  finalQuestionType: string;
  finalScene: string;

  mainHexagram: string;
  changedHexagram: string;
  movingLine: string;
  movingLines?: number[];

  tendency: string;
  displayTendency: string;

  signPoemId?: string;
  signPoemQuestionType?: string;
  signPoemScene?: string;
  signPoemTendency?: string;
  signPoemMatchLevel?: string;

  ruleBasedInterpretation?: string;
  aiRequestSent?: boolean;
  aiResponseSource?: "deepseek" | "rule" | "fallback" | "error" | "timeout" | "rejected";
  aiModel?: string;
  aiStatus?: "not_started" | "loading" | "applied" | "timeout" | "rejected" | "error";
  aiErrorCode?: string;
  aiErrorMessage?: string;
  aiElapsedMs?: number;

  finalInterpretationSource?: "rule" | "ai";
}

export interface AskResultOutput {
  /** 用户原始问题 */
  originalQuestion: string;
  /** AI 转译后的问题 */
  normalizedQuestion: string;
  /** 始终等于 originalQuestion */
  question: string;
  /** 最终使用的 scene（优先 AI 判断） */
  scene: string;
  /** 用户手动选择的 scene */
  selectedScene: string;
  /** AI 分类器返回的 scene */
  classifiedScene: string;
  questionType: AskQuestionType;
  mode: "allow" | "playful_reframe" | "block";
  mainHexagram: string;
  mainHexagramNo: number;
  movingLine: string;
  changedHexagram: string;
  changedHexagramNo: number;
  tendency: string;
  displayTendency: string;
  poem: string;
  interpretation: string;
  action: string[];
  basis: string;
  playfulNotice?: string;
  isStaticHexagram: boolean;
  mainHexagramKeywords: string[];
  mainHexagramMeaning: string;
  changedHexagramKeywords: string[];
  changedHexagramMeaning: string;
  movingLines: number[];
  interpretationSource: "rule" | "ai";
  aiStatus: "idle" | "loading" | "applied" | "timeout" | "rejected" | "error";
  /** 调试字段，仅开发环境使用 */
  debug?: AskResultDebug;
}

/** 生成娱乐签轻提示（playfulNotice），按 questionType 区分 */
function generatePlayfulNotice(
  originalQuestion: string,
  questionType?: string,
): string {
  switch (questionType) {
    case "person_attitude":
      return "此签不直接读人心，只看你们之间的相处态势。";
    case "workplace_dynamic":
      return "此签不替老板发话，只看今日职场态势与工作风向。";
    case "work_opportunity":
      return "此签不直接保结果，只看今日职场态势与应对。";
    case "relationship_dynamic":
      return "此签不替对方表态，只看这段关系的气口和你的应对。";
    case "future_timing":
      return "此签不保具体时间，只看事情推进的节奏。";
    case "playful_fortune":
      if (/帅哥|美女|碰到|遇到|桃花/.test(originalQuestion)) return "此签不保帅哥刷新，只看你今天适不适合出门社交。";
      if (/结婚/.test(originalQuestion)) return "此签不包结婚进度，只看关系推进时机。";
      if (/暴富|发财|中奖|走运/.test(originalQuestion)) return "此签不保暴富，只看今日搞钱状态。";
      return "此签不直接预测结果，只看今日气场。";
    case "course_absence":
      return "此签不鼓励逃课，只看缺课影响和补救空间。";
    case "study_school":
      if (/作业|得分|高分|论文|分数|成绩/.test(originalQuestion))
        return "此签不直接保分数，只看作业质量与得分倾向。";
      return "此签不直接断成绩，只看到学业走势与策略。";
    default:
      if (/帅哥|美女|碰到|遇到|桃花/.test(originalQuestion)) return "此签不保帅哥刷新，只看你今天适不适合出门社交。";
      if (/结婚/.test(originalQuestion)) return "此签不包结婚进度，只看关系推进时机。";
      return "此签不直接预测结果，只看今日行动气场。";
  }
}

/** 六爻 → binaryId */
function linesToBinaryId(lines: number[]): number {
  let id = 0;
  for (let i = 0; i < 6; i++) {
    if (lines[i] === 7 || lines[i] === 9) {
      id |= 1 << i;
    }
  }
  return id;
}

/** 变卦 binaryId（翻转老阴 6→7、老阳 9→8） */
function changedBinaryId(lines: number[]): number {
  const changed = lines.map((v) => {
    if (v === 6) return 7;
    if (v === 9) return 8;
    return v;
  });
  return linesToBinaryId(changed);
}

/** 生成命理依据（basis），结合卦名 briefMeaning */
function generateBasis(
  mainHexagram: string,
  changedHexagram: string,
  questionType: string,
): string {
  const allHexagrams = getAllHexagrams();

  const mainData = allHexagrams.find((h) => h.name === mainHexagram);
  const changedData = allHexagrams.find((h) => h.name === changedHexagram);

  const mainBrief = mainData?.briefMeaning ?? "";
  const changedBrief = changedData?.briefMeaning ?? "";

  let basis = mainHexagram === changedHexagram
    ? `${mainHexagram}：${mainBrief}`
    : `本卦 ${mainHexagram}：${mainBrief} 变卦 ${changedHexagram}：${changedBrief}`;

  // 补充问事类型提示
  const typeHints: Record<string, string> = {
    work_opportunity: "问机会之事，需看成长与成本。",
    choice_tradeoff: "问取舍之事，需看长期收益与代价。",
    project_deadline: "问项目之事，需看范围与可交付性。",
    communication: "问沟通之事，需看时机与方式。",
    study_exam: "问学业之事，需看策略与重点。",
    emotion_reset: "问情绪之事，需先降噪再判断。",
  };
  const hint = typeHints[questionType];
  if (hint) basis += " " + hint;

  return basis;
}

/* ================================================================
   完整起卦 → 签诗匹配 → 结果组装
   ================================================================ */

export function buildAskResult(input: AskResultInput): AskResultOutput {
  const { question, originalQuestion, scene, timestamp, mode, sessionId } = input;
  const sid = sessionId ?? 0;

  // 1. 问题分类
  const classification = classifyAskQuestion(question, scene);
  const questionType = classification.type;
  const effectiveMode = mode || "allow";

  console.log("[Ask Debug - Classification]", {
    sessionId: sid,
    originalQuestion: originalQuestion || question,
    selectedScene: scene,
    rawClassification: classification,
    finalClassification: classification,
  });

  // 2. 起卦
  const seed = createDivinationSeed(question, scene, timestamp);
  const castResult = castSixLines(seed);

  // 3. 卦象解析
  const mainHexagram = getBaseHexagram(castResult.lines);
  const changedHexagram = getChangedHexagram(castResult.lines);
  const movingLine = getPrimaryMovingLine(castResult, seed);

  // 4. 原始倾向 + 展示倾向
  const rawTendency = getDefaultTendencyFromLines(castResult.lines);
  const displayTendency = getDisplayTendency(questionType, rawTendency);

  // 5. 签诗匹配（用原始倾向 + questionType）
  const signResult = selectSignPoem({
    hexagram: mainHexagram,
    questionType: questionType,
    tendency: rawTendency,
    scene,
  });

  console.log("[Ask Debug - SignPoem]", {
    sessionId: sid,
    requestedQuestionType: questionType,
    requestedScene: scene,
    tendency: displayTendency,
    signPoemId: signResult.signPoemId,
    signPoemQuestionType: signResult.signPoemQuestionType,
    signPoemScene: signResult.signPoemScene,
    signPoemTendency: signResult.signPoemTendency,
    matchLevel: signResult.matchLevel,
    poem: signResult.poem,
  });

  // 6. 卦象关键词 + 短解
  const allHexagrams = getAllHexagrams();
  const mainData = allHexagrams.find((h) => h.name === mainHexagram);
  const changedData = allHexagrams.find((h) => h.name === changedHexagram);

  const ruleReading = buildRuleBasedHexagramReading({
    originalQuestion: originalQuestion || question,
    normalizedQuestion: question,
    questionType,
    scene,
    mode: effectiveMode,
    mainHexagram,
    mainHexagramKeywords: mainData?.keywords ?? [],
    changedHexagram,
    changedHexagramKeywords: changedData?.keywords ?? [],
    movingLine,
    displayTendency,
  });

  const interpretation = ruleReading.interpretation;
  const action = ruleReading.actionAdvice;

  console.log("[Ask Debug - Rule Reading]", {
    sessionId: sid,
    questionType: questionType,
    ruleBasedInterpretation: interpretation,
    ruleBasedActionAdvice: action,
  });

  const isStaticHexagram =
    mainHexagram === changedHexagram &&
    castResult.movingLines.length === 0;

  const basis = generateBasis(mainHexagram, changedHexagram, questionType);

  const mainHexagramNo =
    getHexagramByBinaryId(linesToBinaryId(castResult.lines))?.wenwangNo ?? 0;
  const changedHexagramNo =
    getHexagramByBinaryId(changedBinaryId(castResult.lines))?.wenwangNo ?? 0;

  const playfulNotice =
    effectiveMode === "playful_reframe"
      ? generatePlayfulNotice(originalQuestion || question, questionType)
      : undefined;

  // 组装 debug 字段
  const debug: AskResultDebug = {
    sessionId: sid,
    originalQuestion: originalQuestion || question,
    normalizedQuestion: question,
    selectedScene: input.selectedScene || scene,
    rawClassification: classification,
    finalClassification: classification,
    finalMode: effectiveMode,
    finalQuestionType: questionType,
    finalScene: scene,
    mainHexagram,
    changedHexagram,
    movingLine,
    movingLines: castResult.movingLines,
    tendency: rawTendency,
    displayTendency,
    signPoemId: signResult.signPoemId,
    signPoemQuestionType: signResult.signPoemQuestionType,
    signPoemScene: signResult.signPoemScene,
    signPoemTendency: signResult.signPoemTendency,
    signPoemMatchLevel: signResult.matchLevel,
    ruleBasedInterpretation: interpretation,
    aiRequestSent: false,
    aiStatus: "not_started",
    finalInterpretationSource: "rule",
  };

  console.log("[Ask Debug - Final Result]", {
    sessionId: sid,
    displayQuestion: originalQuestion || question,
    finalQuestionType: questionType,
    finalScene: scene,
    signPoemId: debug.signPoemId,
    signPoemQuestionType: debug.signPoemQuestionType,
    finalInterpretationSource: "rule",
    interpretation,
  });

  // 域名覆盖后的 final classification 日志
  console.log("[Ask Debug - Final Classification]", {
    sessionId: sid,
    finalMode: effectiveMode,
    finalQuestionType: questionType,
    finalScene: scene,
    normalizedQuestion: question,
  });

  return {
    question: originalQuestion || question,
    originalQuestion: originalQuestion || question,
    normalizedQuestion: question,
    scene,
    selectedScene: input.selectedScene || scene,
    classifiedScene: input.classifiedScene || scene,
    questionType,
    mode: effectiveMode,
    mainHexagram,
    mainHexagramNo,
    movingLine,
    changedHexagram,
    changedHexagramNo,
    tendency: rawTendency,
    displayTendency,
    poem: signResult.poem,
    interpretation,
    action,
    basis,
    playfulNotice,
    isStaticHexagram,
    mainHexagramKeywords: mainData?.keywords ?? [],
    mainHexagramMeaning: mainData?.briefMeaning ?? "",
    changedHexagramKeywords: changedData?.keywords ?? [],
    changedHexagramMeaning: changedData?.briefMeaning ?? "",
    movingLines: castResult.movingLines,
    interpretationSource: "rule",
    aiStatus: "idle",
    debug,
  };
}

/**
 * 根据用户手动生成的六爻直接构建结果（跳过 seed → castSixLines）。
 */
export function buildAskResultFromLines(input: {
  question: string;
  originalQuestion?: string;
  scene: string;
  selectedScene?: string;
  classifiedScene?: string;
  lines: number[];
  timestamp: number;
  overrideQuestionType?: AskQuestionType;
  finalClassification?: unknown;
  mode?: "allow" | "playful_reframe" | "block";
  sessionId?: number | string;
}): AskResultOutput {
  const { question, originalQuestion, scene, selectedScene, classifiedScene, lines, timestamp, overrideQuestionType, finalClassification, mode, sessionId } = input;
  const effectiveMode = mode || "allow";
  const sid = sessionId ?? 0;

  // 1. 问题分类（优先用 AI 分类器传入的类型）
  const questionType =
    overrideQuestionType ??
    classifyAskQuestion(question, scene).type;

  // 2. 卦象解析
  const movingLines: number[] = [];
  for (let i = 0; i < 6; i++) {
    if (lines[i] === 6 || lines[i] === 9) movingLines.push(i);
  }
  const castResult: CastResult = { lines, movingLines };

  const mainHexagram = getBaseHexagram(lines);
  const changedHexagram = getChangedHexagram(lines);
  const seed = createDivinationSeed(question, scene, timestamp);
  const movingLine = getPrimaryMovingLine(castResult, seed);

  // 3. 原始倾向 + 展示倾向
  const rawTendency = getDefaultTendencyFromLines(lines);
  const displayTendency = getDisplayTendency(questionType, rawTendency);

  // 4. 签诗匹配（用原始倾向 + questionType）
  const signResult = selectSignPoem({
    hexagram: mainHexagram,
    questionType: questionType,
    tendency: rawTendency,
    scene,
  });

  console.log("[Ask Debug - SignPoem]", {
    sessionId: sid,
    requestedQuestionType: questionType,
    requestedScene: scene,
    tendency: displayTendency,
    signPoemId: signResult.signPoemId,
    signPoemQuestionType: signResult.signPoemQuestionType,
    signPoemScene: signResult.signPoemScene,
    signPoemTendency: signResult.signPoemTendency,
    matchLevel: signResult.matchLevel,
    poem: signResult.poem,
  });

  // 5. 卦象关键词 + 短解
  const allHexagrams = getAllHexagrams();
  const mainData = allHexagrams.find((h) => h.name === mainHexagram);
  const changedData = allHexagrams.find((h) => h.name === changedHexagram);

  const ruleReading = buildRuleBasedHexagramReading({
    originalQuestion: originalQuestion || question,
    normalizedQuestion: question,
    questionType,
    scene,
    mode: effectiveMode,
    mainHexagram,
    mainHexagramKeywords: mainData?.keywords ?? [],
    changedHexagram,
    changedHexagramKeywords: changedData?.keywords ?? [],
    movingLine,
    displayTendency,
  });

  const interpretation = ruleReading.interpretation;
  const action = ruleReading.actionAdvice;

  console.log("[Ask Debug - Rule Reading]", {
    sessionId: sid,
    questionType: questionType,
    ruleBasedInterpretation: interpretation,
    ruleBasedActionAdvice: action,
  });

  const isStaticHexagram =
    mainHexagram === changedHexagram &&
    castResult.movingLines.length === 0;

  const basis = generateBasis(mainHexagram, changedHexagram, questionType);

  const mainHexagramNo =
    getHexagramByBinaryId(linesToBinaryId(lines))?.wenwangNo ?? 0;
  const changedHexagramNo =
    getHexagramByBinaryId(changedBinaryId(lines))?.wenwangNo ?? 0;

  const playfulNotice =
    effectiveMode === "playful_reframe"
      ? generatePlayfulNotice(originalQuestion || question, questionType)
      : undefined;

  // 组装 debug 字段
  const debug: AskResultDebug = {
    sessionId: sid,
    originalQuestion: originalQuestion || question,
    normalizedQuestion: question,
    selectedScene: selectedScene || scene,
    finalClassification,
    finalMode: effectiveMode,
    finalQuestionType: questionType,
    finalScene: scene,
    mainHexagram,
    changedHexagram,
    movingLine,
    movingLines,
    tendency: rawTendency,
    displayTendency,
    signPoemId: signResult.signPoemId,
    signPoemQuestionType: signResult.signPoemQuestionType,
    signPoemScene: signResult.signPoemScene,
    signPoemTendency: signResult.signPoemTendency,
    signPoemMatchLevel: signResult.matchLevel,
    ruleBasedInterpretation: interpretation,
    aiRequestSent: false,
    aiStatus: "not_started",
    finalInterpretationSource: "rule",
  };

  console.log("[Ask Debug - Final Result]", {
    sessionId: sid,
    displayQuestion: originalQuestion || question,
    finalQuestionType: questionType,
    finalScene: scene,
    signPoemId: debug.signPoemId,
    signPoemQuestionType: debug.signPoemQuestionType,
    finalInterpretationSource: "rule",
    interpretation,
  });

  return {
    question: originalQuestion || question,
    originalQuestion: originalQuestion || question,
    normalizedQuestion: question,
    scene,
    selectedScene: selectedScene || scene,
    classifiedScene: classifiedScene || scene,
    questionType,
    mode: effectiveMode,
    mainHexagram,
    mainHexagramNo,
    movingLine,
    changedHexagram,
    changedHexagramNo,
    tendency: rawTendency,
    displayTendency,
    poem: signResult.poem,
    interpretation,
    action,
    basis,
    playfulNotice,
    isStaticHexagram,
    mainHexagramKeywords: mainData?.keywords ?? [],
    mainHexagramMeaning: mainData?.briefMeaning ?? "",
    changedHexagramKeywords: changedData?.keywords ?? [],
    changedHexagramMeaning: changedData?.briefMeaning ?? "",
    movingLines: castResult.movingLines,
    interpretationSource: "rule",
    aiStatus: "idle",
    debug,
  };
}

/** 从六爻获取默认行动倾向 */
function getDefaultTendencyFromLines(lines: number[]): string {
  let id = 0;
  for (let i = 0; i < 6; i++) {
    if (lines[i] === 7 || lines[i] === 9) {
      id |= 1 << i;
    }
  }
  return getDefaultTendency(id);
}
