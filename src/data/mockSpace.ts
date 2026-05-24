export const spaceTypes = ["租房", "卧室", "工位", "教室", "自习位"];

export interface SpaceQuestion {
  title: string;
  options: string;
}

export const spaceQuestions: SpaceQuestion[] = [
  {
    title: "你的位置背后是什么？",
    options: "墙 / 过道 / 门 / 人或座位 / 不确定",
  },
  {
    title: "你的位置正前方是什么？",
    options: "开阔 / 墙 / 门 / 杂物 / 窗",
  },
  {
    title: "门或过道和你的位置关系？",
    options: "正对 / 在侧面 / 在背后 / 距离远",
  },
  {
    title: "空调或风口是否直吹？",
    options: "正对 / 侧面 / 背后 / 没有 / 不确定",
  },
  {
    title: "周围是否有镜子或横梁？",
    options: "有 / 没有 / 不确定",
  },
  {
    title: "整体光线如何？",
    options: "明亮 / 一般 / 偏暗 / 刺眼 / 不确定",
  },
];
