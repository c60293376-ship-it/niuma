import { useEffect, useState, useRef } from "react";
import { quickQuestions, sceneOptions } from "../data/mockAsk";
import {
  buildAskResultFromLines,
  type AskResultOutput,
} from "../utils/buildAskResult";
import {
  classifyAskQuestion,
  type AskClassificationType,
} from "../services/askQuestionClassifier";
import { interpretAskResultWithAI } from "../services/aiAskInterpreter";
import SceneSelector from "../components/SceneSelector";
import QuestionInputCard from "../components/QuestionInputCard";
import PrimaryButton from "../components/PrimaryButton";
import AskResultSheet from "../components/AskResultSheet";
import CastingSheet from "../components/CastingSheet";
import QuickQuestionChips from "../components/QuickQuestionChips";

type AskStatus = "idle" | "classifying" | "casting" | "interpreting" | "result";

const STATUS_LABEL: Record<AskStatus, string> = {
  idle: "开始起卦",
  classifying: "正在辨题……",
  casting: "正在起卦……",
  interpreting: "正在解卦……",
  result: "查看结果中",
};

interface AskPageProps {
  onOverlayStepChange?: (isOverlayStep: boolean) => void;
}

const pageStyle: React.CSSProperties = {
  height: "100dvh",
  minHeight: "100dvh",
  marginLeft: -20,
  marginRight: -20,
  marginTop: 0,
  marginBottom: -92,
  padding: "clamp(264px, 62vw, 292px) 20px 104px",
  backgroundImage: "url('/assets/ask-page-bg.png')",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top center",
  backgroundSize: "100% 100%",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  overflow: "hidden",
};

const floatingPanelStyle: React.CSSProperties = {
  background: "rgba(255, 248, 243, 0.86)",
  border: "1px solid rgba(234, 200, 188, 0.56)",
  borderRadius: 26,
  boxShadow: "0 10px 30px rgba(120,72,60,0.10)",
  backdropFilter: "blur(8px)",
};

