import type { SpaceFengshuiResult } from "../data/spaceFengshuiReadings";
import { RefreshCw, Upload, ChevronRight, Compass } from "lucide-react";
import { useState } from "react";

interface SpaceResultSheetProps {
  open: boolean;
  result: SpaceFengshuiResult;
  onClose: () => void;
  onRetry: () => void;
  onReset: () => void;
  onDeepAnalyze?: () => void;
  deepLoading?: boolean;
}

/* ==================== 外层样式 ==================== */

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(60, 30, 25, 0.28)",
  zIndex: 200,
};

const sheetStyle: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: 0,
  width: "100%",
  maxWidth: 430,
  maxHeight: "calc(100vh - 88px)",
  overflowY: "auto",
  background: "#FFF8F3",
  borderRadius: "28px 28px 0 0",
  padding: 16,
  boxSizing: "border-box",
  boxShadow: "0 -16px 36px rgba(120, 72, 60, 0.18)",
  zIndex: 201,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#8B3A32",
  letterSpacing: 1,
  marginBottom: 10,
};

const tagStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  background: "rgba(217,90,78,0.08)",
  color: "#8B3A32",
  border: "1px solid rgba(217,90,78,0.15)",
  marginRight: 6,
  marginBottom: 6,
};

interface TuningAdvice {
  title: string;
  body: string;
}

interface EvidenceGroupProps {
  index: string;
  title: string;
  children: React.ReactNode;
}

const token = (name: string, fallback: string) => `var(${name}, ${fallback})`;

const compactSectionStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.46)",
  border: `1px solid ${token("--niuma-border", "#EAC8BC")}`,
  borderRadius: 18,
  padding: "12px 14px",
  marginBottom: 10,
};

const compactTitleStyle: React.CSSProperties = {
  ...sectionTitle,
  margin: "0 0 8px",
};

function getVerdictText(result: SpaceFengshuiResult): string {
  if (result.riskLevel === "低风险") return "可租";
  if (result.riskLevel === "高风险") return "不可租";
  return "慎租";
}

function getRiskText(result: SpaceFengshuiResult): string {
  if (result.riskLevel === "低风险") return "低风险";
  if (result.riskLevel === "高风险" || result.riskLevel === "偏高风险") return "高风险";
  return "中风险";
}

function hasIssue(result: SpaceFengshuiResult, words: string[]): boolean {
  const source = [
    result.id,
    result.fengshuiTitle,
    ...result.fengshuiTags,
    ...result.fengshuiChecks.flatMap((c) => [c.name, c.status]),
    ...(result.basicAnswers?.mainConcern ?? []),
    ...(result.basicAnswers?.riskFeature ?? []),
    ...(result.deepAnswers?.facingTarget ?? []),
    result.deepAnswers?.backSupport ?? "",
    result.deepAnswers?.doorWindowRelation ?? "",
    ...result.fengshuiBasis.formBasis.flatMap((b) => [b.issue, b.evidence, b.traditionalReason, b.remedy]),
    result.kanyuSituation ?? "",
  ].join("、");

  return words.some((word) => source.includes(word));
}

function buildSummaryJudgment(result: SpaceFengshuiResult): string {
  if (hasIssue(result, ["光气不足", "太阴暗", "火虚", "偏暗"])) {
    return "光气不足，火气偏弱，整体可住，先补明堂阳气。";
  }
  if (hasIssue(result, ["门冲", "门窗相对"])) {
    return "气口直冲，动气偏急，需先缓冲门口动线。";
  }
  if (hasIssue(result, ["潮湿", "厕气", "卫生间"])) {
    return "湿浊偏重，气口不清，需先除湿净气。";
  }
  if (hasIssue(result, ["梁压", "压顶", "压迫"])) {
    return "土气压顶，心气受束，先减压再安身。";
  }
  if (result.riskLevel === "低风险") {
    return "局不凶，气感尚可，可安身但仍需聚气。";
  }
  return "局势有扰，硬伤不重，先调明堂与气口。";
}

