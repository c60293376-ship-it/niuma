import { Compass, MessageCircle, Home, Bookmark } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { label: "今日命历", icon: Home },
  { label: "问事一卦", icon: MessageCircle },
  { label: "空间体检", icon: Compass },
  { label: "命簿", icon: Bookmark },
];

const navStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: 10,
  width: "calc(100% - 40px)",
  maxWidth: 390,
  height: 70,
  borderRadius: 28,
  background: "rgba(255,248,243,0.96)",
  boxShadow: "0 8px 24px rgba(120,72,60,0.14)",
  backdropFilter: "blur(10px)",
  zIndex: 50,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
};

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" style={navStyle}>
      <div className="flex items-center justify-around w-full px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.label === activeTab;
          return (
            <button
              key={tab.label}
              onClick={() => onTabChange(tab.label)}
              className={`flex flex-col items-center gap-2 px-2 py-1 rounded-xl transition-colors ${
                isActive ? "text-niuma-primary" : "text-niuma-textSub/40"
              }`}
            >
              <Icon
                style={{ width: 22, height: 22 }}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`today-nav-label text-xs font-medium ${isActive ? "today-nav-active" : ""}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
