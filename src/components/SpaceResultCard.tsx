import type { SpaceFengshuiResult, CheckLevel } from "../data/spaceFengshuiReadings";
import { RefreshCw, Upload } from "lucide-react";

interface SpaceResultCardProps {
  result: SpaceFengshuiResult;
  onRetry: () => void;
  onReset: () => void;
}

const cardStyle: React.CSSProperties = {
  background: "#FFF8F3",
  borderRadius: 28,
  padding: 24,
  boxShadow: "0 4px 20px rgba(120,72,60,0.10)",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#8B3A32",
  letterSpacing: 1,
  marginBottom: 10,
};

const tagStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  background: "rgba(217,90,78,0.08)",
  color: "#8B3A32",
  border: "1px solid rgba(217,90,78,0.15)",
  marginRight: 6,
  marginBottom: 6,
};

const poemBlock: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.8,
  color: "#3B2A24",
  whiteSpace: "pre-line",
  background: "rgba(252,234,228,0.4)",
  borderRadius: 18,
  padding: "14px 18px",
};

const interpStyle: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.7,
  color: "#7A6258",
};

const suitableTag: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
  background: "linear-gradient(135deg, rgba(95,127,79,0.10), rgba(95,127,79,0.05))",
  color: "#5F7F4F",
  border: "1px solid rgba(95,127,79,0.2)",
  marginRight: 8,
  marginBottom: 6,
};

const suggestionItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 0",
  borderBottom: "1px solid rgba(234,200,188,0.4)",
  fontSize: 13,
  fontWeight: 600,
  color: "#3B2A24",
};

const btnBase: React.CSSProperties = {
  flex: 1,
  height: 44,
  borderRadius: 22,
  fontSize: 14,
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
};

const checkLevelColors: Record<CheckLevel, { bg: string; text: string; border: string }> = {
  good: {
    bg: "rgba(95,127,79,0.08)",
    text: "#5F7F4F",
    border: "rgba(95,127,79,0.2)",
  },
  neutral: {
    bg: "rgba(122,98,88,0.06)",
    text: "#7A6258",
    border: "rgba(122,98,88,0.15)",
  },
  weak: {
    bg: "rgba(217,90,78,0.06)",
    text: "#B8544A",
    border: "rgba(217,90,78,0.12)",
  },
  bad: {
    bg: "rgba(217,90,78,0.10)",
    text: "#8B3A32",
    border: "rgba(217,90,78,0.2)",
  },
};

export default function SpaceResultCard({
  result,
  onRetry,
  onReset,
}: SpaceResultCardProps) {
  return (
    <div style={cardStyle}>
      {/* 1. 空间风水局 */}
      <div style={{ marginBottom: 18 }}>
        <p style={sectionTitle}>空间风水局</p>
        <p
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#8B3A32",
            lineHeight: 1.3,
            marginBottom: 10,
          }}
        >
          {result.fengshuiTitle}
        </p>
        <div>
          {result.fengshuiTags.map((tag) => (
            <span key={tag} style={tagStyle}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 2. 风水盘点 */}
      <div style={{ marginBottom: 18 }}>
        <p style={sectionTitle}>风水盘点</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {result.fengshuiChecks.map((check) => {
            const colors = checkLevelColors[check.level];
            return (
              <div
                key={check.name}
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 16,
                  padding: "8px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  minWidth: 62,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#7A6258",
                    letterSpacing: 0.5,
                  }}
                >
                  {check.name}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: colors.text,
                    lineHeight: 1.2,
                  }}
                >
                  {check.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 空间签 */}
      <div style={{ marginBottom: 18 }}>
        <p style={sectionTitle}>空间签</p>
        <p style={poemBlock}>{result.poem}</p>
      </div>

      {/* 4. 风水解读 */}
      <div style={{ marginBottom: 18 }}>
        <p style={sectionTitle}>风水解读</p>
        <p style={interpStyle}>{result.interpretation}</p>
      </div>

      {/* 5. 今日适合 */}
      <div style={{ marginBottom: 18 }}>
        <p style={sectionTitle}>今日适合</p>
        <div>
          {result.suitableFor.map((s) => (
            <span key={s} style={suitableTag}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* 6. 调场建议 */}
      <div style={{ marginBottom: 24 }}>
        <p style={sectionTitle}>调场建议</p>
        <div>
          {result.suggestions.map((s, i) => (
            <div key={i} style={suggestionItem}>
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: "#D95A4E",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. 操作按钮 */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onReset}
          style={{
            ...btnBase,
            background: "#FFF8F3",
            color: "#7A6258",
            border: "1px solid #EAC8BC",
          }}
        >
          <Upload size={15} />
          重新上传
        </button>
        <button
          onClick={onRetry}
          style={{
            ...btnBase,
            background: "linear-gradient(135deg, #D95A4E, #B8443A)",
            color: "#fff",
            boxShadow: "0 4px 16px rgba(217,90,78,0.25)",
          }}
        >
          <RefreshCw size={15} />
          再看一次
        </button>
      </div>
    </div>
  );
}
