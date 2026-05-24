interface SceneSelectorProps {
  options: string[];
  selected: string;
  onSelect: (scene: string) => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "#7A6258",
  marginBottom: 6,
};

export default function SceneSelector({ options, selected, onSelect }: SceneSelectorProps) {
  return (
    <div style={{ marginTop: -4 }}>
      <p style={labelStyle}>可以选个语境，也可以直接问</p>
      <div
        className="scene-scroll"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 6,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: 2,
        }}
      >
        {options.map((opt) => {
          const isActive = opt === selected;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                height: 30,
                borderRadius: 999,
                padding: "0 11px",
                fontSize: 13,
                fontWeight: 600,
                border: `1px solid ${isActive ? "#D95A4E" : "#EAC8BC"}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                whiteSpace: "nowrap",
                boxSizing: "border-box",
                flexShrink: 0,
                background: isActive ? "#D95A4E" : "transparent",
                color: isActive ? "#fff" : "#3B2A24",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* 隐藏 webkit 滚动条 */}
      <style>{`.scene-scroll::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