function buildFengshuiReport(result: SpaceFengshuiResult): string {
  if (hasIssue(result, ["光气不足", "太阴暗", "火虚", "偏暗"])) {
    return "此屋硬伤不重，但光气偏弱、明堂偏暗，阳气难起。久住易困、易拖、精神发蔫。对牛马来说，可安身，但不能放任它继续暗下去。";
  }
  if (hasIssue(result, ["门冲", "门窗相对"])) {
    return "此局气口偏急，来气直冲久停之位，气难慢聚。若不先缓动线，久住易心神不定、睡不沉。局不必凶，但门口要先收气。";
  }
  if (hasIssue(result, ["镜子", "镜照"])) {
    return "镜面反照久停之处，反光扰神，夜间尤不宜直照床桌。此屋可调，但镜煞不宜放任，先遮后移，气才安。";
  }
  if (hasIssue(result, ["潮湿", "厕气", "卫生间"])) {
    return "此屋湿浊之气偏近，水重则气沉，久住易困顿、发闷。若能控湿、净气、稳通风，可住；若返潮严重，则不宜硬扛。";
  }
  if (hasIssue(result, ["梁压", "压顶", "压迫"])) {
    return "土气压顶，明堂受束，人在局中容易心气不舒。此局不宜堆重物、硬扛任务，先减压迫，再让气场舒展开。";
  }
  return "此屋形势未见大凶，明堂与气口尚可取用。可安身，但气不宜散，床桌与动线先稳住，日常状态才不容易被拖低。";
}

function buildFengshuiChips(result: SpaceFengshuiResult): string[] {
  const chips: string[] = [];
  const add = (chip: string) => {
    if (chip.length >= 4 && chip.length <= 6 && !chips.includes(chip)) chips.push(chip);
  };

  if (hasIssue(result, ["光气不足", "太阴暗", "火虚", "偏暗"])) {
    add("光气不足");
    add("火气偏弱");
    add("明堂偏暗");
  }
  if (hasIssue(result, ["杂物", "明堂受堵", "有点乱"])) add("明堂受压");
  if (hasIssue(result, ["门冲", "门窗相对", "气口"])) add("气口不畅");
  if (hasIssue(result, ["潮湿", "厕气", "卫生间"])) add("阴湿偏重");
  if (hasIssue(result, ["镜子", "镜照"])) add("镜照扰神");
  if (hasIssue(result, ["梁压", "压顶", "压迫"])) add("土气压顶");
  if (hasIssue(result, ["背后无靠", "空的", "走道"])) add("靠山偏虚");
  if (hasIssue(result, ["动线"])) add("动线尚可");

  result.fengshuiTags.forEach(add);
  result.fengshuiChecks.forEach((check) => {
    if (check.name === "光气" && check.level !== "good") add("光气不足");
    if (check.name === "明堂" && check.level !== "good") add("明堂受压");
    if (check.name === "气口" && check.level !== "good") add("气口不畅");
    if (check.name === "动线" && check.level === "neutral") add("动线尚可");
  });

  ["光气不足", "明堂受压", "气口不畅", "动线尚可", "局不凶"].forEach(add);
  return chips.slice(0, 5);
}

function buildShallowChips(result: SpaceFengshuiResult): string[] {
  const chips = buildFengshuiChips(result).filter((chip) => chip !== "局不凶");
  return chips.slice(0, 4);
}

function buildShallowTitle(result: SpaceFengshuiResult): string {
  if (result.riskLevel === "低风险") return "浅度风水勘察 —— 初步可住";
  if (result.riskLevel === "高风险" || result.riskLevel === "偏高风险") return "浅度风水勘察 —— 暂不建议";
  return "浅度风水勘察 —— 建议复看";
}

