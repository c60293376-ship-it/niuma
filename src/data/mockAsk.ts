export interface QuickQuestion {
  text: string;
  scene: string;
}

export interface AskResult {
  question: string;
  scene: string;
  mainHexagram: string;
  movingLine: string;
  changedHexagram: string;
  tendency: string;
  basis: string;
  poem: string;
  interpretation: string;
  good: string[];
  avoid: string[];
  action: string;
  talisman: string;
}

export const sceneOptions = ["随问", "感情", "学业", "工作", "人际", "选择"];

export const quickQuestions: QuickQuestion[] = [
  { text: "要不要催导师？", scene: "学业" },
  { text: "这个 offer 接吗？", scene: "工作" },
  { text: "要不要提离职？", scene: "工作" },
  { text: "今天适合汇报吗？", scene: "工作" },
  { text: "要不要主动找 TA？", scene: "感情" },
  { text: "这事该冲吗？", scene: "选择" },
];

export const mockAskResult: AskResult = {
  question: "我要不要催导师回消息？",
  scene: "学业",
  mainHexagram: "风山渐",
  movingLine: "二爻",
  changedHexagram: "巽为风",
  tendency: "宜缓中进",
  basis: "渐卦主循序渐进，问沟通之事宜缓不宜急；巽有入、顺、委婉表达之意。",
  poem: "雁行渐远，音信迟回；缓问有机，急催生悔。",
  interpretation:
    "你不是不能催，你是怕一催就显得自己很着急。但这件事不是靠内耗解决的，礼貌提醒一次就够了。",
  good: ["上午发", "三句话内说清楚", "发完就去做自己的事"],
  avoid: ["深夜发长消息", "连续追问", "反复刷新聊天框"],
  action: "礼貌提醒一次，语气短一点，发完不要再给自己加戏。",
  talisman: "导师慈悲符",
};
