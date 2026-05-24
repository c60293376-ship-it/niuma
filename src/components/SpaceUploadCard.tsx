import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";

interface SpaceUploadCardProps {
  imageUrl: string | null;
  onImageChange: (file: File | null, imageUrl: string | null) => void;
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
  marginBottom: 4,
};

const subStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#7A6258",
  marginBottom: 14,
};

const hintStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#7A6258",
  marginTop: 10,
  textAlign: "center" as const,
};

export default function SpaceUploadCard({
  imageUrl,
  onImageChange,
}: SpaceUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file, url);
    } else {
      setPreviewUrl(null);
      onImageChange(null, null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayUrl = imageUrl ?? previewUrl;

  return (
    <div style={cardStyle}>
      <p style={titleStyle}>上传一张房间照片</p>
      <p style={subStyle}>中介图、看房图、自己住的房间都可以</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleChange}
      />

      {!displayUrl ? (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            height: 180,
            borderRadius: 20,
            border: "2px dashed #EAC8BC",
            background: "rgba(252,234,228,0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <Camera
            style={{ width: 36, height: 36, color: "#D95A4E", opacity: 0.45 }}
          />
          <span style={{ fontSize: 14, color: "#7A6258" }}>
            拍照 / 上传照片
          </span>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            height: 220,
          }}
        >
          <img
            src={displayUrl}
            alt="空间预览"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 20,
            }}
          />
          <button
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(0,0,0,0.50)",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <X size={14} />
            重新上传
          </button>
        </div>
      )}

      <p style={hintStyle}>图片仅用于本次牛马安居判断，不保存空间照片。</p>
    </div>
  );
}