function buildShallowJudgment(result: SpaceFengshuiResult): string {
  if (hasIssue(result, ["梁压", "压顶", "门冲", "镜子", "卫生间", "潮湿"])) {
    return "初步看有形势疑点，建议补充门、窗、床、桌关系。";
  }
  if (hasIssue(result, ["光气不足", "太阴暗", "火虚", "偏暗"])) {
    return "光气略弱，暂未见明显硬伤。";
  }
  if (hasIssue(result, ["杂物", "明堂受堵", "有点乱"])) {
    return "明堂略堵，暂未见明显硬伤。";
  }
  return "初步看气感尚可，仍建议补充细节复看。";
}

function buildShallowActions(result: SpaceFengshuiResult): string[] {
  const actions: string[] = [];
  const add = (item: string) => {
    if (!actions.includes(item)) actions.push(item);
  };

  if (hasIssue(result, ["光气不足", "太阴暗", "火虚", "偏暗"])) add("先补一盏稳定暖光");
  if (hasIssue(result, ["杂物", "明堂受堵", "有点乱"])) add("桌前清出明堂区域");
  if (hasIssue(result, ["潮湿", "厕气", "卫生间", "太吵"])) add("晚上再看一次噪音与潮湿");
  if (hasIssue(result, ["门冲", "门窗相对", "气口"])) add("门口到窗边先别堆大件");
  if (hasIssue(result, ["梁压", "压顶", "压迫"])) add("床头上方先别放重物");

  ["先补一盏稳定暖光", "桌前清出明堂区域", "晚上再看一次噪音与潮湿"].forEach(add);
  return actions.slice(0, 3);
}

function buildTuningAdvices(result: SpaceFengshuiResult): TuningAdvice[] {
  const advices: TuningAdvice[] = [];
  const add = (advice: TuningAdvice) => {
    if (!advices.some((item) => item.title === advice.title)) advices.push(advice);
  };

  if (hasIssue(result, ["光气不足", "太阴暗", "火虚", "偏暗"])) {
    add({
      title: "书桌左前方放暖光台灯",
      body: "在书桌左前方或房间明堂处放一盏 3000K-3500K 暖光台灯，照亮桌前和入门可见区域，用来补火、提明堂。不要直射床头。",
    });
  }
  if (hasIssue(result, ["杂物", "明堂受堵", "有点乱"])) {
    add({
      title: "桌前一臂范围清出明堂",
      body: "书桌前方一臂范围内不要堆快递盒、杂纸、脏衣物，尽量留白。桌前开阔，气才有地方展开，人也不容易发闷。",
    });
  }
  if (hasIssue(result, ["气口", "门窗相对", "通风", "门冲"])) {
    add({
      title: "门口到窗边留出气路",
      body: "门后和窗边不要堆大箱子或落地杂物，早晚固定开窗 10-15 分钟，让气口能进能出。不要用高柜堵住门窗直线。",
    });
  }
  if (hasIssue(result, ["潮湿", "厕气", "卫生间"])) {
    add({
      title: "潮湿角落放除湿袋",
      body: "床底和墙角不要堆纸箱，卫生间门常关，在潮湿角落放除湿袋或小型除湿机，用来化水浊。湿衣物不要堆墙角。",
    });
  }
  if (hasIssue(result, ["镜子", "镜照"])) {
    add({
      title: "夜间用布遮住镜面",
      body: "把镜子移到不正对床和书桌的位置；暂时移不开时，夜间用浅色布遮镜，减少反射扰气。不要让镜面直照床头。",
    });
  }
  if (hasIssue(result, ["梁压", "压顶", "压迫"])) {
    add({
      title: "床头避梁并加软靠",
      body: "床头尽量避开梁下和重物下方；不能移动时，用床头软靠、暖光和浅色布艺缓压。床头上方不要再放重物。",
    });
  }
  if (hasIssue(result, ["门冲", "门直冲"])) {
    add({
      title: "门口直线加一层缓冲",
      body: "若门直冲床头或座位，在门口动线上放小地毯、矮柜或布帘缓气。桌椅尽量避开门口直线，不让动气直冲人。",
    });
  }
  if (hasIssue(result, ["火虚", "缺木", "光气不足", "阳气偏弱"])) {
    add({
      title: "窗边或东南位放阔叶绿植",
      body: "靠窗或东南位放一盆小型阔叶植物，如绿萝、圆叶椒草、金钱树。以木生火，缓解火弱和空间发蔫感。不要用带刺植物。",
    });
  }

  [
    {
      title: "书桌左前方放暖光台灯",
      body: "在书桌左前方或房间明堂处放一盏 3000K-3500K 暖光台灯，照亮桌前和入门可见区域，用来补火、提明堂。不要直射床头。",
    },
    {
      title: "桌前一臂范围清出明堂",
      body: "书桌前方一臂范围内不要堆快递盒、杂纸、脏衣物，尽量留白。桌前开阔，气才有地方展开，人也不容易发闷。",
    },
    {
      title: "窗边或东南位放阔叶绿植",
      body: "靠窗或东南位放一盆小型阔叶植物，如绿萝、圆叶椒草、金钱树。以木生火，缓解火弱和空间发蔫感。不要用带刺植物。",
    },
  ].forEach(add);

  return advices.slice(0, 3);
}

