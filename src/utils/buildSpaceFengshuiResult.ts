import type {
  SpaceFengshuiResult,
  SpaceFengshuiReading,
  FengshuiCheck,
  SpaceQuestionAnswers,
  RentalMode,
  RentalAnswers,
  AnalysisDepth,
  BasicAnswers,
  DeepAnswers,
  LayoutReading,
  KanyuBasisItem,
  KeyPositionTip,
  FengshuiBasis,
} from "../data/spaceFengshuiReadings";
import {
  spaceFengshuiReadings,
  spaceTypeWeights,
  getSpaceLabel,
} from "../data/spaceFengshuiReadings";

export interface BuildInput {
  imageUrl: string;
  spaceType: string;
  answers: SpaceQuestionAnswers;
  timestamp: number;
  rentalMode?: RentalMode;
  rentalAnswers?: RentalAnswers;
  analysisDepth?: AnalysisDepth;
  basicAnswers?: BasicAnswers;
  deepAnswers?: DeepAnswers;
}

/**
 * 将新版 RentalAnswers 兼容映射为旧版 SpaceQuestionAnswers，
 * 确保现有 build 逻辑不崩。
 */
/** 将 string | string[] 安全地转为 string */
function asString(v: string | string[]): string {
  return Array.isArray(v) ? v.join("、") : v;
}

function mapRentalToLegacy(rental: RentalAnswers): SpaceQuestionAnswers {
  return {
    backSupport: rental.backSupport,
    frontView: mapFacingToFrontView(asString(rental.facingTarget)),
    lightLevel: mapRentalLightToLegacy(rental.lightLevel),
    mainIssue: asString(rental.mainConcern),
  };
}

/** BasicAnswers + DeepAnswers → 旧版 SpaceQuestionAnswers */
function mapBasicAndDeepToLegacy(basic: BasicAnswers, deep?: DeepAnswers): SpaceQuestionAnswers {
  const facingStr = deep ? asString(deep.facingTarget) : "不确定";
  const backStr = deep?.backSupport ?? "不确定";
  return {
    backSupport: backStr,
    frontView: mapFacingToFrontView(facingStr),
    lightLevel: "不确定",
    mainIssue: asString(basic.mainConcern),
  };
}

function mapFacingToFrontView(facing: string): string {
  // 如果多选，取第一个非"不确定"的，或第一个
  const parts = facing.split("、");
  const firstReal = parts.find((p) => p !== "不确定");
  const target = firstReal ?? parts[0];
  switch (target) {
    case "门": return "被杂物挡住";
    case "窗": return "开阔";
    case "镜子": return "对着墙";
    case "卫生间": return "被杂物挡住";
    case "墙": return "对着墙";
    default: return "不确定";
  }
}

