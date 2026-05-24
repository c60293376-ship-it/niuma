/* ================================================================
   问事一卦 — 题意理解器 / 问题转译器

   不是拦截器。原则：
   - 尽量放行，除非健康/违法/危险/自伤/明显欺骗规避
   - 对娱乐预测、他人看法、关系、学业进度不硬拦
   - 三层：hardRule(block only) → DeepSeek → mock fallback
   ================================================================ */

import type {
  AskQuestionType,
  ClassificationMode,
  AskScene,
  AskQuestionClassification,
} from "../types/ask";

export type AskClassificationType = AskQuestionType;
export type AskMode = ClassificationMode;
export type { AskScene, AskQuestionClassification };

/* ---- 工具 ---- */
function matchAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

/* ================================================================
   第一层：hardRuleClassifier — 只 block 真正危险的事
   ================================================================ */

const HARD_BLOCK_PATTERNS: RegExp[] = [
  // health_risk
  /生病|病症|症状|诊断|得.*病|是不是.*病|病.*怎么/,
  /停药|吃药|药.*[停吃换]|处方/,
  /手术|开刀|住院|要不要.*去医院|会不会.*得病/,
  // legal_risk
  /违法|犯法|合法|法律|判.*[刑罚]|怎么.*伪造|怎么.*逃避.*处罚/,
  /伪造.*[证明请假条]|骗公司|骗学校/,
  // dangerous_or_illicit
  /自杀|自残|伤害.*[自己他人]|怎么.*报复|怎么.*让别人.*倒霉/,
  /怎么躲.*点名|怎么.*作弊|怎么.*抄.*[答案卷]|怎么逃课.*不.*发现/,
  /怎么骗.*[老师导师老板公司]/,
];

function hardRuleClassifier(
  question: string,
  scene: string,
): AskQuestionClassification | null {
  const q = question.trim();
  if (!q) return null;

  if (!matchAny(q, HARD_BLOCK_PATTERNS)) return null;

  let type: AskClassificationType = "dangerous_or_illicit";
  let reason = "这类问题不适合起卦。";
  const suggestions: string[] = [];

  if (/生病|症状|诊断|得.*病|停药|吃药|手术|住院|去医院|会不会.*得病/.test(q)) {
    type = "health_risk";
    reason = "这卦不接健康诊断的单。身体问题请找专业医生判断。";
    suggestions.push(
      "我现在很焦虑，怎么先稳住？",
      "看医生前我该怎么整理症状？",
      "我要不要找人陪我去医院？",
    );
  } else if (/违法|犯法|法律|伪造|逃避.*处罚|骗公司|骗学校/.test(q)) {
    type = "legal_risk";
    reason = "这卦不接违法和规避责任的单，但可以帮你算怎么补救、怎么沟通。";
    suggestions.push(
      "这件事我应该怎么补救？",
      "我要不要主动说明情况？",
      "我该怎么降低后续损失？",
    );
  } else if (/躲.*点名|作弊|抄.*[答案卷]|逃课.*不.*发现|骗.*[老师导师老板公司]/.test(q)) {
    type = "dangerous_or_illicit";
    reason = "这卦不接「规避规则」的单，但可以接「怎么补救」的单。";
    suggestions.push(
      "这次如果缺课/错过，我应该怎么补救？",
      "我要不要提前和老师说明情况？",
      "以后怎么避免这种局面？",
    );
  } else if (/自杀|自残|伤害|报复/.test(q)) {
    type = "dangerous_or_illicit";
    reason = "如果你正在经历困难，请寻求专业帮助或联系信任的人。";
    suggestions.push("现在该不该找个人聊聊？", "最近要不要给自己放个假？");
  }

  return {
    valid: false, mode: "block", type, scene: scene as AskScene || "随问",
    reason, suggestions, source: "hard-rule",
  };
}

/* ================================================================
   主函数
   ================================================================ */

