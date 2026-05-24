interface SpaceTypeSelectorProps {
  options: string[];
  selected: string;
  onSelect: (type: string) => void;
  title?: string;
}

const cardStyle: React.CSSProperties = {
  background: "#FFF8F3",
  borderRadius: 28,
  padding: 20,
  boxShadow: "0 4px 20px rgba(120,72,60,0.10)",
};

const titleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#3B2A24",
  marginBottom: 14,
};

const pillBase: React.CSSProperties = {
  height: 38,
  borderRadius: 999,
  padding: "0 6px",
  fontSize: 14,
  fontWeight: 600,
  border: "1px solid #EAC8BC",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
};

export default function SpaceTypeSelector({ options, selected, onSelect, title }: SpaceTypeSelectorProps) {
  return (
    <div style={cardStyle}>
      <p style={titleStyle}>{title ?? "你想测哪种空间？"}</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          width: "100%",
        }}
      >
        {options.map((opt) => {
          const isActive = opt === selected;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
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
  );
}
