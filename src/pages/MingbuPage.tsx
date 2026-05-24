import { ChevronRight } from "lucide-react";

/**
 * 牛马命簿 — 用户命理档案/记录页
 *
 * TODO: 后续接入手动保存功能
 * - 今日命历页 → 增加「收进命簿」按钮
 * - 问事一卦结果页 → 增加「收进命簿」按钮
 * - 空间体检结果页 → 增加「保存空间报告」按钮
 * 以上均由用户主动触发保存，不做自动记录。
 */

const cardStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 26,
  background: "rgba(255, 248, 243, 0.92)",
  padding: "24px 24px",
  boxSizing: "border-box",
  boxShadow: "0 8px 24px rgba(120,72,60,0.10)",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 21,
  fontWeight: 800,
  color: "#3B2A24",
  marginBottom: 20,
};

const mutedTextStyle: React.CSSProperties = {
  color: "#7A6258",
  fontSize: 15,
};

const pageStyle: React.CSSProperties = {
  height: "100dvh",
  minHeight: "100dvh",
  marginLeft: -20,
  marginRight: -20,
  marginTop: 0,
  marginBottom: -92,
  padding: "clamp(150px, 36vw, 180px) 20px 104px",
  backgroundImage: "url('/assets/mingbu-page-bg.png')",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top center",
  backgroundSize: "100% 100%",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  overflow: "hidden",
};

const tagStyle: React.CSSProperties = {
  fontSize: 16,
  color: "#3B2A24",
  background: "rgba(217,90,78,0.08)",
  padding: "6px 16px",
  borderRadius: 999,
  lineHeight: 1.2,
};

export default function MingbuPage() {
  return (
    <div style={pageStyle}>
      {/* 顶部状态卡 */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Avatar */}
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "rgba(248,216,207,0.62)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(217,90,78,0.20)",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img
              src="/assets/default-avatar.png"
              alt="默认头像"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 21, fontWeight: 800, color: "#3B2A24" }}>小牛马</span>
              <span
                style={{
                  fontSize: 12,
                  color: "#D95A4E",
                  background: "rgba(217,90,78,0.1)",
                  padding: "4px 8px",
                  borderRadius: 999,
                  fontWeight: 500,
                }}
              >
                今日状态
              </span>
            </div>
            <p className="mingbu-fate-title" style={{ fontSize: 17, color: "#D95A4E", marginTop: 8, fontWeight: 500 }}>
              死磕到底型牛马
            </p>
            <p style={{ fontSize: 14, color: "#7A6258", marginTop: 6, opacity: 0.7 }}>
              点击编辑个人资料
            </p>
          </div>

          <ChevronRight style={{ width: 20, height: 20, color: "#EAC8BC", flexShrink: 0 }} />
        </div>
      </div>

      {/* 牛马档案 */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>牛马档案</h3>

        {/* 身份标签 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
          <span style={{ ...mutedTextStyle, width: 78, flexShrink: 0 }}>身份标签</span>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={tagStyle}>
              学生党
            </span>
            <span style={tagStyle}>
              打工人
            </span>
          </div>
        </div>

        {/* 常问领域 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
          <span style={{ ...mutedTextStyle, width: 78, flexShrink: 0 }}>常问领域</span>
          <div style={{ display: "flex", gap: 12 }}>
            {["学业", "工作", "人际"].map((tag) => (
              <span key={tag} style={tagStyle}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 进阶命理档案 */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ ...mutedTextStyle, width: 78, flexShrink: 0, lineHeight: 1.35 }}>
            进阶命理档案
          </span>
          <span style={{ fontSize: 15, color: "#7A6258", opacity: 0.6 }}>暂未开启</span>
        </div>
      </div>
    </div>
  );
}
