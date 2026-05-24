export type AuraLevel = "顺" | "堵" | "乱" | "虚" | "稳" | "压";

export type CheckLevel = "good" | "neutral" | "weak" | "bad";

export interface FengshuiCheck {
  name: string;
  status: string;
  level: CheckLevel;
}

export interface SpaceQuestionAnswers {
  backSupport: string;
  frontView: string;
  lightLevel: string;
  mainIssue: string;
}

export const defaultAnswers: SpaceQuestionAnswers = {
  backSupport: "不确定",
  frontView: "不确定",
  lightLevel: "不确定",
  mainIssue: "还挺舒服",
};

/** 安居模式 */
export type RentalMode = "租前看房" | "已经入住";

/** 分析深度 */
export type AnalysisDepth = "basic" | "deep";

/** 牛马安居局 — 轻量问诊回答（4 题） */
export interface BasicAnswers {
  rentalMode: RentalMode;
  spaceType: string;
  mainConcern: string[];
  riskFeature: string[];
}

export const defaultBasicAnswers: BasicAnswers = {
  rentalMode: "租前看房",
  spaceType: "整个房间",
  mainConcern: ["只是随便看看"],
  riskFeature: ["不确定"],
};

/** 牛马安居局 — 深度解析回答（3 题） */
export interface DeepAnswers {
  facingTarget: string[];
  backSupport: string;
  doorWindowRelation: string;
}

export const defaultDeepAnswers: DeepAnswers = {
  facingTarget: ["不确定"],
  backSupport: "不确定",
  doorWindowRelation: "不确定",
};

/** 牛马安居局 — 完整问诊回答（旧版兼容） */
export interface RentalAnswers {
  spaceType: string;
  mainConcern: string[];
  facingTarget: string[];
  backSupport: string;
  lightLevel: string;
  riskFeature: string[];
  stayDuration: string;
}

export const defaultRentalAnswers: RentalAnswers = {
  spaceType: "整个房间",
  mainConcern: ["只是随便看看"],
  facingTarget: ["不确定"],
  backSupport: "不确定",
  lightLevel: "不确定",
  riskFeature: ["不确定"],
  stayDuration: "还不确定",
};

/** 简易布局盘 */
export interface LayoutReading {
  facing: string;
  behind: string;
  doorWindow: string;
}

/** 堪舆依据条目 */
export interface KanyuBasisItem {
  aspect: string;
  finding: string;
  judgment: string;
}

/** 关键位置提示 */
export interface KeyPositionTip {
  position?: string;
  target: string;
  issue: string;
  advice: string;
}

export interface FengshuiFormBasisItem {
  issue: string;
  evidence: string;
  traditionalReason: string;
  modernTranslation: string;
  remedy: string;
}

export interface ExternalShaBasisItem {
  issue: string;
  evidence: string;
  status: "detected" | "possible" | "not_provided";
  remedy?: string;
}

export interface LiqiBasis {
  available: boolean;
  missingInfo: string[];
  note: string;
}

export interface FengshuiBasis {
  formBasis: FengshuiFormBasisItem[];
  externalShaBasis: ExternalShaBasisItem[];
  liqiBasis: LiqiBasis;
}

export interface SpaceFengshuiReading {
  id: string;
  fengshuiTitle: string;
  auraLevel: AuraLevel;
  fengshuiTags: string[];
  fengshuiChecks: FengshuiCheck[];
  poem: string;
  interpretationTemplates: string[];
  suitableFor: string[];
  suggestions: string[];
}

export interface SpaceFengshuiResult {
  id: string;
  imageUrl?: string;
  spaceType: string;
  answers: SpaceQuestionAnswers;
  rentalMode?: RentalMode;
  rentalAnswers?: RentalAnswers;
  basicAnswers?: BasicAnswers;
  deepAnswers?: DeepAnswers;
  analysisDepth: AnalysisDepth;
  rentalVerdict: string;
  riskLevel: "低风险" | "中风险" | "偏高风险" | "高风险";
  affectedLuck: string[];
  fengshuiTitle: string;
  auraLevel: AuraLevel;
  fengshuiTags: string[];
  fengshuiChecks: FengshuiCheck[];
  poem: string;
  interpretation: string;
  suitableFor: string[];
  suggestions: string[];
  followUpChecklist: string[];
  fengshuiBasis: FengshuiBasis;
  /** 深度解析模块 */
  layoutReading?: LayoutReading;
  kanyuSituation?: string;
  kanyuBasis?: KanyuBasisItem[];
  keyPositionTips?: KeyPositionTip[];
}

