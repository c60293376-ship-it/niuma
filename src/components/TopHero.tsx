const outerStyle: React.CSSProperties = {
  position: "relative",
  boxSizing: "border-box",
  width: "100%",
  overflow: "visible",
};

const bannerStyle: React.CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
  objectFit: "contain",
};

const fadeStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: 64,
  pointerEvents: "none",
  background: "linear-gradient(180deg, rgba(253,232,227,0) 0%, rgba(255,247,239,0.74) 58%, #FFF7EF 100%)",
};

export default function TopHero() {
  return (
    <div style={outerStyle}>
      <img
        src="/assets/hero-mobile.png"
        alt="Niuma Mingli hero banner"
        style={bannerStyle}
      />
      <div style={fadeStyle} />
    </div>
  );
}
