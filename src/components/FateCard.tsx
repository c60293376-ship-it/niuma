import { Flame } from "lucide-react";
import fortuneCowDeadline from "../assets/images/fortune-cow-deadline.png";
import type { TodayData } from "../data/mockToday";

interface FateCardProps {
  data: TodayData;
}

export default function FateCard({ data }: FateCardProps) {
  return (
    <div
      className="fortune-card"
      style={{
        position: "relative",
        width: "100%",
        borderRadius: 28,
        padding: "20px 20px 16px 20px",
        minHeight: 160,
        boxSizing: "border-box",
        overflow: "hidden",
        background: "linear-gradient(135deg, #B17A45 0%, #9C6739 60%, #85552F 100%)",
        boxShadow: "0 8px 32px rgba(133,85,47,0.24)",
        color: "#fff",
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-4 w-16 h-16 rounded-full bg-black/8 blur-2xl pointer-events-none" />

      <div className="fortune-card-content" style={{ position: "relative", zIndex: 10, minHeight: 124 }}>
        {/* 左侧 */}
        <div className="fortune-card-copy" style={{ width: "62%", minWidth: 0, paddingLeft: 2, display: "flex", flexDirection: "column", justifyContent: "flex-start", minHeight: 124 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Flame size={13} style={{ color: "rgba(255,255,255,0.7)", flexShrink: 0 }} />
            <span className="section-title" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2, color: "rgba(255,255,255,0.9)" }}>今日命格</span>
          </div>

          <h2 className="fortune-title" style={{ fontSize: 29, fontWeight: 900, lineHeight: 1.12, color: "#fff", letterSpacing: "-0.03em", marginBottom: 8, maxWidth: "100%", wordBreak: "keep-all", overflowWrap: "normal", whiteSpace: "nowrap" }}>
            {data.personality}
          </h2>

          <p className="fortune-desc" style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.45, color: "rgba(255,255,255,0.92)", marginBottom: 10 }}>
            今天很能扛，也容易上头。<br />该坚持的坚持，该放过的放过。
          </p>

          <div style={{ display: "inline-flex", alignItems: "center", padding: "8px 12px", borderRadius: 14, background: "rgba(255,255,255,0.14)", backdropFilter: "blur(2px)", width: "fit-content", marginTop: "auto" }}>
            <span className="fortune-meta" style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.96)", padding: "0 8px" }}>{data.jianchu}</span>
            <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.3)" }} />
            <span className="fortune-meta" style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.96)", padding: "0 8px" }}>{data.wuxing}</span>
          </div>
        </div>

        {/* 右侧 */}
        <div className="fortune-cow-slot">
          <img src={fortuneCowDeadline} alt="" className="fortune-cow" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