export async function classifyAskQuestion(
  question: string,
  scene: string,
): Promise<AskQuestionClassification> {
  const hardBlock = hardRuleClassifier(question, scene);
  if (hardBlock) return hardBlock;

  let result: AskQuestionClassification;

  try {
    const r = await fetch("/api/classify-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, scene }),
    });
    if (!r.ok) throw new Error(`API ${r.status}`);
    const data = await r.json();
    if (!data.mode) data.mode = data.valid ? "allow" : "block";
    result = { ...data, source: "deepseek" } as AskQuestionClassification;
  } catch (e) {
    console.warn("DeepSeek 不可用，fallback mock：", (e as Error).message);
    result = classifyWithMockRules(question, scene);
  }

  // 统一出口：所有后续起卦、签诗、解卦都只使用这里修正后的 finalClassification。
  result = normalizeClassificationConsistency(question, scene, result);

  return result;
}

/* ================================================================
   一致性修正 guard
   防止 API（DeepSeek）或 mock fallback 在工作运势等明显场景上误判
   ================================================================ */

const WORK_KEYWORDS = /工作|职场|老板|领导|同事|岗位|offer|实习|面试|汇报|公司|上班|绩效|晋升|加班/;

type DomainOverride = {
  type: AskQuestionType;
  scene: AskScene;
  normalizedQuestion: string;
  reason: string;
};

function inferDomainOverride(question: string, selectedScene: string): DomainOverride | null {
  const q = question.trim();
  const scene = selectedScene as AskScene;

  // 工作/职场优先于泛化“好运/运势”，防止抽到桃花签。
  if (
    WORK_KEYWORDS.test(q) &&
    (/运势|运气|气场|状态|怎么样|如何|顺不顺|顺利/.test(q) || scene === "工作")
  ) {
    return {
      type: "workplace_dynamic",
      scene: "工作",
      normalizedQuestion: "今日职场运势与工作状态如何？",
      reason: "工作/职场问题统一归入职场态势。",
    };
  }

  if (/老板|领导|上司|同事/.test(q) && /态度|怎么看|看我|想我|喜欢|欣赏|满意|关系/.test(q)) {
    return {
      type: "workplace_dynamic",
      scene: "工作",
      normalizedQuestion: "我和对方之间的职场相处态势如何？",
      reason: "老板/领导/同事态度归入职场态势。",
    };
  }

  if (/老师|导师|教授|助教/.test(q) && /态度|怎么看|看我|要求|喜欢|欣赏|满意|关系/.test(q)) {
    return {
      type: "person_attitude",
      scene: "学业",
      normalizedQuestion: "我和老师之间的相处态势如何？",
      reason: "老师态度归入他人态度。",
    };
  }

  if (/作业|论文|课程|考试|成绩|分数|得分|高分|满分|绩点|GPA/i.test(q)) {
    return {
      type: "study_school",
      scene: "学业",
      normalizedQuestion: /作业|论文|得分|高分|满分|分数/.test(q)
        ? "这份作业的得分走势如何？"
        : "近期学业与课程表现走势如何？",
      reason: "作业得分/课程成绩归入学业。",
    };
  }

  if (/桃花|帅哥|美女|脱单|暧昧|心动|约会|遇到|碰到|艳遇|缘分/.test(q)) {
    return {
      type: "playful_fortune",
      scene: "感情",
      normalizedQuestion: "近期桃花与社交缘分走势如何？",
      reason: "桃花/帅哥/美女问题归入娱乐桃花。",
    };
  }

  if (/天气|下雨|下雪|刮风|温度|降温|带伞|出门|出行|通勤|赶路|路上|航班|高铁|堵车/.test(q)) {
    return {
      type: "weather_travel",
      scene: "随问",
      normalizedQuestion: "出行天气与安排走势如何？",
      reason: "天气/出行问题归入出行天气。",
    };
  }

  if (/财运|财气|搞钱|赚钱|收入|进财|破财|发财|暴富|奖金|工资|副业|投资|回款/.test(q)) {
    return {
      type: "wealth_luck",
      scene: "随问",
      normalizedQuestion: "今日财运走势如何？",
      reason: "财运/搞钱问题归入财运。",
    };
  }

  return null;
}