export const spaceFengshuiReadings: SpaceFengshuiReading[] = [
  {
    id: "mingtang-blocked",
    fengshuiTitle: "明堂受堵 · 杂物堵气",
    auraLevel: "堵",
    fengshuiTags: ["明堂受堵", "杂物堵气", "任务滞留"],
    fengshuiChecks: [
      { name: "明堂", status: "偏堵", level: "bad" },
      { name: "气口", status: "受阻", level: "weak" },
      { name: "光气", status: "偏弱", level: "weak" },
      { name: "动线", status: "不顺", level: "weak" },
      { name: "五行", status: "土重", level: "neutral" },
    ],
    poem: "桌前不清，心事难平；\n明堂受堵，念头难行。\n先开方寸地，再谈上岸心。",
    interpretationTemplates: [
      "从{空间}看，明堂偏堵、气口受阻，桌前一团杂气把路都堵死了。土重则滞，杂物多则气不流通，人坐在这里容易脑子也跟著卡住。这个场不是不能做事，但需要先打开明堂，让气有个去处，心念才能跟著顺起来。",
    ],
    suitableFor: ["整理资料", "短时学习", "轻量任务"],
    suggestions: [
      "清出桌面正前方，打开明堂",
      "杂物移到侧边，让气口通畅",
      "只留当前任务，减少杂气",
    ],
  },
  {
    id: "no-back-support",
    fengshuiTitle: "背后无靠 · 气口不聚",
    auraLevel: "虚",
    fengshuiTags: ["背后无靠", "气场不稳", "安全感不足"],
    fengshuiChecks: [
      { name: "靠山", status: "无靠", level: "bad" },
      { name: "气口", status: "偏散", level: "weak" },
      { name: "明堂", status: "尚可", level: "neutral" },
      { name: "光气", status: "普通", level: "neutral" },
      { name: "动线", status: "气来不聚", level: "weak" },
    ],
    poem: "背后无靠，心神易惊；\n气口不聚，牛马难定。\n先稳身后，再稳前程。",
    interpretationTemplates: [
      "从{空间}看，靠山无靠、气口偏散，背后的空荡让气场稳不下来。人坐在无靠之处，身体比脑子先警觉——坐不住、想刷手机、心神到处飘。不是你不自律，是身后没东西帮你兜底。先补靠山，再谈专注。",
    ],
    suitableFor: ["轻量工作", "整理任务", "短时专注"],
    suggestions: [
      "背后加一点支撑，补靠山",
      "椅背尽量靠实，稳气场",
      "避免背后太空，引气归位",
    ],
  },
  {
    id: "low-light",
    fengshuiTitle: "光气不足 · 明堂偏暗",
    auraLevel: "虚",
    fengshuiTags: ["光气不足", "阳气偏弱", "精神发虚"],
    fengshuiChecks: [
      { name: "光气", status: "不足", level: "bad" },
      { name: "五行", status: "火虚", level: "weak" },
      { name: "明堂", status: "偏暗", level: "weak" },
      { name: "气口", status: "不畅", level: "weak" },
      { name: "动线", status: "尚可", level: "neutral" },
    ],
    poem: "光气不足，火气难生；\n明堂偏暗，牛马发昏。\n补一盏灯，续半条命。",
    interpretationTemplates: [
      "从{空间}看，光气不足、五行火虚，整个场偏阴偏沉。火主行动力和精神头，火一弱人就容易犯困、拖延、提不起劲。明堂偏暗，气口不畅，这个场不宜在暗处硬熬 DDL。先把明堂照亮，让火气生起来，状态才会回来。",
    ],
    suitableFor: ["休息", "轻阅读", "低强度任务"],
    suggestions: [
      "补一盏稳定光源，先补光气",
      "桌前清出明堂区域",
      "别在暗处硬熬，守阳气",
    ],
  },
  {
    id: "scattered-qi",
    fengshuiTitle: "气口太散 · 动线不顺",
    auraLevel: "乱",
    fengshuiTags: ["气口偏散", "动线不聚", "专注易散"],
    fengshuiChecks: [
      { name: "气口", status: "太散", level: "bad" },
      { name: "明堂", status: "偏空", level: "weak" },
      { name: "靠山", status: "不稳", level: "weak" },
      { name: "动线", status: "绕行", level: "weak" },
      { name: "五行", status: "水散", level: "neutral" },
    ],
    poem: "风是有的，只是乱吹；\n气口太散，心神易飞。\n收一收气，事才会成。",
    interpretationTemplates: [
      "从{空间}看，气口太散、动线绕行，气进来聚不住就散了。水散则神散，在这个场里容易想很多、做很少——念头飞了一圈，真正落地的没几个。先把常用物收到近处，收一收气口，让明堂聚起来，专注力才会跟著回来。",
    ],
    suitableFor: ["短时学习", "轻量办公", "任务拆分"],
    suggestions: [
      "常用物收在近处，收气口",
      "减少视线干扰，聚明堂",
      "先专注一轮，再休息",
    ],
  },
  {
    id: "overhead-pressure",
    fengshuiTitle: "压顶偏重 · 心气受压",
    auraLevel: "压",
    fengshuiTags: ["压顶", "物品压迫", "心气受压"],
    fengshuiChecks: [
      { name: "压迫", status: "压顶偏重", level: "bad" },
      { name: "明堂", status: "受压", level: "weak" },
      { name: "气口", status: "不舒", level: "weak" },
      { name: "五行", status: "土重", level: "weak" },
      { name: "光气", status: "偏弱", level: "neutral" },
    ],
    poem: "头上有山，心里有班；\n压顶偏重，不宜硬扛。\n此局宜减，不宜硬刚。",
    interpretationTemplates: [
      "从{空间}看，压顶偏重、明堂受压，头顶的压迫感会直接传到心里。土重压顶，心气受压，明明有事要做却觉得喘不过气。不是你懒，是这个场给你加了重量。先减一减头顶和眼前的压迫物，减量比硬扛更管用。",
    ],
    suitableFor: ["整理空间", "轻量任务", "休息恢复"],
    suggestions: [
      "移走头顶压迫物，减压顶",
      "清出一块空白，松明堂",
      "今天少开任务，减轻土气",
    ],
  },
  {
    id: "good-yang-qi",
    fengshuiTitle: "阳气尚足 · 明堂可用",
    auraLevel: "顺",
    fengshuiTags: ["光气尚足", "明堂可用", "适合开工"],
    fengshuiChecks: [
      { name: "光气", status: "尚足", level: "good" },
      { name: "明堂", status: "可用", level: "good" },
      { name: "气口", status: "较顺", level: "good" },
      { name: "动线", status: "顺", level: "good" },
      { name: "靠山", status: "尚稳", level: "neutral" },
    ],
    poem: "此地今日可用，气还算顺；\n明堂不堵，牛马可以开工。\n先动一寸，胜过许愿三更。",
    interpretationTemplates: [
      "从{空间}看，光气尚足、明堂可用、气口较顺——这是一个能开工的场。五行偏平不冲，动线也顺，风水上没什么拦著你的。真正的问题可能不是空间，是你还在犹豫。趁气场顺，先把最难的事做了。",
    ],
    suitableFor: ["深度工作", "赶 DDL", "专注学习"],
    suggestions: [
      "趁气场顺，先做最难任务",
      "手机放远，守明堂",
      "四十分钟后休息，顺动线",
    ],
  },
  {
    id: "rest-recovery",
    fengshuiTitle: "休息回血 · 气场偏软",
    auraLevel: "稳",
    fengshuiTags: ["宜休息", "气场偏软", "不宜硬刚"],
    fengshuiChecks: [
      { name: "气场", status: "偏软", level: "neutral" },
      { name: "光气", status: "偏弱", level: "weak" },
      { name: "明堂", status: "不宜开工", level: "weak" },
      { name: "五行", status: "水重", level: "neutral" },
      { name: "动线", status: "缓", level: "neutral" },
    ],
    poem: "此地适合回血，\n不适合假装自律；\n气场偏软宜休憩，\n别边躺边骂自己。",
    interpretationTemplates: [
      "从{空间}看，气场偏软、光气偏弱、五行水重，整个场天然偏向静止和恢复。这种气场不是坏事——它适合回血，不适合冲刺。如果硬要在这里高强度输出，效果可能不如认真休息一小时再来。顺气场而为，比逆气场硬刚聪明。",
    ],
    suitableFor: ["休息", "放空", "轻恢复"],
    suggestions: [
      "休息就认真休息，顺气场",
      "不在床上写作业，分区明堂",
      "设一个结束时间，不耗气",
    ],
  },
  {
    id: "too-many-people",
    fengshuiTitle: "人气过旺 · 明堂不聚",
    auraLevel: "乱",
    fengshuiTags: ["人气太旺", "杂音扰心", "专注受冲"],
    fengshuiChecks: [
      { name: "人气", status: "过旺", level: "weak" },
      { name: "气口", status: "嘈杂", level: "bad" },
      { name: "明堂", status: "不聚", level: "weak" },
      { name: "动线", status: "受扰", level: "weak" },
      { name: "靠山", status: "易动", level: "neutral" },
    ],
    poem: "此地人气很旺，专注很弱；\n气场嘈杂，不宜深度修仙。\n若要上岸，先避喧哗。",
    interpretationTemplates: [
      "从{空间}看，人气过旺、气口嘈杂，人多则气场杂，杂气冲心神，明堂难聚、专注大打折扣。在这个场里适合社交和轻任务，不适合深度修仙。重要的事建议换一个安静位置，或者只在这里处理轻量沟通类的任务。",
    ],
    suitableFor: ["轻任务", "聊天沟通", "整理资料"],
    suggestions: [
      "重要任务换地方，避杂气",
      "戴耳机隔干扰，守气口",
      "只处理轻任务，不硬刚",
    ],
  },
];

