export interface TodayData {
  date: string;
  lunar: string;
  ganzhi: string;
  jianchu: string;
  nayin: string;
  wuxing: string;
  personality: string;
  basis: string[];
  good: string[];
  avoid: string[];
  oracle: string;
}

export const mockToday: TodayData = {
  date: "今日",
  lunar: "农历",
  ganzhi: "干支",
  jianchu: "值日",
  nayin: "纳音",
  wuxing: "五行状态",
  personality: "死磕到底型牛马",
  basis: [
    "宜清理止损，不宜强行推进",
    "情绪易上头，言语忌冲",
  ],
  good: ["清理待办", "把话说短", "早点下班"],
  avoid: ["深夜小作文", "冲动辞职", "追问已读不回"],
  oracle: "今日宜顺势整理，忌硬扛内耗；先稳住节奏，再处理变化。",
};
