export interface QuestionOption {
  label: string;
  value: string;
}

export type QuestionType = "single" | "multiple";

export interface MultiExclusiveRule {
  exclusiveValues: string[];
}

export interface RentalQuestion {
  id: string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options: QuestionOption[];
  /** 字段名 */
  field: string;
  /** 多选题互斥规则（仅 type=multiple 有效） */
  exclusive?: MultiExclusiveRule;
}

/** 获取某字段的默认值 */
export function getDefaultForField(field: string): string | string[] {
  switch (field) {
    case "rentalMode": return "租前看房";
    case "spaceType": return "整个房间";
    case "mainConcern": return ["只是随便看看"];
    case "riskFeature": return ["不确定"];
    case "facingTarget": return ["不确定"];
    case "backSupport": return "不确定";
    case "doorWindowRelation": return "不确定";
    default: return "不确定";
  }
}

/** 轻量问诊 4 题 */
export const basicQuestionFlow: RentalQuestion[] = [
  {
    id: "rentalMode",
    title: "你现在是？",
    subtitle: "租前看房重点看能不能租、有哪些雷点。已经入住重点看影响什么、怎么低成本调场。",
    type: "single",
    field: "rentalMode",
    options: [
      { label: "租前看房", value: "租前看房" },
      { label: "已经入住", value: "已经入住" },
    ],
  },
  {
    id: "spaceType",
    title: "你拍的是哪里？",
    type: "single",
    field: "spaceType",
    options: [
      { label: "整个房间", value: "整个房间" },
      { label: "卧室", value: "卧室" },
      { label: "床位", value: "床位" },
      { label: "书桌", value: "书桌" },
      { label: "出入口", value: "出入口" },
      { label: "窗边", value: "窗边" },
      { label: "卫生间附近", value: "卫生间附近" },
      { label: "其他", value: "其他" },
    ],
  },
  {
    id: "mainConcern",
    title: "你最担心什么？",
    subtitle: "可以多选",
    type: "multiple",
    field: "mainConcern",
    options: [
      { label: "睡不好", value: "睡不好" },
      { label: "太阴暗", value: "太阴暗" },
      { label: "潮湿", value: "潮湿" },
      { label: "太吵", value: "太吵" },
      { label: "不聚财", value: "不聚财" },
      { label: "没安全感", value: "没安全感" },
      { label: "只是随便看看", value: "只是随便看看" },
    ],
    exclusive: { exclusiveValues: ["只是随便看看"] },
  },
  {
    id: "riskFeature",
    title: "有没有明显雷点？",
    subtitle: "可以多选",
    type: "multiple",
    field: "riskFeature",
    options: [
      { label: "梁压床/压桌", value: "梁压床/压桌" },
      { label: "门直冲床/桌", value: "门直冲床/桌" },
      { label: "镜子对床/桌", value: "镜子对床/桌" },
      { label: "厕所太近", value: "厕所太近" },
      { label: "杂物太多", value: "杂物太多" },
      { label: "都没有", value: "都没有" },
      { label: "不确定", value: "不确定" },
    ],
    exclusive: { exclusiveValues: ["都没有", "不确定"] },
  },
];

/** 深度解析 3 题 */
export const deepQuestionFlow: RentalQuestion[] = [
  {
    id: "facingTarget",
    title: "床/座位正对什么？",
    subtitle: "可以多选",
    type: "multiple",
    field: "facingTarget",
    options: [
      { label: "门", value: "门" },
      { label: "窗", value: "窗" },
      { label: "镜子", value: "镜子" },
      { label: "卫生间", value: "卫生间" },
      { label: "墙", value: "墙" },
      { label: "不确定", value: "不确定" },
    ],
    exclusive: { exclusiveValues: ["不确定"] },
  },
  {
    id: "backSupport",
    title: "你坐/躺的时候，背后是什么？",
    type: "single",
    field: "backSupport",
    options: [
      { label: "墙", value: "墙" },
      { label: "椅背", value: "椅背" },
      { label: "柜子", value: "柜子" },
      { label: "空的", value: "空的" },
      { label: "走道", value: "走道" },
      { label: "不确定", value: "不确定" },
    ],
  },
  {
    id: "doorWindowRelation",
    title: "房门和窗户大概是什么关系？",
    subtitle: "凭感觉判断就行",
    type: "single",
    field: "doorWindowRelation",
    options: [
      { label: "门窗相对", value: "门窗相对" },
      { label: "门在侧边", value: "门在侧边" },
      { label: "窗在侧边", value: "窗在侧边" },
      { label: "两侧都有窗", value: "两侧都有窗" },
      { label: "看不出来", value: "看不出来" },
      { label: "不确定", value: "不确定" },
    ],
  },
];