function buildOracle(result: SpaceFengshuiResult): string {
  if (hasIssue(result, ["光气不足", "太阴暗", "火虚", "偏暗"])) {
    return "光弱火虚，人易发蔫；\n明堂一亮，牛马回魂。\n此屋可住，先调气场。";
  }
  if (hasIssue(result, ["门冲", "门窗相对"])) {
    return "门急气冲，心神难松；\n一帘缓过，局势能稳。\n先收其气，再安其身。";
  }
  if (hasIssue(result, ["潮湿", "厕气", "卫生间"])) {
    return "水重气浊，人易困顿；\n湿处一清，心火自生。\n可住可调，忌拖忌闷。";
  }
  return result.poem.split("\n").slice(0, 3).join("\n");
}

function buildEvidenceSituationChips(result: SpaceFengshuiResult): string[] {
  const chips = buildFengshuiChips(result).filter((chip) => chip !== "局不凶");
  if (chips.length < 1 && result.kanyuSituation) {
    result.kanyuSituation.split("\n").forEach((line) => {
      const short = line.split("·")[0]?.trim();
      if (short && short.length <= 6 && !chips.includes(short)) chips.push(short);
    });
  }
  return chips.slice(0, 5);
}

function buildConclusionBasis(result: SpaceFengshuiResult): string {
  const riskText = getRiskText(result);
  const hardIssues = ["梁压", "镜冲", "厕冲", "门冲"];

  if (riskText === "高风险") {
    return "当前已出现门冲、镜照、厕气或压顶等硬伤线索，因此不作低风险判断。建议先确认床桌能否挪位；若关键位置无法避开，长住不宜硬扛。";
  }
  if (riskText === "中风险") {
    return "当前存在气口、靠山或光气上的扰动，但尚未形成必须放弃的硬伤组合，因此定为中风险。先把门口动线、明堂和床桌位置调稳，再决定是否入住。";
  }
  if (hasIssue(result, ["光气不足", "太阴暗", "火虚", "偏暗"])) {
    return "当前未见梁压、镜冲、厕冲、门冲等明显硬伤，因此不作高风险判断。但光气偏弱、明堂不亮，久住易困、易拖，建议先补光、清明堂，再入住观察。";
  }
  return `当前未见${hardIssues.join("、")}等明显硬伤，因此不作高风险判断。主要问题集中在明堂、气口和日常舒适度，按低成本调场处理后再观察即可。`;
}