function mapRentalLightToLegacy(light: string): string {
  switch (light) {
    case "很亮": return "很亮";
    case "刚好": return "刚好";
    case "有点暗": return "有点暗";
    case "主要靠灯": return "主要靠屏幕";
    case "白天也暗": return "有点暗";
    default: return "不确定";
  }
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function weightedPick<T>(items: T[], weights: number[], seed: number): T {
  const total = weights.reduce((s, w) => s + Math.max(0, w), 0);
  if (total <= 0) return items[0];
  let r = pseudoRandom(seed) * total;
  for (let i = 0; i < items.length; i++) {
    r -= Math.max(0, weights[i]);
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

/** 根据用户回答调整权重 */
function applyAnswerWeights(
  baseWeights: Record<string, number>,
  answers: SpaceQuestionAnswers,
): Record<string, number> {
  const w = { ...baseWeights };

  // backSupport
  if (answers.backSupport === "空的") {
    w["no-back-support"] = (w["no-back-support"] ?? 2) * 2.5;
  } else if (["墙", "椅背", "柜子"].includes(answers.backSupport)) {
    w["no-back-support"] = (w["no-back-support"] ?? 2) * 0.3;
    w["good-yang-qi"] = (w["good-yang-qi"] ?? 2) * 1.3;
  }

  // frontView
  if (answers.frontView === "开阔") {
    w["good-yang-qi"] = (w["good-yang-qi"] ?? 2) * 1.5;
    w["scattered-qi"] = (w["scattered-qi"] ?? 2) * 0.5;
  } else if (answers.frontView === "有点乱") {
    w["mingtang-blocked"] = (w["mingtang-blocked"] ?? 2) * 2;
  } else if (answers.frontView === "被杂物挡住") {
    w["mingtang-blocked"] = (w["mingtang-blocked"] ?? 2) * 2.5;
    w["overhead-pressure"] = (w["overhead-pressure"] ?? 2) * 1.5;
  } else if (answers.frontView === "对着墙") {
    w["mingtang-blocked"] = (w["mingtang-blocked"] ?? 2) * 1.5;
    w["overhead-pressure"] = (w["overhead-pressure"] ?? 2) * 1.5;
  }

  // lightLevel
  if (answers.lightLevel === "很亮") {
    w["good-yang-qi"] = (w["good-yang-qi"] ?? 2) * 2;
    w["low-light"] = (w["low-light"] ?? 2) * 0.2;
  } else if (answers.lightLevel === "刚好") {
    w["good-yang-qi"] = (w["good-yang-qi"] ?? 2) * 1.5;
  } else if (answers.lightLevel === "有点暗") {
    w["low-light"] = (w["low-light"] ?? 2) * 2.5;
  } else if (answers.lightLevel === "主要靠屏幕") {
    w["low-light"] = (w["low-light"] ?? 2) * 3;
  }

  // mainIssue
  if (answers.mainIssue === "东西太多") {
    w["mingtang-blocked"] = (w["mingtang-blocked"] ?? 2) * 2;
  } else if (answers.mainIssue === "有点吵") {
    w["too-many-people"] = (w["too-many-people"] ?? 2) * 2.5;
  } else if (answers.mainIssue === "容易犯困") {
    w["low-light"] = (w["low-light"] ?? 2) * 2;
    w["rest-recovery"] = (w["rest-recovery"] ?? 2) * 1.5;
  } else if (answers.mainIssue === "没安全感") {
    w["no-back-support"] = (w["no-back-support"] ?? 2) * 2.5;
  } else if (answers.mainIssue === "还挺舒服") {
    w["good-yang-qi"] = (w["good-yang-qi"] ?? 2) * 1.5;
    w["rest-recovery"] = (w["rest-recovery"] ?? 2) * 1.5;
  }

  return w;
}

/** 根据用户回答覆盖风水盘点 */
function applyAnswersToChecks(
  checks: FengshuiCheck[],
  answers: SpaceQuestionAnswers,
): FengshuiCheck[] {
  const modified = checks.map((c) => ({ ...c }));

  const upsert = (name: string, status: string, level: FengshuiCheck["level"]) => {
    const idx = modified.findIndex((c) => c.name === name);
    if (idx >= 0) {
      modified[idx] = { name, status, level };
    }
  };

  // backSupport → 靠山
  if (answers.backSupport === "空的") {
    upsert("靠山", "无靠", "bad");
  } else if (["墙", "柜子"].includes(answers.backSupport)) {
    upsert("靠山", "有靠", "good");
  } else if (answers.backSupport === "椅背") {
    upsert("靠山", "半靠", "neutral");
  }

  // frontView → 明堂
  if (answers.frontView === "有点乱" || answers.frontView === "被杂物挡住") {
    upsert("明堂", "偏堵", "bad");
  } else if (answers.frontView === "开阔") {
    upsert("明堂", "开阔", "good");
  } else if (answers.frontView === "对着墙") {
    upsert("明堂", "偏窄", "weak");
  }

  // lightLevel → 光气
  if (answers.lightLevel === "有点暗" || answers.lightLevel === "主要靠屏幕") {
    upsert("光气", "不足", "bad");
  } else if (answers.lightLevel === "很亮") {
    upsert("光气", "充足", "good");
  } else if (answers.lightLevel === "刚好") {
    upsert("光气", "尚足", "good");
  }

  return modified;
}

/** 根据用户回答生成观察句，嵌入风水解读 */
function buildAnswerObservations(
  answers: SpaceQuestionAnswers,
): string[] {
  const obs: string[] = [];

  if (answers.backSupport === "空的") {
    obs.push("你提到背后偏空，正应了此局「靠山无靠」的判断——背后缺支撑，心神容易飘。");
  } else if (["墙", "椅背", "柜子"].includes(answers.backSupport)) {
    obs.push("你背后有依靠，靠山不算空，这一点对气场稳定有帮助。");
  }

  if (answers.frontView === "有点乱" || answers.frontView === "被杂物挡住") {
    obs.push("你选了正前方偏堵，对应明堂受堵之象——眼前杂物多，注意力容易被分散。");
  } else if (answers.frontView === "开阔") {
    obs.push("正前方开阔，明堂不堵，视线通畅，这一点对专注有利。");
  } else if (answers.frontView === "对着墙") {
    obs.push("正前方对着墙，明堂偏窄——眼前没有余地，容易觉得被限制。");
  }

  if (answers.lightLevel === "有点暗" || answers.lightLevel === "主要靠屏幕") {
    obs.push("光线偏弱、光气不足，火气难生，做事容易提不起劲。");
  } else if (answers.lightLevel === "很亮") {
    obs.push("光线充足，光气旺盛，阳气不弱，精神头有保障。");
  } else if (answers.lightLevel === "刚好") {
    obs.push("光线刚好，光气不弱，这个场的阳气还算够用。");
  }

  if (answers.mainIssue === "东西太多") {
    obs.push("你自己也感觉到了——东西太多、杂物堵气，正是明堂受堵的表现。");
  } else if (answers.mainIssue === "有点吵") {
    obs.push("你觉得这里偏吵，人气过旺、气口嘈杂，气场确实不利于深度专注。");
  } else if (answers.mainIssue === "容易犯困") {
    obs.push("容易犯困不是你的问题——光气不足、火弱则精神不振，这是场的问题。");
  } else if (answers.mainIssue === "没安全感") {
    obs.push("没安全感是有原因的——此局背后虚空，靠山不足，身体比脑子先警觉。");
  } else if (answers.mainIssue === "还挺舒服") {
    obs.push("你感觉还挺舒服，这个直觉不假——气场较顺，宜顺势而为。");
  }

  return obs;
}

/* ========== 深度解析生成 ========== */

function buildLayoutReading(deep: DeepAnswers): LayoutReading {
  const facing = asString(deep.facingTarget);
  return {
    facing: facing === "不确定" ? "未明确" : facing,
    behind: deep.backSupport === "不确定" ? "未明确" : deep.backSupport,
    doorWindow: deep.doorWindowRelation === "不确定" ? "未明确" : deep.doorWindowRelation,
  };
}

function buildKanyuSituation(deep: DeepAnswers, picked: SpaceFengshuiReading): string {
  const parts: string[] = [];
  const dw = deep.doorWindowRelation;

  // 门窗关系
  if (dw === "门窗相对") parts.push("门窗相冲 · 气来不聚");
  else if (dw === "门在侧边") parts.push("气口偏安 · 来气较稳");
  else if (dw === "窗在侧边") parts.push("明堂侧开 · 气有来路");
  else if (dw === "两侧都有窗") parts.push("气口双开 · 来去较快");
  else parts.push("门窗关系未明");

  // 背后
  if (deep.backSupport === "空的" || deep.backSupport === "走道") parts.push("背后无靠 · 动线扰身");
  else if (["墙", "柜子"].includes(deep.backSupport)) parts.push("靠山尚稳 · 明堂可用");
  else if (deep.backSupport === "椅背") parts.push("靠山半稳 · 宜补实靠");
  else parts.push("靠山未明");

  // 补一条来自 reading 的判断
  parts.push(picked.auraLevel === "顺" || picked.auraLevel === "稳" ? "整体气感尚可" : "需注意气场调节");

  return parts.join("\n");
}

function buildKanyuBasis(deep: DeepAnswers, basic: BasicAnswers | Partial<BasicAnswers>): KanyuBasisItem[] {
  const items: KanyuBasisItem[] = [];
  const facing = asString(deep.facingTarget);
  const riskFeatures = basic.riskFeature ?? [];

  // 门冲
  if (facing.includes("门")) {
    items.push({ aspect: "门冲", finding: "床/座正对门", judgment: "气直冲身，心神难定，不宜长居此处" });
  }
  // 窗
  if (facing.includes("窗")) {
    items.push({ aspect: "窗对", finding: "床/座正对窗", judgment: "光气直入，来去较快，建议加帘缓冲" });
  }
  // 镜子
  if (facing.includes("镜子")) {
    items.push({ aspect: "镜煞", finding: "床/座对镜", judgment: "镜反射扰心神，影响睡眠质量" });
  }
  // 背后
  if (deep.backSupport === "空的" || deep.backSupport === "走道") {
    items.push({ aspect: "靠山虚", finding: "背后无靠", judgment: "缺乏安全感和稳定感，影响决策信心" });
  } else if (["墙", "柜子"].includes(deep.backSupport)) {
    items.push({ aspect: "靠山实", finding: "背后有靠", judgment: "气场较稳，适合长期居住和工作" });
  }
  // 门窗关系
  if (deep.doorWindowRelation === "门窗相对") {
    items.push({ aspect: "穿堂风", finding: "门窗成一直线", judgment: "气来即走，不聚财气，需加屏风或帘隔断" });
  }

  // 从 riskFeature 补充
  if (riskFeatures.includes("梁压床/压桌")) {
    items.push({ aspect: "压顶", finding: "梁压床或压桌", judgment: "压迫感影响睡眠和专注，宜移位或用布幔化解" });
  }
  if (riskFeatures.includes("厕所太近")) {
    items.push({ aspect: "浊气", finding: "卫生间太近", judgment: "浊气影响健康运，保持门常闭并加门帘" });
  }

  if (items.length === 0) {
    items.push({ aspect: "综合", finding: "未发现明显的堪舆硬伤", judgment: "整体布局尚可，关注采光和通风即可" });
  }
  return items.slice(0, 5);
}

function buildKeyPositionTips(deep: DeepAnswers): KeyPositionTip[] {
  const tips: KeyPositionTip[] = [];
  const facing = asString(deep.facingTarget);

  if (facing.includes("门")) {
    tips.push({ position: "床/桌", target: "床/桌", issue: "可能受门冲", advice: "可用帘子、屏风或家具边界缓一缓动线。" });
  }
  if (facing.includes("窗")) {
    tips.push({ position: "窗边", target: "窗边", issue: "光线和气流直入", advice: "用窗帘调光，别让床桌长期被直吹直晒。" });
  }
  if (facing.includes("镜子")) {
    tips.push({ position: "镜子", target: "镜子", issue: "反射干扰床桌", advice: "移动镜子，或先用布帘遮挡直照区域。" });
  }
  if (deep.backSupport === "空的" || deep.backSupport === "走道") {
    tips.push({ position: "背后", target: "背后", issue: "靠山偏虚", advice: "背后加靠垫、柜体或调整座位，让身后有实。" });
  }
  if (deep.doorWindowRelation === "门窗相对") {
    tips.push({ position: "门窗动线", target: "门窗动线", issue: "气来不聚", advice: "门窗之间加帘、屏风或半高柜，先让气慢下来。" });
  }

  if (tips.length === 0) {
    tips.push({ position: "整体", target: "整体", issue: "未见明显位置硬伤", advice: "保持整洁通风，先稳床位，再谈聚气。" });
  }
  return tips.slice(0, 4);
}

function includesAny(values: string[] | undefined, targets: string[]): boolean {
  return Boolean(values?.some((v) => targets.includes(v)));
}

function buildFengshuiBasis(basic: BasicAnswers, deep?: DeepAnswers): FengshuiBasis {
  const formBasis: FengshuiBasis["formBasis"] = [];
  const risks = basic.riskFeature;
  const concerns = basic.mainConcern;
  const facing = deep?.facingTarget ?? [];

  const add = (item: FengshuiBasis["formBasis"][number]) => {
    if (!formBasis.some((existing) => existing.issue === item.issue)) formBasis.push(item);
  };

  if (risks.includes("梁压床/压桌")) {
    add({
      issue: "压顶",
      evidence: "用户反馈存在梁压床/压桌",
      traditionalReason: "梁压为形势压迫，主气机不舒。",
      modernTranslation: "长期在压迫感强的位置睡觉或工作，容易有心理压力和疲惫感。",
      remedy: "能挪床/桌优先挪位；不能挪时，用灯光、布帘或软装降低压迫感。",
    });
  }

  if (risks.includes("镜子对床/桌") || facing.includes("镜子")) {
    add({
      issue: "镜照扰心",
      evidence: "用户反馈镜子对床/桌，或床/座位正对镜子",
      traditionalReason: "镜为反照之物，正照久停之处，易扰心神。",
      modernTranslation: "夜间反光和视线反射容易增加不安感，影响休息与专注。",
      remedy: "移动镜子，或用布帘遮挡；避免镜面直照床头和书桌。",
    });
  }

  if (risks.includes("厕所太近") || facing.includes("卫生间")) {
    add({
      issue: "厕气偏近",
      evidence: "用户反馈床/座位靠近或正对卫生间",
      traditionalReason: "厕为湿秽之地，近床近桌则气杂。",
      modernTranslation: "潮湿、异味、通风和噪音会影响长期居住舒适度。",
      remedy: "保持卫生间干燥通风，门常关，可用门帘和除湿用品缓解。",
    });
  }

  if (risks.includes("门直冲床/桌") || facing.includes("门")) {
    add({
      issue: "门冲",
      evidence: "用户反馈门直冲床/桌，或床/座位正对门",
      traditionalReason: "门为气口，直冲久停之位，则动气太急。",
      modernTranslation: "开门动线、声音和视线干扰会影响睡眠和专注。",
      remedy: "调整床/桌位置，或用帘子、屏风、柜体边界缓冲。",
    });
  }

  if (risks.includes("杂物太多")) {
    add({
      issue: "明堂受堵",
      evidence: "用户反馈房间杂物较多",
      traditionalReason: "明堂宜清，杂物堵塞则气不易聚。",
      modernTranslation: "正前方信息过多会增加分心和拖延。",
      remedy: "清出床前或桌前区域，只保留当前任务需要的东西。",
    });
  }

  if (concerns.includes("太阴暗")) {
    add({
      issue: "光气不足",
      evidence: "用户担心房间太阴暗",
      traditionalReason: "光气不足，则阳气偏弱，空间生发之气不足。",
      modernTranslation: "容易犯困、拖延、提不起劲，长期住会觉得状态虚。",
      remedy: "补稳定暖光源，优先照亮床边、桌前和入口区域。",
    });
  }

  if (concerns.includes("潮湿")) {
    add({
      issue: "潮湿疑虑",
      evidence: "用户担心房间潮湿",
      traditionalReason: "湿气重则气浊，久居不利清爽安定。",
      modernTranslation: "可能对应返潮、异味、霉味、通风差等租房隐患。",
      remedy: "租前追问返潮情况；入住后保持通风、除湿，卫生间门常关。",
    });
  }

  if (concerns.includes("太吵")) {
    add({
      issue: "人气过旺 / 动气扰身",
      evidence: "用户担心房间太吵",
      traditionalReason: "居处宜静，动气过旺则难以安神。",
      modernTranslation: "噪音会影响睡眠、工作和情绪稳定。",
      remedy: "租前确认夜间噪音；入住后用耳塞、厚窗帘或调整睡眠区。",
    });
  }

  if (deep?.backSupport === "空的" || deep?.backSupport === "走道") {
    add({
      issue: "背后无靠",
      evidence: "用户反馈背后为空或靠走道",
      traditionalReason: "久坐久卧之处宜有靠，背后虚则心神不稳。",
      modernTranslation: "缺乏安全感，工作学习时容易分心和紧张。",
      remedy: "背后加靠垫、柜体或调整位置，让身后有实。",
    });
  }

  if (formBasis.length === 0) {
    add({
      issue: "未见明显形势硬伤",
      evidence: "用户未反馈梁、镜、厕所、门冲、潮湿等明显雷点",
      traditionalReason: "形势先看气口、明堂、靠山和光气；当前问诊未见明显冲压。",
      modernTranslation: "这个房间不是完美，但暂时没有一眼必须大改的问题。",
      remedy: "保持床前和桌前清爽，补稳定光源，入住前再看夜间噪音和潮湿。",
    });
  }

  return {
    formBasis,
    externalShaBasis: [
      {
        issue: "外煞未判",
        evidence: "未提供窗外或门外照片",
        status: "not_provided",
        remedy: "如需判断路冲、天斩、壁刀、尖角、反弓等外煞，可后续补拍窗外或门口照片。",
      },
    ],
    liqiBasis: {
      available: false,
      missingInfo: ["房屋坐向", "建成或入住时间", "门、窗、床、厕所在方位", "当前元运"],
      note: "玄空飞星需结合坐向、时间和室内方位。本次信息不足，暂不作飞星强断；当前报告主要依据形势、问诊和可见布局判断。",
    },
  };
}

function calculateRiskScore(basic: BasicAnswers, basis: FengshuiBasis, deep?: DeepAnswers): number {
  const badIssues = ["压顶", "镜照扰心", "厕气偏近", "门冲", "背后无靠", "潮湿疑虑"];
  const weakIssues = ["光气不足", "明堂受堵", "人气过旺 / 动气扰身", "杂物堵气", "动线不顺"];
  let score = 0;

  basis.formBasis.forEach((item) => {
    if (badIssues.includes(item.issue)) score += 2;
    else if (weakIssues.includes(item.issue)) score += 1;
  });

  if (deep?.doorWindowRelation === "门窗相对") score += 2;
  if (deep?.backSupport === "走道") score += 2;
  if (deep?.backSupport === "空的") score += 1;
  if (deep?.facingTarget.includes("门")) score += 2;
  if (includesAny(deep?.facingTarget, ["镜子", "卫生间"])) score += 1;
  if (basic.mainConcern.includes("不聚财")) score += 1;

  return score;
}

function getRiskLevel(score: number): SpaceFengshuiResult["riskLevel"] {
  if (score <= 1) return "低风险";
  if (score <= 3) return "中风险";
  if (score <= 5) return "偏高风险";
  return "高风险";
}

function buildRentalVerdict(mode: RentalMode, riskLevel: SpaceFengshuiResult["riskLevel"]): string {
  if (riskLevel === "低风险") return "可租";
  if (mode === "已经入住") return "已入住先调场";
  if (riskLevel === "高风险") return "慎租，长住别硬扛";
  if (riskLevel === "偏高风险") return "短租能过渡，长住要先调";
  return "可租但要调";
}

function buildAffectedLuck(basic: BasicAnswers, basis: FengshuiBasis): string[] {
  const affected = new Set<string>();
  if (basic.mainConcern.includes("睡不好") || basis.formBasis.some((b) => ["镜照扰心", "厕气偏近", "门冲", "压顶"].includes(b.issue))) affected.add("睡眠");
  if (basic.mainConcern.includes("不聚财") || basis.formBasis.some((b) => ["门冲", "明堂受堵"].includes(b.issue))) affected.add("聚财感");
  if (basic.mainConcern.includes("太阴暗") || basis.formBasis.some((b) => b.issue === "光气不足")) affected.add("行动力");
  if (basic.mainConcern.includes("没安全感") || basis.formBasis.some((b) => b.issue === "背后无靠")) affected.add("安全感");
  if (basic.mainConcern.includes("太吵") || basis.formBasis.some((b) => b.issue.includes("动气"))) affected.add("专注");
  if (affected.size === 0) affected.add("日常舒适度");
  return [...affected];
}

function buildFollowUpChecklist(mode: RentalMode, basis: FengshuiBasis): string[] {
  const base = mode === "租前看房"
    ? ["晚上再看一次噪音和光线", "追问返潮、漏水、卫生间异味", "确认床桌能不能挪位"]
    : ["先清床前和桌前明堂", "补一盏稳定暖光源", "把门、镜、厕所这些直冲点先挡一挡"];
  if (basis.formBasis.some((b) => b.issue === "潮湿疑虑" || b.issue === "厕气偏近")) {
    return ["确认潮湿和异味来源", ...base.slice(0, 2)];
  }
  return base;
}

/* ================================================ */

export function buildSpaceFengshuiResult(input: BuildInput): SpaceFengshuiResult {
  const { imageUrl, spaceType, answers: inputAnswers, timestamp, rentalMode, rentalAnswers, analysisDepth, basicAnswers, deepAnswers } = input;

  // 兼容：新版 BasicAnswers + DeepAnswers → 旧版 SpaceQuestionAnswers
  const answers: SpaceQuestionAnswers = basicAnswers
    ? mapBasicAndDeepToLegacy(basicAnswers, deepAnswers)
    : rentalAnswers
      ? mapRentalToLegacy(rentalAnswers)
      : inputAnswers;

  const mode: RentalMode = basicAnswers?.rentalMode ?? rentalMode ?? "租前看房";
  const depth: AnalysisDepth = analysisDepth ?? "basic";
  const normalizedBasic: BasicAnswers = basicAnswers ?? {
    rentalMode: mode,
    spaceType,
    mainConcern: [answers.mainIssue],
    riskFeature: [],
  };

  // 1. 获取场所基础权重 + 用户回答调整
  const baseWeights = { ...(spaceTypeWeights[spaceType] ?? spaceTypeWeights["其他"]) };
  const weights = applyAnswerWeights(baseWeights, answers);

  // 2. 加权选择
  const readingsWithWeights = spaceFengshuiReadings.map((r) => ({
    reading: r,
    weight: weights[r.id] ?? 2,
  }));

  const candidates = readingsWithWeights.map((r) => r.reading);
  const weightValues = readingsWithWeights.map((r) => r.weight);

  const seed = Math.floor(timestamp / 1000) + spaceType.length * 137;
  const picked = weightedPick(candidates, weightValues, seed);

  // 3. 根据用户回答覆盖风水盘点
  const checks = applyAnswersToChecks(picked.fengshuiChecks, answers);

  // 4. 生成回答感知的观察句
  const observations = buildAnswerObservations(answers);

  // 5. 基础解读模板
  const templateIndex = Math.floor(
    pseudoRandom(seed + 7) * picked.interpretationTemplates.length,
  );
  const spaceLabel = getSpaceLabel(spaceType);
  const baseInterpretation = picked.interpretationTemplates[templateIndex].replace(
    /{空间}/g,
    spaceLabel,
  );

  // 6. 组合观察句 + 基础解读
  const interpretation =
    observations.length > 0
      ? observations.join(" ") + " " + baseInterpretation
      : baseInterpretation;

  // 7. 深度解析内容（仅在 deep 模式下生成）
  const layoutReading: LayoutReading | undefined =
    depth === "deep" && deepAnswers
      ? buildLayoutReading(deepAnswers)
      : undefined;
  const kanyuSituation: string | undefined =
    depth === "deep" && deepAnswers
      ? buildKanyuSituation(deepAnswers, picked)
      : undefined;
  const kanyuBasis: KanyuBasisItem[] | undefined =
    depth === "deep" && deepAnswers
      ? buildKanyuBasis(deepAnswers, basicAnswers ?? { spaceType, mainConcern: [], riskFeature: [] })
      : undefined;
  const keyPositionTips: KeyPositionTip[] | undefined =
    depth === "deep" && deepAnswers
      ? buildKeyPositionTips(deepAnswers)
      : undefined;
  const fengshuiBasis = buildFengshuiBasis(normalizedBasic, depth === "deep" ? deepAnswers : undefined);
  const riskScore = calculateRiskScore(normalizedBasic, fengshuiBasis, depth === "deep" ? deepAnswers : undefined);
  const riskLevel = getRiskLevel(riskScore);
  const rentalVerdict = buildRentalVerdict(mode, riskLevel);
  const affectedLuck = buildAffectedLuck(normalizedBasic, fengshuiBasis);
  const followUpChecklist = buildFollowUpChecklist(mode, fengshuiBasis);

  return {
    id: picked.id,
    imageUrl,
    spaceType,
    answers: { ...answers },
    rentalMode: mode,
    rentalAnswers: rentalAnswers ? { ...rentalAnswers } : undefined,
    basicAnswers: basicAnswers ? { ...basicAnswers } : undefined,
    deepAnswers: deepAnswers ? { ...deepAnswers } : undefined,
    analysisDepth: depth,
    rentalVerdict,
    riskLevel,
    affectedLuck,
    fengshuiTitle: picked.fengshuiTitle,
    auraLevel: picked.auraLevel,
    fengshuiTags: [...picked.fengshuiTags],
    fengshuiChecks: checks,
    poem: picked.poem,
    interpretation,
    suitableFor: [...picked.suitableFor],
    suggestions: [...picked.suggestions],
    followUpChecklist,
    fengshuiBasis,
    layoutReading,
    kanyuSituation,
    kanyuBasis,
    keyPositionTips,
  };
}

export const buildRentalFengshuiReport = buildSpaceFengshuiResult;
