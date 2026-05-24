/* ================================================================
   displayTendency — 根据 questionType 转换展示行动倾向
   ================================================================ */

import type { AskQuestionType } from "../types/ask";

const MAP: Record<string, Record<string, string>> = {
  project_deadline: {
    "宜主动推进": "宜小步推进",
    "宜止损": "宜砍范围",
    "宜缓中进": "宜理清结构",
  },
  work_opportunity: {
    "宜止损": "宜审慎取舍",
    "宜主动推进": "宜看清再推",
  },
  choice_tradeoff: {
    "宜止损": "宜审慎取舍",
  },
  communication: {
    "宜缓中进": "宜缓问轻推",
    "宜止损": "宜设边界",
  },
  emotion_reset: {
    "宜止损": "宜先降噪",
    "宜守待机": "宜先稳住",
    "宜主动推进": "宜小步行动",
  },
  study_school: {
    "宜止损": "宜审慎取舍",
  },
  playful_fortune: {
    "宜主动推进": "宜小步行动",
    "宜止损": "宜先降噪",
    "宜守待机": "宜先稳住",
  },
  future_timing: {
    "宜主动推进": "宜小步行动",
    "宜止损": "宜先降噪",
    "宜守待机": "宜先稳住",
  },
  course_absence: {
    "宜主动推进": "宜主动补救",
    "宜止损": "宜审慎取舍",
  },
  person_attitude: {
    "宜止损": "宜先观察",
    "宜主动推进": "宜轻量沟通",
  },
  workplace_dynamic: {
    "宜止损": "宜先观察",
    "宜主动推进": "宜稳中表达",
  },
  relationship_dynamic: {
    "宜止损": "宜先降噪",
    "宜守待机": "宜先稳住",
    "宜主动推进": "宜轻量推进",
  },
  wealth_luck: {
    "宜主动推进": "宜小步行动",
    "宜止损": "宜先降噪",
    "宜守待机": "宜先稳住",
  },
  weather_travel: {
    "宜止损": "宜审慎取舍",
  },
};

export function getDisplayTendency(
  questionType: AskQuestionType,
  rawTendency: string,
): string {
  return MAP[questionType]?.[rawTendency] ?? rawTendency;
}