function EvidenceGroup({ index, title, children }: EvidenceGroupProps) {
  return (
    <section
      style={{
        background: "rgba(255,248,243,0.72)",
        border: `1px solid ${token("--niuma-border", "#EAC8BC")}`,
        borderRadius: 14,
        padding: "10px 11px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: token("--niuma-primaryDark", "#8B3A32"),
          fontSize: 12,
          fontWeight: 900,
          lineHeight: 1.3,
        }}
      >
        {index} {title}
      </p>
      {children}
    </section>
  );
}

/* ==================== 组件 ==================== */

export default function SpaceResultSheet({
  open,
  result,
  onClose,
  onRetry,
  onReset,
  onDeepAnalyze,
  deepLoading = false,
}: SpaceResultSheetProps) {
  const [basisOpen, setBasisOpen] = useState(false);

  if (!open) return null;

  if (result.analysisDepth === "deep") {
    const verdictText = getVerdictText(result);
    const riskText = getRiskText(result);
    const summaryJudgment = buildSummaryJudgment(result);
    const fengshuiReport = buildFengshuiReport(result);
    const fengshuiChips = buildFengshuiChips(result);
    const tuningAdvices = buildTuningAdvices(result);
    const oracle = buildOracle(result);
    const evidenceSituationChips = buildEvidenceSituationChips(result);
    const conclusionBasis = buildConclusionBasis(result);

    return (
      <>
        <div style={overlayStyle} onClick={onClose} />

        <div
          style={{
            ...sheetStyle,
            maxHeight: "calc(100vh - 56px)",
            padding: "12px 14px 14px",
          }}
        >
          <div
            style={{
              width: 42,
              height: 5,
              borderRadius: 999,
              background: "rgba(120, 72, 60, 0.18)",
              margin: "0 auto 10px",
            }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(120,72,60,0.08)",
                border: "none",
                cursor: "pointer",
                fontSize: 19,
                color: token("--niuma-textSub", "#7A6258"),
                lineHeight: 1,
                flexShrink: 0,
              }}
              aria-label="关闭"
            >
              ×
            </button>
          </div>

          <section
            style={{
              background: "linear-gradient(135deg, rgba(217,90,78,0.09), rgba(252,234,228,0.46))",
              border: `1px solid ${token("--niuma-border", "#EAC8BC")}`,
              borderRadius: "22px 22px 8px 8px",
              padding: "13px 14px",
              marginBottom: 10,
              boxShadow: "0 8px 20px rgba(120, 72, 60, 0.10)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: token("--niuma-primaryDark", "#8B3A32"),
                fontSize: 15,
                fontWeight: 900,
                lineHeight: 1.35,
              }}
            >
              深度堪舆结论 —— {verdictText}（{riskText}）
            </p>
            <p
              style={{
                margin: "8px 0 0",
                color: token("--niuma-textSub", "#7A6258"),
                fontSize: 13,
                lineHeight: 1.55,
                fontWeight: 600,
              }}
            >
              {summaryJudgment}
            </p>
          </section>

          <section style={compactSectionStyle}>
            <p style={compactTitleStyle}>风水总报</p>
            <p style={{ margin: 0, color: token("--niuma-textMain", "#3B2A24"), fontSize: 13, lineHeight: 1.62 }}>
              {fengshuiReport}
            </p>
          </section>

          <section style={compactSectionStyle}>
            <p style={compactTitleStyle}>风水雷点</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {fengshuiChips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: 25,
                    padding: "0 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                    color: token("--niuma-primaryDark", "#8B3A32"),
                    background: "rgba(217,90,78,0.08)",
                    border: "1px solid rgba(217,90,78,0.14)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </section>

          <section
            style={{
              ...compactSectionStyle,
              background: "linear-gradient(135deg, rgba(255,248,243,0.92), rgba(252,234,228,0.54))",
              boxShadow: "0 7px 18px rgba(120, 72, 60, 0.08)",
            }}
          >
            <p style={compactTitleStyle}>低成本调场</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {tuningAdvices.map((advice, index) => (
                <div key={advice.title} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      background: token("--niuma-primary", "#D95A4E"),
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {index + 1}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: "0 0 3px",
                        color: token("--niuma-textMain", "#3B2A24"),
                        fontSize: 13,
                        fontWeight: 900,
                        lineHeight: 1.32,
                      }}
                    >
                      {advice.title}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: token("--niuma-textSub", "#7A6258"),
                        fontSize: 12,
                        lineHeight: 1.5,
                      }}
                    >
                      {advice.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={compactSectionStyle}>
            <p style={compactTitleStyle}>牛马安居签</p>
            <p
              style={{
                margin: 0,
                color: token("--niuma-textMain", "#3B2A24"),
                whiteSpace: "pre-line",
                fontSize: 14,
                lineHeight: 1.65,
                fontWeight: 700,
              }}
            >
              {oracle}
            </p>
          </section>

          <section
            style={{
              marginBottom: 12,
              border: `1px dashed ${token("--niuma-border", "#EAC8BC")}`,
              borderRadius: 16,
              background: "rgba(255,255,255,0.36)",
              padding: "10px 12px",
            }}
          >
            <button
              type="button"
              onClick={() => setBasisOpen((value) => !value)}
              style={{
                cursor: "pointer",
                color: token("--niuma-primaryDark", "#8B3A32"),
                fontSize: 13,
                fontWeight: 800,
                border: "none",
                background: "transparent",
                padding: 0,
                width: "100%",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <span>{basisOpen ? "收起深度堪舆依据" : "展开查看深度堪舆依据"}</span>
              <span style={{ fontSize: 14, flexShrink: 0 }}>{basisOpen ? "▲" : "▼"}</span>
            </button>

            {basisOpen && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                <EvidenceGroup index="①" title="识别到的信息">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px 10px",
                      color: token("--niuma-textSub", "#7A6258"),
                      fontSize: 12,
                      lineHeight: 1.45,
                    }}
                  >
                    <span>正对：{result.layoutReading?.facing ?? "未明确"}</span>
                    <span>背后：{result.layoutReading?.behind ?? "未明确"}</span>
                    <span>门窗：{result.layoutReading?.doorWindow ?? "未明确"}</span>
                    <span>床桌：{result.deepAnswers ? "已补充" : "需补充"}</span>
                    <span>光线：{hasIssue(result, ["光气不足", "太阴暗", "偏暗"]) ? "偏弱" : "待确认"}</span>
                    <span>通风：{hasIssue(result, ["气口", "门窗相对", "通风"]) ? "待确认" : "未明确"}</span>
                  </div>
                </EvidenceGroup>

                <EvidenceGroup index="②" title="推断出的风水局势">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {evidenceSituationChips.map((chip) => (
                      <span
                        key={chip}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          minHeight: 23,
                          padding: "0 9px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          color: token("--niuma-primaryDark", "#8B3A32"),
                          background: "rgba(217,90,78,0.08)",
                          border: "1px solid rgba(217,90,78,0.14)",
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </EvidenceGroup>

                <EvidenceGroup index="③" title="结论依据">
                  <p style={{ margin: 0, color: token("--niuma-textSub", "#7A6258"), fontSize: 12, lineHeight: 1.62 }}>
                    {conclusionBasis}
                  </p>
                </EvidenceGroup>

                <EvidenceGroup index="④" title="未判项目">
                  <p style={{ margin: 0, color: token("--niuma-textSub", "#7A6258"), fontSize: 12, lineHeight: 1.62 }}>
                    外局、路冲、天斩、壁刀、尖角、反弓等外煞暂不强断。飞星与精确方位信息不足，本次以照片形势和问诊结果为主。
                  </p>
                </EvidenceGroup>
              </div>
            )}
          </section>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onReset}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 22,
                fontSize: 14,
                fontWeight: 700,
                border: `1px solid ${token("--niuma-border", "#EAC8BC")}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: token("--niuma-card", "#FFF8F3"),
                color: token("--niuma-textSub", "#7A6258"),
              }}
            >
              <Upload size={15} />
              重新上传
            </button>
            <button
              onClick={onRetry}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 22,
                fontSize: 14,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: `linear-gradient(135deg, ${token("--niuma-primary", "#D95A4E")}, ${token("--niuma-primaryDark", "#8B3A32")})`,
                color: "#fff",
                boxShadow: "0 4px 16px rgba(217,90,78,0.28)",
              }}
            >
              <RefreshCw size={15} />
              再看一次
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />

      <div style={sheetStyle}>
        {/* 拖拽条 */}
        <div
          style={{
            width: 42,
            height: 5,
            borderRadius: 999,
            background: "rgba(120, 72, 60, 0.18)",
            margin: "0 auto 12px",
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(120,72,60,0.08)",
              border: "none",
              cursor: "pointer",
              fontSize: 19,
              color: token("--niuma-textSub", "#7A6258"),
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        <section
          style={{
            background: "linear-gradient(135deg, rgba(217,90,78,0.09), rgba(252,234,228,0.46))",
            border: `1px solid ${token("--niuma-border", "#EAC8BC")}`,
            borderRadius: "22px 22px 8px 8px",
            padding: "14px 14px",
            marginBottom: 10,
            boxShadow: "0 8px 20px rgba(120, 72, 60, 0.10)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: token("--niuma-primaryDark", "#8B3A32"),
              fontSize: 16,
              fontWeight: 900,
              lineHeight: 1.35,
            }}
          >
            {buildShallowTitle(result)}
          </p>
          <p
            style={{
              margin: "8px 0 0",
              color: token("--niuma-textSub", "#7A6258"),
              fontSize: 13,
              lineHeight: 1.5,
              fontWeight: 600,
            }}
          >
            {buildShallowJudgment(result)}
          </p>
        </section>

        <section style={compactSectionStyle}>
          <p style={compactTitleStyle}>初筛雷点</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {buildShallowChips(result).map((chip) => (
              <span key={chip} style={tagStyle}>
                {chip}
              </span>
            ))}
          </div>
        </section>

        <section style={compactSectionStyle}>
          <p style={compactTitleStyle}>先做三件事</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {buildShallowActions(result).map((action, index) => (
              <div key={action} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: token("--niuma-primary", "#D95A4E"),
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                <span style={{ color: token("--niuma-textMain", "#3B2A24"), fontSize: 13, fontWeight: 800, lineHeight: 1.45 }}>
                  {action}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========== 深度解析入口（仅 basic 模式） ========== */}
        {result.analysisDepth === "basic" && onDeepAnalyze && (
          <div style={{ marginBottom: 24 }}>
            <button
              onClick={onDeepAnalyze}
              disabled={deepLoading}
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: 20,
                border: "1px dashed #D95A4E",
                background: "rgba(217,90,78,0.03)",
                cursor: deepLoading ? "default" : "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Compass size={16} style={{ color: "#D95A4E" }} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#8B3A32" }}>
                      {deepLoading ? "正在生成深度堪舆……" : "继续深度堪舆"}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#7A6258", margin: 0 }}>
                    补充门、窗、背后关系，看看有没有更深的堪舆雷点。
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: "#D95A4E", flexShrink: 0 }} />
              </div>
            </button>
          </div>
        )}

        {/* ========== 操作按钮 ========== */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onReset}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 22,
              fontSize: 14,
              fontWeight: 700,
              border: "1px solid #EAC8BC",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "#FFF8F3",
              color: "#7A6258",
            }}
          >
            <Upload size={15} />
            重新上传
          </button>
          <button
            onClick={onRetry}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 22,
              fontSize: 14,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "linear-gradient(135deg, #D95A4E, #B8443A)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(217,90,78,0.28)",
            }}
          >
            <RefreshCw size={15} />
            再看一次
          </button>
        </div>
      </div>
    </>
  );
}