export default function AskPage({ onOverlayStepChange }: AskPageProps) {
  const [scene, setScene] = useState("随问");
  const [question, setQuestion] = useState("");
  const [resultHint, setResultHint] = useState("");
  const [resultOpen, setResultOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<AskResultOutput | null>(null);
  const [validationError, setValidationError] = useState<{
    type: AskClassificationType;
    reason: string;
    suggestions: string[];
    suggestedScene: string;
  } | null>(null);
  const [castingOpen, setCastingOpen] = useState(false);
  const [castingSessionId, setCastingSessionId] = useState(0);

  // 流程状态机 + 会话 ID（防竞态）
  const [askStatus, setAskStatus] = useState<AskStatus>("idle");
  const activeSessionRef = useRef(0);

  // 暂存 AI 分类结果
  const [pendingNormalizedQuestion, setPendingNormalizedQuestion] = useState<string | null>(null);
  const [pendingScene, setPendingScene] = useState<string | null>(null);
  const [pendingQuestionType, setPendingQuestionType] = useState<string | null>(null);
  const [pendingMode, setPendingMode] = useState<"allow" | "playful_reframe" | "block" | null>(null);
  const [pendingOriginalQuestion, setPendingOriginalQuestion] = useState<string | null>(null);
  const [pendingSelectedScene, setPendingSelectedScene] = useState<string | null>(null);
  const [pendingClassifiedScene, setPendingClassifiedScene] = useState<string | null>(null);

  useEffect(() => {
    onOverlayStepChange?.(castingOpen || resultOpen);
    return () => onOverlayStepChange?.(false);
  }, [castingOpen, resultOpen, onOverlayStepChange]);

  /** 唯一入口：安全打开结果卡（只有当前 session 才能弹出） */
  function openResultForSession(result: AskResultOutput, sessionId: number) {
    if (activeSessionRef.current !== sessionId) {
      console.log("[AskSession] stale result ignored", sessionId);
      return;
    }
    setCurrentResult(result);
    setResultOpen(true);
    setAskStatus("result");
  }

  /** 安全关闭结果卡，回到 idle */
  function resetToIdle() {
    setResultOpen(false);
    setCurrentResult(null);
    setAskStatus("idle");
    activeSessionRef.current = 0;
  }

  const handleStart = async () => {
    if (!question.trim()) {
      setResultHint("先写下你想问的事。");
      setValidationError(null);
      return;
    }

    // 防重复触发
    if (askStatus !== "idle") return;

    // 生成新 session，让所有旧请求作废
    const sessionId = Date.now();
    activeSessionRef.current = sessionId;

    setAskStatus("classifying");
    setResultHint("");
    setValidationError(null);

    // ---- 分类 ----
    let classification;
    try {
      classification = await classifyAskQuestion(question, scene);
    } catch {
      console.warn("[AskClassifier] 分类器不可用");
      setAskStatus("idle");
      setValidationError({
        type: "unclear",
        reason: "问题分类服务暂不可用，请稍后重试。",
        suggestions: [],
        suggestedScene: scene,
      });
      return;
    }

    // session 校验
    if (activeSessionRef.current !== sessionId) {
      console.log("[AskSession] stale classification ignored", sessionId);
      return;
    }

    console.log("[Ask Debug - Classification]", {
      sessionId,
      originalQuestion: question,
      selectedScene: scene,
      rawClassification: classification,
      finalClassification: classification,
    });
    console.log("[Ask Debug - Final Classification]", {
      sessionId,
      finalMode: classification.mode,
      finalQuestionType: classification.type,
      finalScene: classification.scene || scene,
      normalizedQuestion: classification.normalizedQuestion,
    });

    const isBlocked = classification.mode === "block" || !classification.valid;
    if (isBlocked) {
      console.log("[AskClassifier Blocked]", { type: classification.type });
      setAskStatus("idle");
      setValidationError({
        type: classification.type,
        reason: classification.reason ?? "问事一卦更适合判断「我该怎么做」…",
        suggestions: classification.suggestions ?? [],
        suggestedScene: classification.scene ?? scene,
      });
      return;
    }

    // 保存分类结果（scene 优先 AI 判断，AI 不确定时用用户选择）
    const normalized = classification.normalizedQuestion || question;
    const classifiedScene = classification.scene || "随问";
    const selectedScene = scene;
    const finalScene =
      classifiedScene !== "随问"
        ? classifiedScene
        : selectedScene !== "随问"
          ? selectedScene
          : "随问";
    const aiType = classification.type;
    const aiMode = classification.mode || "allow";
    const original = classification.originalQuestion || question;
    setPendingNormalizedQuestion(normalized);
    setPendingScene(finalScene);
    setPendingSelectedScene(selectedScene);
    setPendingClassifiedScene(classifiedScene);
    setPendingQuestionType(aiType);
    setPendingMode(aiMode);
    setPendingOriginalQuestion(original);

    if (finalScene !== scene) setScene(finalScene);

    // 进入起卦
    setCurrentResult(null);
    setAskStatus("casting");
    setCastingSessionId((prev) => prev + 1);
    setCastingOpen(true);
  };

  /** 起卦完成 → 立即显示规则短解 → 后台 AI 升级 */
  const handleCastingComplete = async (lines: number[]) => {
    const sessionId = activeSessionRef.current;
    setCastingOpen(false);

    if (activeSessionRef.current !== sessionId) return;

    const displayQuestion = pendingNormalizedQuestion || question;
    const effectiveScene =
      pendingScene !== null
        ? pendingScene === "随问" ? "通用" : pendingScene
        : scene === "随问" ? "通用" : scene;

    // 规则起卦
    const result = buildAskResultFromLines({
      question: displayQuestion,
      originalQuestion: pendingOriginalQuestion || question,
      scene: effectiveScene,
      selectedScene: pendingSelectedScene || scene,
      classifiedScene: pendingClassifiedScene || effectiveScene,
      lines,
      timestamp: Date.now(),
      overrideQuestionType:
        (pendingQuestionType as import("../types/ask").AskQuestionType) ?? undefined,
      finalClassification: classificationForPending(
        pendingQuestionType,
        pendingMode,
        effectiveScene,
        displayQuestion,
      ),
      mode: pendingMode || "allow",
      sessionId,
    });

    clearPending();

    if (activeSessionRef.current !== sessionId) return;

    // 先进入解卦加载态，不提前展示规则短解；AI 结束后只打开一次结果卡。
    result.interpretationSource = "rule";
    result.aiStatus = "loading";
    if (result.debug) {
      result.debug.aiRequestSent = true;
      result.debug.aiStatus = "loading";
    }
    setAskStatus("interpreting");

    // 请求 AI 精解（仅当前 session）；失败/超时再展示规则短解。
    console.log("[AI Interpreter Called]", sessionId);
    const aiResult = await interpretAskResultWithAI({
      originalQuestion: result.originalQuestion,
      normalizedQuestion: result.normalizedQuestion,
      mode: result.mode,
      questionType: result.questionType,
      scene: result.scene,
      mainHexagram: result.mainHexagram,
      mainHexagramNo: result.mainHexagramNo,
      mainHexagramKeywords: result.mainHexagramKeywords ?? [],
      mainHexagramMeaning: result.mainHexagramMeaning ?? "",
      changedHexagram: result.changedHexagram,
      changedHexagramNo: result.changedHexagramNo,
      changedHexagramKeywords: result.changedHexagramKeywords ?? [],
      changedHexagramMeaning: result.changedHexagramMeaning ?? "",
      movingLine: result.movingLine,
      movingLines: result.movingLines ?? [],
      displayTendency: result.displayTendency,
      poem: result.poem,
      basis: result.basis,
      playfulNotice: result.playfulNotice || "",
      ruleBasedInterpretation: result.interpretation,
      ruleBasedActionAdvice: result.action,
      _sessionId: sessionId,
    });

    // session 校验
    if (activeSessionRef.current !== sessionId) {
      console.log("[AskSession] stale AI ignored", sessionId);
      return;
    }

    if (aiResult.aiStatus === "applied" && aiResult.interpretation && aiResult.actionAdvice) {
      result.interpretation = aiResult.interpretation;
      result.action = aiResult.actionAdvice;
      result.interpretationSource = "ai";
      result.aiStatus = "applied";
      if (result.debug) {
        result.debug.aiResponseSource = aiResult.source ?? "deepseek";
        result.debug.aiModel = aiResult.model;
        result.debug.aiStatus = "applied";
        result.debug.aiElapsedMs = aiResult.elapsedMs;
        result.debug.finalInterpretationSource = "ai";
      }
      console.log("[AI Interpreter Applied]", aiResult.source);
    } else {
      result.aiStatus = aiResult.aiStatus;
      if (result.debug) {
        result.debug.aiStatus = aiResult.aiStatus;
        result.debug.aiResponseSource = aiResult.source;
        result.debug.aiErrorCode = aiResult.errorCode;
        result.debug.aiErrorMessage = aiResult.errorMessage;
        result.debug.aiElapsedMs = aiResult.elapsedMs;
        result.debug.finalInterpretationSource = "rule";
      }
      console.warn("[AI Interpreter Failed] keeping rule-based reading", {
        aiStatus: aiResult.aiStatus,
        errorCode: aiResult.errorCode,
      });
    }

    console.log("[Ask Debug - Final Result]", {
      sessionId,
      displayQuestion: result.originalQuestion,
      finalQuestionType: result.questionType,
      finalScene: result.scene,
      signPoemId: result.debug?.signPoemId,
      signPoemQuestionType: result.debug?.signPoemQuestionType,
      finalInterpretationSource: result.interpretationSource,
      interpretation: result.interpretation?.slice(0, 60),
    });

    openResultForSession({ ...result }, sessionId);
  };

  function clearPending() {
    setPendingNormalizedQuestion(null);
    setPendingScene(null);
    setPendingSelectedScene(null);
    setPendingClassifiedScene(null);
    setPendingQuestionType(null);
    setPendingMode(null);
    setPendingOriginalQuestion(null);
  }

  function classificationForPending(
    type: string | null,
    mode: "allow" | "playful_reframe" | "block" | null,
    finalScene: string | null,
    normalizedQuestion: string,
  ) {
    return {
      valid: mode !== "block",
      mode: mode || "allow",
      type: type || "action_decision",
      scene: finalScene || "随问",
      normalizedQuestion,
    };
  }

  const handleSuggestionSelect = (text: string) => {
    setQuestion(text);
    if (validationError?.suggestedScene) setScene(validationError.suggestedScene);
    setResultHint("");
    setValidationError(null);
  };

  const handleQuickQuestionSelect = (item: (typeof quickQuestions)[number]) => {
    setQuestion(item.text);
    setScene(item.scene);
    setResultHint("");
    setValidationError(null);
  };

  const handleCloseSheet = () => {
    resetToIdle();
  };

  const handleAskAgain = () => {
    resetToIdle();
    setCastingSessionId((prev) => prev + 1);
    setQuestion("");
  };

  const handleCloseCasting = () => {
    setCastingOpen(false);
    // 用户在起卦过程中关闭 → 让当前 session 作废
    activeSessionRef.current = 0;
    setAskStatus("idle");
    clearPending();
  };

  const isBusy = askStatus !== "idle";

  return (
    <div style={pageStyle}>
      <QuestionInputCard value={question} onChange={setQuestion} />
      <div style={{ ...floatingPanelStyle, padding: "12px 14px 10px" }}>
        <SceneSelector options={sceneOptions} selected={scene} onSelect={setScene} />
      </div>

      <PrimaryButton
        label={STATUS_LABEL[askStatus]}
        loading={isBusy}
        loadingLabel={STATUS_LABEL[askStatus]}
        onClick={handleStart}
      />

      <div style={{
        ...floatingPanelStyle,
        marginTop: 6,
        padding: "13px 16px 14px",
      }}>
        <QuickQuestionChips
          questions={quickQuestions}
          onSelect={handleQuickQuestionSelect}
        />
      </div>

      {resultHint && (
        <p style={{
          fontSize: 13, color: "#D95A4E", textAlign: "center", fontWeight: 600,
          background: "rgba(217,90,78,0.06)", borderRadius: 12, padding: "10px 14px",
        }}>
          {resultHint}
        </p>
      )}

      {validationError && (
        <div style={{
          background: "#FFF8F3", border: "1px solid rgba(217,90,78,0.18)",
          borderRadius: 22, padding: 18, boxShadow: "0 4px 20px rgba(120,72,60,0.08)",
        }}>
          <p style={{ fontSize: 17, fontWeight: 800, color: "#8B3A32", marginBottom: 6 }}>
            换个问法会更准
          </p>
          <p style={{
            fontSize: 13, color: "#7A6258", lineHeight: 1.6, whiteSpace: "pre-line",
            marginBottom: validationError.suggestions.length > 0 ? 14 : 0,
          }}>
            {validationError.reason || "问事一卦更适合判断「我该怎么做」…"}
          </p>
          {validationError.suggestions.length > 0 && (
            <>
              <p style={{ fontSize: 12, color: "#7A6258", fontWeight: 600, marginBottom: 8, letterSpacing: "0.03em" }}>
                建议这样问：
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {validationError.suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleSuggestionSelect(s)} style={{
                    textAlign: "left", background: "rgba(217,90,78,0.06)",
                    border: "1px solid rgba(234,200,188,0.6)", borderRadius: 14,
                    padding: "10px 14px", fontSize: 14, color: "#3B2A24",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <CastingSheet
        key={castingSessionId}
        open={castingOpen}
        onComplete={handleCastingComplete}
        onClose={handleCloseCasting}
      />

      {currentResult && (
        <AskResultSheet
          open={resultOpen}
          result={currentResult}
          onClose={handleCloseSheet}
          onAskAgain={handleAskAgain}
        />
      )}
    </div>
  );
}
