import { useState, useEffect } from "react";
import { castSingleLine } from "../lib/iching/castLines";

interface CastingSheetProps {
  open: boolean;
  onComplete: (lines: number[]) => void;
  onClose: () => void;
}

const LINE_POSITION = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

const LINE_LABEL: Record<number, string> = {
  9: "老阳",
  7: "少阳",
  8: "少阴",
  6: "老阴",
};

/* ========== 外层样式 ========== */

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(60, 30, 25, 0.32)",
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

/* ========== 爻线图形 ========== */

function LineSymbol({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span style={{ fontSize: 14, color: "rgba(120,72,60,0.18)", fontWeight: 500 }}>
        ———
      </span>
    );
  }

  const isYang = value === 7 || value === 9;
  const isMoving = value === 6 || value === 9;
  const accent = isMoving ? "#D95A4E" : "#3B2A24";

  return (
    <span
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: accent,
        letterSpacing: "0.04em",
        userSelect: "none",
      }}
    >
      {isYang ? "———" : "—  —"}
    </span>
  );
}

/* ========== 组件 ========== */

export default function CastingSheet({ open, onComplete, onClose }: CastingSheetProps) {
  const [lines, setLines] = useState<(number | null)[]>(Array<null>(6).fill(null));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lastCast, setLastCast] = useState<number | null>(null);

  // 每次弹层打开时重置所有六爻状态
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (open) {
      setLines(Array<null>(6).fill(null));
      setCurrentIdx(0);
      setLastCast(null);
    }
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!open) return null;

  const allDone = currentIdx >= 6;

  const handleCast = () => {
    if (allDone) {
      onComplete(lines as number[]);
      return;
    }

    const value = castSingleLine();
    const next = [...lines];
    next[currentIdx] = value;
    setLines(next);
    setLastCast(value);
    setCurrentIdx(currentIdx + 1);
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
            marginBottom: 4,
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#8B3A32", margin: 0 }}>
            起卦
          </h2>
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
            }}
          >
            ×
          </button>
        </div>

        <p style={{ fontSize: 13, color: "#7A6258", marginBottom: 16 }}>
          {allDone ? "六爻已成" : `点击按钮掷出第 ${currentIdx + 1} 爻`}
        </p>

        {/* 六爻展示（上爻在上 → 初爻在下） */}
        <div
          style={{
            background: "linear-gradient(180deg, rgba(252,234,228,0.3), rgba(255,248,243,0.6))",
            border: "1px solid rgba(234,200,188,0.6)",
            borderRadius: 20,
            padding: "12px 16px",
            marginBottom: 14,
          }}
        >
          {[5, 4, 3, 2, 1, 0].map((i) => {
            const value = lines[i];
            const done = value !== null;
            const isCurrent = i === currentIdx;
            const isMoving = value === 6 || value === 9;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "7px 0",
                  borderBottom: i > 0 ? "1px solid rgba(234,200,188,0.25)" : "none",
                  opacity: done || isCurrent ? 1 : 0.25,
                }}
              >
                {/* 位置标签 */}
                <span
                  style={{
                    width: 36,
                    fontSize: 12,
                    color: isCurrent ? "#D95A4E" : "#7A6258",
                    fontWeight: isCurrent ? 700 : 500,
                    flexShrink: 0,
                  }}
                >
                  {LINE_POSITION[i]}
                </span>

                {/* 爻线 */}
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <LineSymbol value={done ? value : isCurrent ? 7 : null} />
                </div>

                {/* 结果标签 */}
                <span
                  style={{
                    width: 80,
                    fontSize: 13,
                    fontWeight: done ? 600 : 400,
                    color: done
                      ? isMoving
                        ? "#D95A4E"
                        : "#3B2A24"
                      : "rgba(120,72,60,0.2)",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {done ? LINE_LABEL[value!] : isCurrent ? "…" : "—"}
                  {done && isMoving ? " · 动" : ""}
                </span>
              </div>
            );
          })}
        </div>

        {/* 当前掷出结果 */}
        {lastCast !== null && !allDone && (
          <div
            style={{
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 13, color: "#7A6258" }}>掷出：</span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: lastCast === 6 || lastCast === 9 ? "#D95A4E" : "#3B2A24",
                marginLeft: 6,
              }}
            >
              {LINE_LABEL[lastCast]}
              {lastCast === 6 || lastCast === 9 ? "（动爻）" : ""}
            </span>
          </div>
        )}

        {/* 操作按钮 */}
        <button
          onClick={handleCast}
          style={{
            width: "100%",
            height: 50,
            borderRadius: 22,
            border: "none",
            background: allDone
              ? "linear-gradient(135deg, #D95A4E, #B8443A)"
              : "linear-gradient(135deg, #D95A4E, #C54F43)",
            color: "#fff",
            fontSize: 17,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(217,90,78,0.28)",
          }}
        >
          {allDone ? "六爻已成，查看结果" : `掷第 ${currentIdx + 1} 爻`}
        </button>
      </div>
    </>
  );
}
