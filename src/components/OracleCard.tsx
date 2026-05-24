import type { TodayData } from "../data/mockToday";
import { Sparkles } from "lucide-react";
import oracleBucket from "../assets/images/oracle-bucket.png";

interface OracleCardProps {
  data: TodayData;
}

export default function OracleCard({ data }: OracleCardProps) {
  const oracleLines = data.oracle
    .replace(/；/g, "；\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div
      className="oracle-card relative w-full bg-gradient-to-b from-niuma-card via-niuma-bg to-niuma-card rounded-[24px] shadow-niuma"
      style={{
        minHeight: 96,
        padding: "16px 20px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        position: "relative",
      }}
    >
      <div className="absolute top-0 -right-2 w-12 h-20 rounded-full bg-niuma-primary/4 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 -left-2 w-12 h-12 rounded-full bg-niuma-bgSoft/50 blur-2xl pointer-events-none" />

      <div className="oracle-content relative z-10" style={{ flex: 1, minWidth: 0 }}>
        <div className="oracle-title flex items-center gap-1" style={{ marginBottom: 8, justifyContent: "flex-start" }}>
          <Sparkles className="w-3.5 h-3.5 text-niuma-primary" />
          <span className="section-title text-niuma-primary font-bold text-[16px] tracking-[0.12em]">今日神谕</span>
        </div>
        <p className="oracle-text text-niuma-textMain font-medium tracking-[0.06em]" style={{ fontSize: 22, lineHeight: 1.55, fontWeight: 500, textAlign: "left" }}>
          {oracleLines.map((line, index) => (
            <span key={line}>
              {line}
              {index < oracleLines.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>

      <div
        className="oracle-visual relative z-10 flex items-center justify-center"
        style={{ width: 102, flexShrink: 0, marginRight: -4, marginTop: -4, marginBottom: -6 }}
      >
        <img src={oracleBucket} alt="" className="oracle-bucket" aria-hidden="true" />
      </div>
    </div>
  );
}
