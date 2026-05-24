import type { QuickQuestion } from "../data/mockAsk";

interface QuickQuestionChipsProps {
  questions: QuickQuestion[];
  onSelect: (q: QuickQuestion) => void;
}

const sectionStyle: React.CSSProperties = {
  marginTop: 0,
};

const titleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#7A6258",
  marginBottom: 10,
};

const chipStyle: React.CSSProperties = {
  height: 32,
  borderRadius: 999,
  padding: "0 14px",
  fontSize: 12,
  color: "#3B2A24",
  background: "#FFF8F3",
  border: "1px solid #EAC8BC",
  cursor: "pointer",
  whiteSpace: "nowrap",
  flexShrink: 0,
  transition: "all 0.15s",
  fontFamily: "inherit",
};

export default function QuickQuestionChips({ questions, onSelect }: QuickQuestionChipsProps) {
  return (
    <div style={sectionStyle}>
      <p style={titleStyle}>常用问题</p>
      <div
        className="quick-question-scroll"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 8,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: 2,
        }}
      >
        {questions.map((q) => (
          <button
            key={q.text}
            style={chipStyle}
            onClick={() => onSelect(q)}
          >
            {q.text.length > 14 ? q.text.slice(0, 14) + "…" : q.text}
          </button>
        ))}
      </div>
      <style>{`.quick-question-scroll::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