function normalizeClassificationConsistency(
  question: string,
  selectedScene: string,
  classification: AskQuestionClassification,
): AskQuestionClassification {
  const override = inferDomainOverride(question, selectedScene);

  if (override && classification.type !== override.type) {
    console.warn("[Domain Override] forced finalQuestionType", {
      originalType: classification.type,
      finalType: override.type,
      question: question.slice(0, 40),
    });
    return {
      ...classification,
      type: override.type,
      scene: override.scene,
      normalizedQuestion: override.normalizedQuestion,
      reason: override.reason,
    };
  }

  if (override) {
    return {
      ...classification,
      scene: override.scene,
      normalizedQuestion: classification.normalizedQuestion || override.normalizedQuestion,
      reason: classification.reason || override.reason,
    };
  }

  return classification;
}

/* ================================================================
   第三层：完整 mock fallback
   尽量放行，block 只留给 hardRule 已覆盖的类型
   ================================================================ */

function inferScene(q: string, cur: string): AskScene {
  if (/感情|恋爱|喜欢|男朋友|女朋友|分手|复合|相亲|约会|桃花|结婚|关系/.test(q)) return "感情";
  if (/学业|考试|课程|导师|论文|毕业|学习|复习|选课|上课|逃课|缺课|点名/.test(q)) return "学业";
  if (/工作|辞职|跳槽|offer|面试|岗位|实习|老板|领导|同事|上班|职场/i.test(q)) return "工作";
  if (/人际|朋友|联系|发消息|催|解释|道歉|相处|室友|社交/.test(q)) return "人际";
  if (/选|还是|或者|取舍/.test(q)) return "选择";
  if (cur !== "随问") return cur as AskScene;
  return "随问";
}

function norm(q: string, t: AskClassificationType): string | undefined {
  // —— 转成占问主题，而非行动建议 ——
  // 工作运势 / 职场 → 优先 workplace_dynamic
  if (/工作.*[运势气]|[运势气].*工作|职场.*[运势气]|[运势气].*职场/.test(q)) return "今日职场运势与工作状态如何？";
  // 工作通用
  if (t === "workplace_dynamic" && /工作|职场|汇报/.test(q)) return "今日职场运势与工作状态如何？";
  // 桃花
  if (/帅哥|美女|碰到|遇到|桃花/.test(q)) return "下午出门桃花运如何？";
  // 财运
  if (/暴富|发财|财运|搞钱/.test(q)) return "今日财运走势如何？";
  if (/运气|好运|眷顾|幸运/.test(q)) return "今日整体运势如何？";
  // 婚恋
  if (/结婚/.test(q)) return "这段关系近期婚恋推进如何？";
  // 作业/得分
  if (/作业.*[分得高]|论文.*[分满意]|得分|能不能.*高分|会不会.*高分/.test(q)) return "这份作业的得分走势如何？";
  // 天气/出行
  if (/天气|下雨|带伞|出行.*[顺怎么样]/.test(q)) return "下午出行天气与安排如何？";
  // 他人态度
  if (/老板.*[看对].*我|领导.*[看对].*我/.test(q)) return "我和老板之间的职场相处态势如何？";
  if (/老师.*[看对人].*[我样]|老师.*态度|老师.*要求/.test(q)) return "我和老师之间的相处态势如何？";
  // 学业
  if (/毕业|什么时候.*[毕过]/.test(q)) return "我的学业进度与毕业时机如何？";
  if (/逃课|缺课|不去上课|这节课.*不.*去/.test(q)) return "这次缺课对学业影响如何？";
  if (/迟交|作业.*影响|影响.*大/.test(q)) return "这次迟交作业影响多大？";
  // 关系
  if (/他.*会.*想.*我|他.*还.*[会来].*我/.test(q)) return "对方近期会不会主动联系？";
  if (/关系.*有没有戏|还.*有没有戏|关系.*怎么样/.test(q)) return "这段关系近期的态势如何？";
  if (/等.*他|要不要.*等/.test(q)) return "是否值得继续等待？";
  return undefined;
}

