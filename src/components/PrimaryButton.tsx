interface PrimaryButtonProps {
  label: string;
  loading?: boolean;
  loadingLabel?: string;
  onClick: () => void;
}

const btnStyle: React.CSSProperties = {
  width: "100%",
  height: 50,
  borderRadius: 22,
  background: "linear-gradient(135deg, #D95A4E, #B8443A)",
  color: "#fff",
  fontSize: 19,
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
  boxShadow: "0 6px 24px rgba(217,90,78,0.30)",
  transition: "opacity 0.2s",
};

export default function PrimaryButton({
  label,
  loading = false,
  loadingLabel = "正在起卦……",
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      style={{
        ...btnStyle,
        opacity: loading ? 0.7 : 1,
        cursor: loading ? "default" : "pointer",
      }}
      onClick={loading ? undefined : onClick}
      disabled={loading}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
