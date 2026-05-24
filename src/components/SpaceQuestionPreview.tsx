import { ChevronRight, HelpCircle } from "lucide-react";
import type { SpaceQuestion } from "../data/mockSpace";

interface SpaceQuestionPreviewProps {
  questions: SpaceQuestion[];
}

const cardStyle: React.CSSProperties = {
  background: "#FFF8F3",
  borderRadius: 28,
  padding: 22,
  boxShadow: "0 4px 20px rgba(120,72,60,0.10)",
};

const titleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#3B2A24",
  marginBottom: 14,
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  paddingTop: 10,
  paddingBottom: 10,
};

const dividerStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(234,200,188,0.5)",
};

export default function SpaceQuestionPreview({ questions }: SpaceQuestionPreviewProps) {
  return (
    <div style={cardStyle}>
      <p style={titleStyle}>接下来会问你几个位置问题</p>
      <div>
        {questions.map((q, i) => (
          <div key={i}>
            <div style={itemStyle}>
              <HelpCircle
                style={{
                  width: 16,
                  height: 16,
                  color: "#D95A4E",
                  opacity: 0.5,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#3B2A24", lineHeight: 1.4 }}>
                  {i + 1}. {q.title}
                </p>
                <p style={{ fontSize: 12, color: "#7A6258", marginTop: 4, lineHeight: 1.35 }}>
                  {q.options}
                </p>
              </div>
              <ChevronRight
                style={{
                  width: 14,
                  height: 14,
                  color: "#EAC8BC",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
            </div>
            {i < questions.length - 1 && <div style={dividerStyle} />}
          </div>
        ))}
      </div>
    </div>
  );
}