// ——— 各类型匹配 ———

const PATTERNS: Array<{
  patterns: RegExp[];
  type: AskClassificationType;
  mode: AskMode;
}> = [
  // work_opportunity
  { patterns: [/offer.*[接拒选]|[接拒选].*offer|offer/i, /面试.*[去不去]|要不要.*面试/, /岗位.*[选挑]|[选挑].*岗位/, /工作机会/], type: "work_opportunity", mode: "allow" },
  // workplace_dynamic — 职场态势（必须在 playful_fortune 之前匹配工作运势等）
  { patterns: [/工作.*[运势气]|[运势气].*工作|职场.*[运势气]|[运势气].*职场/, /工作.*怎么.*样|工作.*如何/, /职场.*怎么.*样|职场.*如何/, /汇报.*[怎么如何]|怎么.*汇报|如何.*汇报/, /同事.*[关相处]|和同事|跟同事/], type: "workplace_dynamic", mode: "playful_reframe" },
  { patterns: [/老板.*[看对想].*我|领导.*[看对想喜].*我|上司.*[看对].*我/, /老板.*态度|领导.*态度|上司.*态度/, /领导.*喜欢.*我|老板.*喜欢.*我|上司.*欣赏.*我/, /同事.*[看对].*我|职场.*关系/], type: "workplace_dynamic", mode: "playful_reframe" },
  // person_attitude
  { patterns: [/老师.*[看对人].*[我样]|老师.*态度|老师.*[喜不喜欢欣不欣赏].*我/, /导师.*[看对人].*我|导师.*态度/, /他.*是不是.*[对看].*我|她.*是不是.*[对看].*我/, /对方.*[对看].*我|这人.*怎么.*[看我]/], type: "person_attitude", mode: "playful_reframe" },
  // course_absence
  { patterns: [/[逃翘旷缺].*课.*[影响会样]|逃了.*[影响怎么样会]|不去上课.*[影响怎么样会]|这节课.*[逃翘缺不去]/, /缺.*[课次].*影响|不去上.*[影响怎么样]/, /迟交.*影响|作业.*晚.*[交提].*影响|作业.*没.*[交做].*影响/], type: "course_absence", mode: "playful_reframe" },
  // study_school
  { patterns: [/作业.*[分得高获]|论文.*[分满意]|能不能.*[得高分拿高分]|会不会.*高分|得分|分数.*怎么样|老师.*满意.*[作业论文]|课程.*[分过]/, /老师.*要求|这门课.*[要求难]|课程.*要求/, /论文.*[写进展]|答辩.*[时间怎么]|毕业.*[设计论文]/, /考试|备考|复习|考题|模考/, /学习|自习|学术/], type: "study_school", mode: "playful_reframe" },
  // future_timing
  { patterns: [/什么时候.*[毕过结离拿]|多久.*[能可以会]/, /毕业.*[时间日期]|几月.*[毕过]/, /能.*毕业|会.*毕业|能不能.*毕业/, /结婚.*什么时候|什么时候.*结婚|后天.*结婚|明天.*结婚/], type: "future_timing", mode: "playful_reframe" },
  // wealth_luck
  { patterns: [/财运|财气|搞钱|进财|破财|能不能.*暴富|能不能.*发财|赚钱|收入/, /今天.*财|最近.*财|今年.*财/], type: "wealth_luck", mode: "playful_reframe" },
  // weather_travel
  { patterns: [/天气.*怎么样|天气.*如何|出门.*顺不顺|出行.*[顺怎么样]|下午.*[天天气]|今天.*[天天气]/, /下雨|下雪|带伞|适不适合出门|出门.*[怎么样]/], type: "weather_travel", mode: "playful_reframe" },
  // playful_fortune
  { patterns: [/会不会.*[碰上遇见到有来去撞]|会不会.*桃花|会不会.*帅哥|会不会.*美女/, /今天.*[运气好运桃花幸运]|今天.*被.*眷顾|今天.*顺利/, /桃花运|桃花.*怎么样|有没有.*桃花/, /命运.*眷顾|好运.*[来降临到]/], type: "playful_fortune", mode: "playful_reframe" },
  // relationship_dynamic
  { patterns: [/这段.*关系|关系.*[走势态势有没有戏]|我们.*[最近现在].*[怎么样好不好]/, /他.*会.*想.*我|他.*还.*[会来].*我/, /要不要.*等.*[他她]|该不该.*等/, /分手|复合|还会.*[来找回]/, /关系.*继续|有没有.*未来/], type: "relationship_dynamic", mode: "playful_reframe" },
  // project_deadline
  { patterns: [/黑客松|hackathon/i, /项目.*能不能|项目.*成不成/, /DDL|ddl|deadline/i, /截止/, /来不来得及|赶不赶得上/, /交付|demo.*展示|展示.*demo/i, /今晚.*[做写完成交]|一天.*[做完成]/, /能不能成|能不能做完|能不能完成/, /项目/, /作业/], type: "project_deadline", mode: "allow" },
  // communication
  { patterns: [/联系|发消息|发微信|打电话|发信息|找.*[他她]|主动找/, /催.*[回消息回复]|要不要催|该不该催/, /解释|道歉|要不要.*说|该不该.*说/, /要不要.*问|该不该.*问|怎么.*问/, /回复.*怎么|怎么.*回复|回.*消息/], type: "communication", mode: "allow" },
  // emotion_reset
  { patterns: [/烦|焦虑|内耗|心累|纠结.*放|放.*纠结/, /放下|想不开|走不出来|翻篇/, /要不要.*[忘放断]|该不该.*[忘放断]/, /累了|撑不住|受不了|崩溃|情绪/], type: "emotion_reset", mode: "allow" },
  // choice_tradeoff
  { patterns: [/实习/, /暑假/, /选课|选.*课|要不要.*课/, /假期.*做|假期.*去/], type: "choice_tradeoff", mode: "allow" },
  // action_decision (兜底)
  { patterns: [/应不应该|该不该|要不要|适不适合/, /值不值得|能不能|合不合适/, /怎么做|怎么办|怎么.*[选做决定]/], type: "action_decision", mode: "allow" },
];

