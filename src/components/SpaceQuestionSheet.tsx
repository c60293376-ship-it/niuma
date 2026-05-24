import { useState, useEffect, useCallback } from "react";
import type { RentalQuestion } from "../data/rentalQuestionFlow";
import { getDefaultForField } from "../data/rentalQuestionFlow";

export type QuestionMode = "basic" | "deep";

interface SpaceQuestionSheetProps {
  open: boolean;
  mode: QuestionMode;
  questions: RentalQuestion[];
  answers: Record<string, string | string[]>;
  onAnswersChange: (answers: Record<string, string | string[]>) => void;
  onSubmit: () => void;
  onClose: () => void;
  loading?: boolean;
}

/* ==================== 外层样式 ==================== */

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(60, 30, 25, 0.28)",
  zIndex: 200,
};

const sheetStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: 0,
  width: "100%",
  maxWidth: 430,
  background: "#FFF8F3",
  borderRadius: "28px 28px 0 0",
  padding: 16,
  boxSizing: "border-box",
  boxShadow: "0 -16px 36px rgba(120, 72, 60, 0.18)",
  zIndex: 201,
};

const pillBase: React.CSSProperties = {
  height: 38,
  borderRadius: 999,
  padding: "0 14px",
  fontSize: 13,
  fontWeight: 600,
  border: "1px solid #EAC8BC",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  background: "#FFF8F3",
  color: "#3B2A24",
};

/* ==================== 单选/多选工具函数 ==================== */

function isSelected(fieldValue: string | string[], optValue: string): boolean {
  if (Array.isArray(fieldValue)) return fieldValue.includes(optValue);
  return fieldValue === optValue;
}

function handleMultiSelect(
  current: string[],
  value: string,
  exclusiveValues: string[],
  field: string,
): string[] {
  if (exclusiveValues.includes(value)) {
    return [value];
  }
  const hasExclusive = current.some((v) => exclusiveValues.includes(v));
  if (hasExclusive) {
    return [value];
  }
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  if (next.length === 0) {
    const def = getDefaultForField(field);
    return Array.isArray(def) ? def : [def];
  }
  return next;
}

/* ==================== 组件 ==================== */

export default function SpaceQuestionSheet({
  open,
  mode,
  questions,
  answers,
  onAnswersChange,
  onSubmit,
  onClose,
  loading,
}: SpaceQuestionSheetProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setCurrentIdx(0);
  }, [open]);

  const totalQuestions = questions.length;
  const safeCurrentIdx = Math.min(currentIdx, totalQuestions - 1);
  const question: RentalQuestion = questions[safeCurrentIdx];
  const fieldValue = answers[question.field] ?? getDefaultForField(question.field);
  const isLast = safeCurrentIdx === totalQuestions - 1;
  const isFirst = safeCurrentIdx === 0;

  const titleText = mode === "deep" ? "深度解析" : "再问几句，看清安居雷点";
  const subtitleText = mode === "deep"
    ? "补充门、窗、背后关系，看看有没有更深的堪舆雷点。"
    : "不用想太多，凭感觉选就行。牛马只求住得顺一点。";
  const progressLabel = mode === "deep"
    ? `深度解析 第 ${safeCurrentIdx + 1} / ${totalQuestions} 问`
    : `第 ${safeCurrentIdx + 1} / ${totalQuestions} 问`;
  const submitLabel = mode === "deep" ? "生成深度堪舆报告" : "生成牛马安居报告";
  const loadingLabel = "牛马正在看房……";

  const handleSelect = useCallback(
    (value: string) => {
      if (question.type === "single") {
        onAnswersChange({ ...answers, [question.field]: value });
      } else {
        const exclusiveValues = question.exclusive?.exclusiveValues ?? [];
        const next = handleMultiSelect(
          (fieldValue as string[]) ?? [],
          value,
          exclusiveValues,
          question.field,
        );
        onAnswersChange({ ...answers, [question.field]: next });
      }
    },
    [question, fieldValue, answers, onAnswersChange],
  );

  if (!open) return null;

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const handleNext = () => {
    if (isLast) {
      onSubmit();
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />

      <div style={sheetStyle}>
        {/* 拖拽条 */}
        <div
          style={{
            width: 42,
            height: 5,
            borderRadius: 999,
            background: "rgba(120, 72, 60, 0.18)",
            margin: "0 auto 12px",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#8B3A32",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {titleText}
            </h2>
            <p style={{ fontSize: 12, color: "#7A6258", marginTop: 2 }}>
              {progressLabel}
            </p>
            <p style={{ fontSize: 12, color: "#7A6258", marginTop: 4, marginBottom: 0 }}>
              {subtitleText}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(120,72,60,0.08)",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: "#7A6258",
              lineHeight: 1,
              flexShrink: 0,
              marginLeft: 12,
            }}
          >
            ×
          </button>
        </div>

        {/* 进度条 */}
        <div
          style={{
            width: "100%",
            height: 4,
            borderRadius: 999,
            background: "rgba(234,200,188,0.4)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: `${((safeCurrentIdx + 1) / totalQuestions) * 100}%`,
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #D95A4E, #C54F43)",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* ========== 当前问题 ========== */}
        <div style={{ minHeight: 160 }}>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#3B2A24",
              marginBottom: question.subtitle ? 4 : 12,
            }}
          >
            {question.title}
          </p>
          {question.subtitle && (
            <p
              style={{
                fontSize: 12,
                color: "#7A6258",
                marginBottom: 12,
              }}
            >
              {question.subtitle}
            </p>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {question.options.map((opt) => {
              const active = isSelected(fieldValue as string | string[], opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    ...pillBase,
                    background: active ? "#D95A4E" : "#FFF8F3",
                    color: active ? "#fff" : "#3B2A24",
                    borderColor: active ? "#D95A4E" : "#EAC8BC",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========== 底部按钮 ========== */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 28,
            paddingBottom: 4,
          }}
        >
          {!isFirst && (
            <button
              onClick={handlePrev}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 22,
                border: "1px solid #EAC8BC",
                background: "#FFF8F3",
                color: "#7A6258",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              上一题
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={loading}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 22,
              border: "none",
              background: loading
                ? "rgba(217,90,78,0.5)"
                : "linear-gradient(135deg, #D95A4E, #B8443A)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              boxShadow: "0 6px 20px rgba(217,90,78,0.28)",
            }}
          >
            {loading ? loadingLabel : isLast ? submitLabel : "下一题"}
          </button>
        </div>
      </div>
    </>
  );
}
