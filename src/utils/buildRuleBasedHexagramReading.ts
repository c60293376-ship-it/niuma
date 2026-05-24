/* ================================================================
   规则卦象短解 — 基于本卦/变卦/关键词/questionType
   40-70 字 interpretation + 3 条短建议（每条 8-14 字）
   不是 fallback，是卦象基础解读
   ================================================================ */

export interface RuleReadingInput {
  originalQuestion: string;
  normalizedQuestion: string;
  questionType: string;
  scene: string;
  mode: string;
  mainHexagram: string;
  mainHexagramKeywords: string[];
  changedHexagram: string;
  changedHexagramKeywords: string[];
  movingLine: string;
  displayTendency: string;
}

export interface RuleReadingOutput {
  interpretation: string;
  actionAdvice: string[];
}

function kw(kws: string[]): string {
  return kws.length > 0 ? kws.slice(0, 2).join("、") : "卦象";
}

function varKws(main: string[], changed: string[]): string {
  const ck = changed.length > 0 ? changed.slice(0, 1).join("") : "";
  if (!ck) return kw(main);
  return `${kw(main)}，转${ck}`;
}

/* ---- 按 questionType 生成短解 ---- */

export function buildRuleBasedHexagramReading(
  input: RuleReadingInput,
): RuleReadingOutput {
  const {
    mainHexagram,
    mainHexagramKeywords,
    changedHexagram,
    changedHexagramKeywords,
    movingLine,
    displayTendency,
    questionType,
  } = input;

  const mk = kw(mainHexagramKeywords);
  const ck = varKws(mainHexagramKeywords, changedHexagramKeywords);
  const mv = movingLine || "静爻";

  switch (questionType) {
    // ─── weather_travel ───
    case "weather_travel":
      return {
        interpretation: `${mainHexagram}主${mk}，变${changedHexagram}见${ck}。出行有变象，宜备伞看天，留弹性路线。`,
        actionAdvice: ["出门前查实时天气", "带伞或备室内路线", "户外安排别排太死"],
      };

    // ─── playful_fortune ───
    case "playful_fortune":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。气场偏${displayTendency}，露面比脑补有机会，但不包兑现。`,
        actionAdvice: ["去人多舒服的地方", "状态自然别硬凹", "别把期待拉太满"],
      };

    // ─── wealth_luck ───
    case "wealth_luck":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。财气${displayTendency}，宜看成本控支出，别幻想暴富。`,
        actionAdvice: ["先控住冲动花销", "看清成本再投入", "别赌一夜翻身"],
      };

    // ─── communication ───
    case "communication":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。${mv}动，可说但不宜重，轻推比猛催稳。`,
        actionAdvice: ["三句话内说清", "别深夜写小作文", "发完别连环追问"],
      };

    // ─── work_opportunity ───
    case "work_opportunity":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。机会可看，重点在成长成本和边界。`,
        actionAdvice: ["问清薪资职责边界", "看成长是否真实", "别被焦虑推着接"],
      };

    // ─── workplace_dynamic ───
    case "workplace_dynamic":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。此事不宜强行读心，看互动信号比脑补可靠。`,
        actionAdvice: ["看对方具体行为", "先稳住交付表现", "别靠揣测定罪"],
      };

    // ─── person_attitude ───
    case "person_attitude":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。此问不宜替对方表态，看相处态势和信号。`,
        actionAdvice: ["观察具体互动信号", "别靠脑补做判断", "轻量沟通一次即可"],
      };

    // ─── project_deadline ───
    case "project_deadline":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。宜${displayTendency}，先保最小闭环，别求一次完美。`,
        actionAdvice: ["先砍非核心功能", "保住可展示闭环", "细节放到下一版"],
      };

    // ─── course_absence ───
    case "course_absence":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。缺课影响不宜赌，重点在补救和平时分。`,
        actionAdvice: ["确认是否点名记分", "课后补笔记问同学", "有影响就尽早补救"],
      };

    // ─── relationship_dynamic ───
    case "relationship_dynamic":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。关系有气口但未必立刻落地，${displayTendency}。`,
        actionAdvice: ["看对方实际动作", "别只靠脑内剧情", "轻量沟通试一次"],
      };

    // ─── emotion_reset ───
    case "emotion_reset":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。心气偏乱，先把问题拆小，比硬扛有用。`,
        actionAdvice: ["先做一件小事启动", "不在情绪高点决定", "给自己留半天缓冲"],
      };

    // ─── study_school ───
    case "study_school": {
      const isScoring = /作业|得分|高分|论文|分数|成绩/.test(input.originalQuestion);
      if (isScoring) {
        const scoreBase = `${mainHexagram}主${mk}，变见${changedHexagram}。${mv}动，此问看作业质量和规范度。`;
        const scoreMid =
          displayTendency.includes("推进") || displayTendency.includes("缓")
            ? `${scoreBase}结构清楚则分稳，想冲高分需补细节和论证。`
            : displayTendency.includes("守") || displayTendency.includes("待")
              ? `${scoreBase}能稳住基本分，冲高分要看是否贴合评分标准和格式。`
              : displayTendency.includes("止") || displayTendency.includes("砍") || displayTendency.includes("舍")
                ? `${scoreBase}不宜盲目自信，先补重点短板比祈祷老师手松更实际。`
                : `${scoreBase}若材料扎实、格式规范，分数有稳住空间。`;
        return { interpretation: scoreMid, actionAdvice: ["先检查题目要求", "补强论证和例子", "格式细节别丢分"] };
      }
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。学业看${displayTendency}，宜分主次再用力。`,
        actionAdvice: ["理清重点再开动", "不要平均使力气", "把大块拆成小步"],
      };
    }

    // ─── choice_tradeoff ───
    case "choice_tradeoff":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。取舍之间，看长期收益别只看眼前安全感。`,
        actionAdvice: ["列得失看清代价", "别被焦虑推着选", "留一点回旋余地"],
      };

    // ─── future_timing ───
    case "future_timing":
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。不保具体时间，看推进节奏和条件到位。`,
        actionAdvice: ["看现实条件是否齐", "别只盯着日历等", "先做好能做的准备"],
      };

    // ─── action_decision / general ───
    default:
      return {
        interpretation: `${mainHexagram}主${mk}，变见${changedHexagram}。${mv}动，偏向${displayTendency}，先看边界再动。`,
        actionAdvice: ["先确认关键信息", "不要一次压满", "留一点回旋余地"],
      };
  }
}