function classifyWithMockRules(
  question: string,
  scene: string,
): AskQuestionClassification {
  const q = question.trim();
  const ds: AskScene = (scene as AskScene) || "随问";

  if (!q) {
    return { valid: false, mode: "block", type: "unclear", scene: ds, reason: "问题不能为空。", suggestions: [], source: "mock-fallback" };
  }

  for (const { patterns, type, mode } of PATTERNS) {
    if (matchAny(q, patterns)) {
      const normalized = norm(q, type);
      const result: AskQuestionClassification = {
        valid: true, mode, type, scene: inferScene(q, ds),
        originalQuestion: q,
        normalizedQuestion: normalized || undefined,
        reason: mode === "playful_reframe" ? "此问题转为娱乐向解签，不直接断定事实。" : undefined,
        suggestions: [],
        source: "mock-fallback",
      };

      console.log("[Ask Debug - Classification]", {
        sessionId: "mock-fallback",
        originalQuestion: q,
        selectedScene: result.scene,
        rawClassification: { type, mode },
        finalClassification: result,
      });

      return result;
    }
  }

  // 未命中 → 默认放行
  return {
    valid: true, mode: "allow", type: "action_decision", scene: ds,
    reason: "未识别具体类型，按通用行动决策处理。",
    suggestions: [], source: "mock-fallback",
  };
}
