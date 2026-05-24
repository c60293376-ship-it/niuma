interface QuestionInputCardProps {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255, 248, 243, 0.86)",
  border: "1px solid rgba(234, 200, 188, 0.56)",
  borderRadius: 22,
  padding: "12px 16px 10px",
  boxShadow: "0 10px 30px rgba(120,72,60,0.10)",
  backdropFilter: "blur(8px)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
};

const titleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#3B2A24",
};

const countStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#7A6258",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  height: 76,
  borderRadius: 16,
  background: "#FFFCF9",
  border: "1px solid #EAC8BC",
  padding: "10px 14px",
  fontSize: 15,
  color: "#3B2A24",
  lineHeight: 1.45,
  resize: "none",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const hintStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#7A6258",
  marginTop: 6,
};

export default function QuestionInputCard({
  value,
  onChange,
  maxLength = 80,
}: QuestionInputCardProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={titleStyle}>把问题写下来</span>
        <span style={countStyle}>
          {value.length} / {maxLength}
        </span>
      </div>
      <textarea
        style={textareaStyle}
        placeholder="比如「下午要不要主动联系导师？」"
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            onChange(e.target.value);
          }
        }}
        maxLength={maxLength}
      />
      <p style={hintStyle}>问得越具体，解签越贴近当下。</p>
    </div>
  );
}
