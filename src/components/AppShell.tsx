import type { CSSProperties, ReactNode } from "react";
import BottomNav from "./BottomNav";
import todayCalendarBg from "../assets/images/today-calendar-bg.png";

interface AppShellProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  hideBottomNav?: boolean;
}

export default function AppShell({ children, activeTab, onTabChange, hideBottomNav = false }: AppShellProps) {
  const isTodayPage = activeTab === "今日命历";

  return (
    <div
      className={
        isTodayPage
          ? "today-calendar-page"
          : activeTab === "问事一卦"
            ? "ask-fortune-page"
            : activeTab === "空间体检"
              ? "space-check-page"
              : activeTab === "命簿"
                ? "mingbu-page"
                : undefined
      }
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        ...(isTodayPage
          ? ({
              "--today-calendar-bg": `url(${todayCalendarBg})`,
            } as CSSProperties)
          : {}),
      }}
    >
      <main
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          paddingTop: isTodayPage ? 220 : undefined,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 92,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {children}
      </main>
      {!hideBottomNav && <BottomNav activeTab={activeTab} onTabChange={onTabChange} />}
    </div>
  );
}