/** 场所类型到候选 reading id 的权重映射 */
export const spaceTypeWeights: Record<string, Record<string, number>> = {
  "书桌": {
    "mingtang-blocked": 3,
    "low-light": 3,
    "good-yang-qi": 3,
    "scattered-qi": 2,
    "no-back-support": 2,
    "overhead-pressure": 1,
    "rest-recovery": 1,
    "too-many-people": 1,
  },
  "工位": {
    "no-back-support": 3,
    "scattered-qi": 3,
    "too-many-people": 3,
    "good-yang-qi": 2,
    "mingtang-blocked": 2,
    "overhead-pressure": 2,
    "low-light": 1,
    "rest-recovery": 1,
  },
  "宿舍": {
    "mingtang-blocked": 3,
    "too-many-people": 3,
    "low-light": 3,
    "rest-recovery": 2,
    "scattered-qi": 2,
    "good-yang-qi": 1,
    "no-back-support": 1,
    "overhead-pressure": 1,
  },
  "卧室": {
    "rest-recovery": 3,
    "low-light": 3,
    "overhead-pressure": 3,
    "mingtang-blocked": 1,
    "scattered-qi": 1,
    "good-yang-qi": 1,
    "no-back-support": 1,
    "too-many-people": 1,
  },
  "房间": {
    "rest-recovery": 3,
    "low-light": 3,
    "overhead-pressure": 3,
    "too-many-people": 2,
    "scattered-qi": 2,
    "mingtang-blocked": 1,
    "no-back-support": 1,
    "good-yang-qi": 1,
  },
  "教室": {
    "too-many-people": 3,
    "low-light": 3,
    "mingtang-blocked": 3,
    "scattered-qi": 2,
    "no-back-support": 2,
    "good-yang-qi": 1,
    "rest-recovery": 1,
    "overhead-pressure": 1,
  },
  "其他": {
    "mingtang-blocked": 2,
    "no-back-support": 2,
    "low-light": 2,
    "scattered-qi": 2,
    "overhead-pressure": 2,
    "good-yang-qi": 2,
    "rest-recovery": 2,
    "too-many-people": 2,
  },
};

/** 将 spaceType 转为解读中使用的空间称谓 */
export function getSpaceLabel(spaceType: string): string {
  const map: Record<string, string> = {
    "书桌": "这个书桌局",
    "工位": "这个工位局",
    "宿舍": "这个宿舍场",
    "卧室": "这个卧室场",
    "房间": "这个房间场",
    "教室": "这个教室场",
  };
  return map[spaceType] ?? "这个空间";
}
