import type { AskResultOutput } from "../utils/buildAskResult";

interface AskResultSheetProps {
  open: boolean;
  result: AskResultOutput;
  onClose: () => void;
  onAskAgain: () => void;
}

/* ==================== 外层 ==================== */

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
  maxHeight: "calc(100vh - 88px)",
  overflowY: "auto",
  background: "#FFF8F3",
  borderRadius: "28px 28px 0 0",
  padding: 16,
  boxSizing: "border-box",
  boxShadow: "0 -16px 36px rgba(120, 72, 60, 0.18)",
  zIndex: 201,
};

/* ==================== 组件 ==================== */

export default function AskResultSheet({ open, result, onClose, onAskAgain }: AskResultSheetProps) {
  if (!open) return null;

  const showDebug =
    import.meta.env.DEV && import.meta.env.VITE_SHOW_ASK_DEBUG === "true";

  // 兼容旧 string 格式和新 string[] 格式
  const actionValue = result.action as string[] | string;
  const actionPoints: string[] = Array.isArray(actionValue)
    ? result.action
    : actionValue.split(/[；;]/).filter((s: string) => s.trim().length > 0);

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

        {/* ========== 1. Header ========== */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#8B3A32",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              问事一卦
            </h2>
            <span
              style={{
                marginLeft: 8,
                background: "rgba(217,90,78,0.12)",
                color: "#D95A4E",
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {result.scene === "通用" ? "随问" : result.scene}
            </span>
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "#7A6258",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* ========== 2. 你问的是 — 紧凑小卡 ========== */}
        <div
          style={{
            background: "rgba(255,255,255,0.62)",
            border: "1px solid rgba(234,200,188,0.8)",
            borderRadius: 20,
            padding: "14px 16px",
            marginBottom: 10,
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#D95A4E",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            你问的是
          </p>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              color: "#3B2A24",
              fontWeight: 600,
            }}
          >
            {result.originalQuestion || result.question}
          </p>
        </div>

        {/* ====== 娱乐签轻提示 ====== */}
        {result.mode === "playful_reframe" && result.playfulNotice && (
          <p
            style={{
              fontSize: 12,
              color: "#B8786A",
              textAlign: "center",
              fontStyle: "italic",
              marginBottom: 10,
              padding: "0 8px",
              lineHeight: 1.5,
            }}
          >
            {result.playfulNotice}
          </p>
        )}

        {/* ========== 3. 核心结果卡：卦象 + 签诗 + 行动倾向 ========== */}
        <div
          style={{
            background: "linear-gradient(180deg, #FFF7F2 0%, #FCEDE6 100%)",
            border: "1px solid rgba(217,90,78,0.18)",
            borderRadius: 22,
            padding: "14px 16px",
            marginBottom: 10,
          }}
        >
          {/* --- 卦象 --- */}
          <p
            style={{
              fontSize: 13,
              color: "#D95A4E",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            卦象
          </p>

          {result.isStaticHexagram ? (
            <p
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#3B2A24",
                textAlign: "center",
                letterSpacing: "0.04em",
                lineHeight: 1.3,
                marginBottom: 4,
              }}
            >
              {result.mainHexagram}（静卦）
            </p>
          ) : (
            <p
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#3B2A24",
                textAlign: "center",
                letterSpacing: "0.04em",
                lineHeight: 1.3,
                marginBottom: 4,
              }}
            >
              {result.mainHexagram} → {result.changedHexagram}
            </p>
          )}

          <p
            style={{
              fontSize: 14,
              color: "#7A6258",
              textAlign: "center",
              fontWeight: 500,
              marginBottom: 14,
            }}
          >
            {result.isStaticHexagram ? "静卦取爻" : "动爻"}：{result.movingLine}
          </p>

          {/* 分隔 */}
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(234,200,188,0.5)",
              marginBottom: 12,
            }}
          />

          {/* --- 签诗 --- */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <span style={{ width: 24, height: 1, background: "rgba(217,90,78,0.22)" }} />
            <span
              style={{
                fontSize: 13,
                color: "#D95A4E",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              签诗
            </span>
            <span style={{ width: 24, height: 1, background: "rgba(217,90,78,0.22)" }} />
          </div>

          <p
            style={{
              fontSize: 19,
              lineHeight: 1.6,
              fontWeight: 700,
              color: "#3B2A24",
              letterSpacing: "0.03em",
              textAlign: "center",
              whiteSpace: "pre-line",
              marginBottom: 14,
            }}
          >
            {result.poem}
          </p>

          {/* 分隔 */}
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(234,200,188,0.5)",
              marginBottom: 10,
            }}
          />

          {/* --- 行动倾向 --- */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 14, color: "#7A6258" }}>行动倾向</span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#D95A4E",
                background: "rgba(217,90,78,0.10)",
                borderRadius: 999,
                padding: "4px 14px",
              }}
            >
              {result.displayTendency || result.tendency}
            </span>
          </div>
        </div>

        {/* ========== 4. 牛马解签 — 紧凑小卡 ========== */}
        <div
          style={{
            background: "rgba(255,255,255,0.72)",
            borderRadius: 20,
            border: "1px solid rgba(234,200,188,0.7)",
            padding: "14px 16px",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(217,90,78,0.12), rgba(255,248,243,0.6))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(217,90,78,0.15)",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1, userSelect: "none" }}>🐮</span>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#8B3A32" }}>
              牛马解签
            </span>
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.55, color: "#3B2A24" }}>
            {result.interpretation}
          </p>
        </div>

        {/* ========== 5. 破局建议 — 紧凑清单 ========== */}
        <div
          style={{
            background: "rgba(95,127,79,0.06)",
            borderRadius: 18,
            padding: "14px 16px",
            marginBottom: 12,
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#5F7F4F",
              marginBottom: 8,
            }}
          >
            破局建议
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {actionPoints.map((point, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "#5F7F4F",
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                />
                <span style={{ fontSize: 14, lineHeight: 1.4, color: "#3B2A24" }}>
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ========== 6. 底部双按钮 ========== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 2,
          }}
        >
          <button
            onClick={onAskAgain}
            style={{
              height: 46,
              borderRadius: 16,
              border: "1px solid #EAC8BC",
              background: "transparent",
              color: "#8B3A32",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            再问一卦
          </button>
          <button
            onClick={onClose}
            style={{
              height: 46,
              borderRadius: 16,
              background: "#D95A4E",
              border: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            我知道了
          </button>
        </div>

        {/* ========== 7. 开发调试信息（仅 DEV 环境显示） ========== */}
        {showDebug && result.debug && (
          <div
            style={{
              marginTop: 10,
              padding: "8px 10px",
              background: "rgba(0,0,0,0.05)",
              borderRadius: 10,
              fontSize: 10,
              color: "#999",
              fontFamily: "monospace",
              lineHeight: 1.5,
              wordBreak: "break-all",
            }}
          >
            debug: type={result.debug.finalQuestionType}
            scene={result.debug.finalScene}
            poem={result.debug.signPoemId}
            source={result.debug.finalInterpretationSource}
            ai={result.debug.aiStatus}
            {result.debug.aiResponseSource && result.debug.aiResponseSource !== "deepseek" && (
              <> aiSrc={result.debug.aiResponseSource}</>
            )}
            {result.debug.aiErrorCode && (
              <> code={result.debug.aiErrorCode}</>
            )}
            {typeof result.debug.aiElapsedMs === "number" && (
              <> ms={result.debug.aiElapsedMs}</>
            )}
            {result.debug.signPoemMatchLevel && (
              <> match={result.debug.signPoemMatchLevel}</>
            )}
            {result.debug.signPoemQuestionType !== result.debug.finalQuestionType && (
              <> MISMATCH! poemType={result.debug.signPoemQuestionType}</>
            )}
          </div>
        )}
      </div>
    </>
  );
}
