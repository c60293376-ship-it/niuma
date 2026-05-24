import type { SpaceQuestionAnswers } from "../data/spaceFengshuiReadings";

interface SpaceQuestionsCardProps {
  answers: SpaceQuestionAnswers;
  onChange: (answers: SpaceQuestionAnswers) => void;
}

interface QuestionDef {
  label: string;
  key: keyof SpaceQuestionAnswers;
  options: string[];
}

const questions: QuestionDef[] = [
  {
    label: "你坐/躺的时候，背后是什么？",
    key: "backSupport",
    options: ["墙", "椅背", "柜子", "空的", "不确定"],
  },
  {
    label: "你正前方看起来怎么样？",
    key: "frontView",
    options: ["开阔", "有点乱", "被杂物挡住", "对着墙", "不确定"],
  },
  {
    label: "这里的光线怎么样？",
    key: "lightLevel",
    options: ["很亮", "刚好", "有点暗", "主要靠屏幕", "不确定"],
  },
  {
    label: "这个地方最影响你的是？",
    key: "mainIssue",
    options: ["东西太多", "有点吵", "容易犯困", "没安全感", "还挺舒服"],
  },
];

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
  marginBottom: 4,
};

const subStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#7A6258",
  marginBottom: 18,
};

const questionLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#3B2A24",
  marginBottom: 8,
};

const pillBase: React.CSSProperties = {
  height: 34,
  borderRadius: 999,
  padding: "0 12px",
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

export default function SpaceQuestionsCard({
  answers,
  onChange,
}: SpaceQuestionsCardProps) {
  const handleSelect = (key: keyof SpaceQuestionAnswers, value: string) => {
    onChange({ ...answers, [key]: value });
  };

  return (
    <div style={cardStyle}>
      <p style={titleStyle}>再问几句，让牛马看得准一点</p>
      <p style={subStyle}>不用想太多，凭感觉选就行。</p>

      {questions.map((q, qi) => (
        <div
          key={q.key}
          style={{
            marginBottom: qi < questions.length - 1 ? 16 : 0,
          }}
        >
          <p style={questionLabel}>{q.label}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {q.options.map((opt) => {
              const isActive = answers[q.key] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(q.key, opt)}
                  style={{
                    ...pillBase,
                    background: isActive ? "#D95A4E" : "#FFF8F3",
                    color: isActive ? "#fff" : "#3B2A24",
                    borderColor: isActive ? "#D95A4E" : "#EAC8BC",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
