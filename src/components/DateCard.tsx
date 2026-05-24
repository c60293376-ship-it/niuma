import type { TodayData } from "../data/mockToday";

interface DateCardProps {
  data: TodayData;
}

const cardStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 26,
  background: "#FFF8F3",
  padding: "18px 22px",
  minHeight: 92,
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  boxShadow: "0 4px 20px rgba(120,72,60,0.10)",
};

const leftStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  paddingLeft: 2,
};

const rightStyle: React.CSSProperties = {
  flexShrink: 0,
  width: 92,
  display: "flex",
  flexDirection: "column",
  gap: 7,
  marginLeft: 14,
};

const pillStyle: React.CSSProperties = {
  width: 92,
  height: 26,
  borderRadius: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  fontWeight: 600,
  color: "#fff",
};

export default function DateCard({ data }: DateCardProps) {
  return (
    <div style={cardStyle}>
      <div style={leftStyle}>
        <p className="date-main" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.15, color: "#8B3A32" }}>
          {data.date}
        </p>
        <p className="body-text" style={{ fontSize: 13, lineHeight: 1.4, color: "#7A6258", marginTop: 6 }}>
          {data.ganzhi}
        </p>
      </div>

      <div style={rightStyle}>
        <span className="date-pill" style={{ ...pillStyle, background: "#D95A4E" }}>{data.lunar}</span>
        <span className="date-pill" style={{ ...pillStyle, background: "#8B3A32" }}>{data.jianchu}</span>
      </div>
    </div>
  );
}
