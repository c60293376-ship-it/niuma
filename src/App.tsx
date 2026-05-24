import { useEffect, useState } from "react";
import AppShell from "./components/AppShell";
import TodayPage from "./pages/TodayPage";
import AskPage from "./pages/AskPage";
import SpacePage from "./pages/SpacePage";
import MingbuPage from "./pages/MingbuPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("今日命历");
  const [hideBottomNav, setHideBottomNav] = useState(false);

  useEffect(() => {
    if (activeTab !== "问事一卦" && activeTab !== "空间体检") {
      setHideBottomNav(false);
    }
  }, [activeTab]);

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab} hideBottomNav={hideBottomNav}>
      {activeTab === "今日命历" && <TodayPage />}
      {activeTab === "问事一卦" && <AskPage onOverlayStepChange={setHideBottomNav} />}
      {activeTab === "空间体检" && <SpacePage onQuestionStepChange={setHideBottomNav} />}
      {activeTab === "命簿" && <MingbuPage />}
    </AppShell>
  );
}
