import { signPoems, type SignPoem } from "../data/signPoems";

interface MatchInput {
  hexagram?: string;
  questionType?: string;
  tendency: string;
  scene: string;
}

export type MatchLevel =
  | "hexagram+tendency+scene"
  | "questionType+tendency+scene"
  | "questionType+tendency"
  | "tendency+scene"
  | "tendency"
  | "general_fallback";

export interface MatchResult {
  poem: string;
  meaning: string;
  signPoemId?: string;
  signPoemQuestionType?: string;
  signPoemScene?: string;
  signPoemTendency?: string;
  matchLevel: MatchLevel;
}

/**
 * 按优先级匹配签诗：
 * 1. hexagram + tendency + scene（精确匹配）
 * 2. questionType + tendency + scene
 * 3. questionType + tendency
 * 4. tendency + scene
 * 5. tendency + 通用（scene = "通用"）
 * 6. 任意通用签诗 fallback
 *
 * 约束：如果 requestedQuestionType 不是 playful_fortune，不允许返回 playful_fortune 的签诗。
 */
export function selectSignPoem(input: MatchInput): MatchResult {
  const { hexagram, questionType, tendency, scene } = input;

  const isPlayfulRequest = questionType === "playful_fortune";

  // 场景守卫：如果 questionType=playful_fortune 但 scene=工作，这是可疑组合
  // playful_fortune 签诗没有 scene="工作"，跳过 questionType 匹配，避免误选桃花签
  const SUSPICIOUS_PLAYFUL_SCENES = ["工作"];
  const isSuspiciousPlayful =
    questionType === "playful_fortune" && SUSPICIOUS_PLAYFUL_SCENES.includes(scene);

  if (isSuspiciousPlayful) {
    console.warn("[SignPoem Guard] workplace question tagged as playful_fortune, skipping playful poems", {
      questionType,
      scene,
    });
  }

  function toResult(p: SignPoem, level: MatchLevel): MatchResult {
    // 如果请求的不是 playful_fortune，但匹配到 playful_fortune 签诗，发出警告
    if (!isPlayfulRequest && p.questionType === "playful_fortune") {
      console.warn("[SignPoem Mismatch]", {
        requestedQuestionType: questionType,
        returnedQuestionType: p.questionType,
        selectedPoem: p,
      });
      // 不返回此签诗，继续往下找
      return null as unknown as MatchResult;
    }

    return {
      poem: p.poem,
      meaning: p.meaning,
      signPoemId: p.id,
      signPoemQuestionType: p.questionType,
      signPoemScene: p.scene,
      signPoemTendency: p.tendency,
      matchLevel: level,
    };
  }

  // Level 1: hexagram + tendency + scene
  if (hexagram) {
    const match = findOne({ hexagram, tendency, scene });
    if (match) {
      const r = toResult(match, "hexagram+tendency+scene");
      if (r) return r;
    }
  }

  // Level 2-3: questionType 匹配（可疑组合时跳过，防止误选桃花签）
  if (questionType && !isSuspiciousPlayful) {
    // Level 2: questionType + tendency + scene
    let match = findOne({ questionType, tendency, scene });
    if (match) {
      const r = toResult(match, "questionType+tendency+scene");
      if (r) return r;
    }

    // Level 3: questionType + tendency
    match = findOne({ questionType, tendency });
    if (match) {
      const r = toResult(match, "questionType+tendency");
      if (r) return r;
    }
  }

  // Level 4: tendency + scene
  let match = findOne({ tendency, scene });
  if (match) {
    const r = toResult(match, "tendency+scene");
    if (r) return r;
  }

  // Level 5: tendency + 通用
  match = findOne({ tendency, scene: "通用" });
  if (match) {
    const r = toResult(match, "tendency");
    if (r) return r;
  }

  // Level 6: 任意通用签诗（非 playful_fortune）
  match = findOne({ scene: "通用" });
  if (match) {
    const r = toResult(match, "general_fallback");
    if (r) return r;
  }

  // 终极 fallback
  return {
    poem: "世事如棋局局新，\n静心再看自分明。",
    meaning: "保持平常心，静观其变。",
    signPoemId: "fallback_hardcoded",
    signPoemQuestionType: "general",
    matchLevel: "general_fallback" as MatchLevel,
  };
}

function findOne(filters: Partial<SignPoem>): SignPoem | undefined {
  return signPoems.find((p) => {
    for (const key of Object.keys(filters) as (keyof SignPoem)[]) {
      if (p[key] !== filters[key]) return false;
    }
    return true;
  });
}
