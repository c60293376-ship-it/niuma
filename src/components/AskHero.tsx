const outerStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  minHeight: 200,
};

const leftStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const titleStyle: React.CSSProperties = {
  fontSize: 40,
  fontWeight: 800,
  lineHeight: 1.1,
  color: "#8B3A32",
};

const subStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.4,
  color: "#7A6258",
};

const imagePlaceholderStyle: React.CSSProperties = {
  width: 96,
  height: 96,
  borderRadius: 20,
  background: "linear-gradient(135deg, rgba(217,90,78,0.08), rgba(255,248,243,0.5))",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  marginLeft: 16,
  border: "1px solid rgba(217,90,78,0.1)",
};

export default function AskHero() {
  return (
    <div style={outerStyle}>
      <div style={leftStyle}>
        <h1 style={titleStyle}>问事一卦</h1>
        <p style={subStyle}>有心事，就来起一卦</p>
      </div>

      {/* 牛马品牌主视觉占位 — 请放入 public/assets/brand/niuma-hero.png */}
      <div style={imagePlaceholderStyle}>
        <img
          src="/assets/brand/niuma-hero.png"
          alt="牛马命历"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 20 }}
          onError={(e) => {
            // 图片未放入时显示占位框
            const el = e.currentTarget;
            el.style.display = "none";
            const parent = el.parentElement;
            if (parent) {
              parent.style.background =
                "linear-gradient(135deg, rgba(217,90,78,0.1), rgba(248,216,207,0.6))";
              parent.innerHTML =
                '<span style="font-size:11px;color:rgba(139,58,50,0.45);text-align:center;line-height:1.4">请放入<br/>niuma-hero.png</span>';
            }
          }}
        />
      </div>
    </div>
  );
}
