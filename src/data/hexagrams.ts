export interface HexagramData {
  binaryId: number;     // 0-63，按六爻阴阳二进制编码（bit0=初爻, bit5=上爻）
  wenwangNo: number;    // 1-64，传统《周易》文王卦序（展示用，不参与成卦计算）
  name: string;
  upper: string;
  lower: string;
  keywords: string[];
  defaultTendency: string;
  briefMeaning: string;
}

/**
 * 标准六十四卦全表
 *
 * key = binaryId（0-63），编码规则：
 * - 阳爻=1, 阴爻=0
 * - bit0 = 初爻（最下）, bit5 = 上爻（最上）
 * - bits 0-2 = 下卦，bits 3-5 = 上卦
 *
 * 八卦 3-bit（下→上）：
 *   坤(000) 震(001) 坎(010) 兑(011) 艮(100) 离(101) 巽(110) 乾(111)
 */

const HEXAGRAM_MAP: Record<number, HexagramData> = {
  /* ══════ 上坤 (000) ══════ */
  0:  { binaryId: 0,  wenwangNo: 2,  name: "坤为地",   upper: "坤", lower: "坤", keywords: ["柔顺","承载","守成"], defaultTendency: "宜守待机", briefMeaning: "厚德载物，顺势守成，不宜强出头。" },
  1:  { binaryId: 1,  wenwangNo: 24, name: "地雷复",   upper: "坤", lower: "震", keywords: ["回复","重启","循环"], defaultTendency: "宜主动推进", briefMeaning: "一阳来复，万象更新，是重启的好时机。" },
  2:  { binaryId: 2,  wenwangNo: 7,  name: "地水师",   upper: "坤", lower: "坎", keywords: ["师众","组织","纪律"], defaultTendency: "宜缓中进", briefMeaning: "行师动众，需有章法，稳扎稳打。" },
  3:  { binaryId: 3,  wenwangNo: 19, name: "地泽临",   upper: "坤", lower: "兑", keywords: ["临近","亲临","观察"], defaultTendency: "宜主动推进", briefMeaning: "事到眼前，亲自审视后即可行动。" },
  4:  { binaryId: 4,  wenwangNo: 15, name: "地山谦",   upper: "坤", lower: "艮", keywords: ["谦逊","低调","自守"], defaultTendency: "宜守待机", briefMeaning: "谦卑自守，不争不抢，以退为进。" },
  5:  { binaryId: 5,  wenwangNo: 36, name: "地火明夷", upper: "坤", lower: "离", keywords: ["晦暗","隐忍","守正"], defaultTendency: "宜守待机", briefMeaning: "光明受损，宜隐忍守正，等待转机。" },
  6:  { binaryId: 6,  wenwangNo: 46, name: "地风升",   upper: "坤", lower: "巽", keywords: ["上升","渐进","积累"], defaultTendency: "宜缓中进", briefMeaning: "循序渐进，积小成大，稳步向上。" },
  7:  { binaryId: 7,  wenwangNo: 11, name: "地天泰",   upper: "坤", lower: "乾", keywords: ["通泰","和谐","顺利"], defaultTendency: "宜主动推进", briefMeaning: "天地交泰，万事亨通，顺势而为。" },

  /* ══════ 上震 (001) ══════ */
  8:  { binaryId: 8,  wenwangNo: 16, name: "雷地豫",   upper: "震", lower: "坤", keywords: ["愉悦","预备","顺势"], defaultTendency: "宜主动推进", briefMeaning: "愉悦和乐，但需提前准备，不可盲目乐观。" },
  9:  { binaryId: 9,  wenwangNo: 51, name: "震为雷",   upper: "震", lower: "震", keywords: ["震动","警觉","反省"], defaultTendency: "宜守待机", briefMeaning: "雷霆震动，令人警觉，宜反省而非妄动。" },
  10: { binaryId: 10, wenwangNo: 40, name: "雷水解",   upper: "震", lower: "坎", keywords: ["解除","释放","转机"], defaultTendency: "宜主动推进", briefMeaning: "困难解除，转机已到，可以放手行动。" },
  11: { binaryId: 11, wenwangNo: 54, name: "雷泽归妹", upper: "震", lower: "兑", keywords: ["结合","归顺","顺势"], defaultTendency: "宜缓中进", briefMeaning: "结合归顺，顺势而行，不可强求。" },
  12: { binaryId: 12, wenwangNo: 62, name: "雷山小过", upper: "震", lower: "艮", keywords: ["小过","调整","收敛"], defaultTendency: "宜改方式", briefMeaning: "小有过越，宜微调收敛，不宜大动干戈。" },
  13: { binaryId: 13, wenwangNo: 55, name: "雷火丰",   upper: "震", lower: "离", keywords: ["丰盛","充盈","分享"], defaultTendency: "宜主动推进", briefMeaning: "丰盛充盈，正是收获和分享的时节。" },
  14: { binaryId: 14, wenwangNo: 32, name: "雷风恒",   upper: "震", lower: "巽", keywords: ["恒久","坚持","稳定"], defaultTendency: "宜缓中进", briefMeaning: "恒久之道在于坚持，不疾不徐方得长久。" },
  15: { binaryId: 15, wenwangNo: 34, name: "雷天大壮", upper: "震", lower: "乾", keywords: ["壮大","强势","克制"], defaultTendency: "宜主动推进", briefMeaning: "声势壮大，但须克制，过刚易折。" },

  /* ══════ 上坎 (010) ══════ */
  16: { binaryId: 16, wenwangNo: 8,  name: "水地比",   upper: "坎", lower: "坤", keywords: ["亲比","依附","联合"], defaultTendency: "宜缓中进", briefMeaning: "亲附联合，找到对的人比单打独斗更稳。" },
  17: { binaryId: 17, wenwangNo: 3,  name: "水雷屯",   upper: "坎", lower: "震", keywords: ["屯难","起始","积累"], defaultTendency: "宜守待机", briefMeaning: "万事开头难，先积累条件，不要急于求成。" },
  18: { binaryId: 18, wenwangNo: 29, name: "坎为水",   upper: "坎", lower: "坎", keywords: ["险陷","沉着","守信"], defaultTendency: "宜守待机", briefMeaning: "险中有险，沉着守信方能渡过。" },
  19: { binaryId: 19, wenwangNo: 60, name: "水泽节",   upper: "坎", lower: "兑", keywords: ["节制","分寸","适度"], defaultTendency: "宜缓中进", briefMeaning: "节制有度，设定边界，不贪多求全。" },
  20: { binaryId: 20, wenwangNo: 39, name: "水山蹇",   upper: "坎", lower: "艮", keywords: ["蹇难","阻滞","求助"], defaultTendency: "宜止损", briefMeaning: "前有险阻，行路艰难，宜换路径或求助。" },
  21: { binaryId: 21, wenwangNo: 63, name: "水火既济", upper: "坎", lower: "离", keywords: ["完成","守成","警惕"], defaultTendency: "宜守待机", briefMeaning: "事已成，但需警惕盛极而衰，守成为上。" },
  22: { binaryId: 22, wenwangNo: 48, name: "水风井",   upper: "坎", lower: "巽", keywords: ["井养","滋养","修德"], defaultTendency: "宜缓中进", briefMeaning: "如井养人，持续滋养，修身以待时机。" },
  23: { binaryId: 23, wenwangNo: 5,  name: "水天需",   upper: "坎", lower: "乾", keywords: ["等待","耐心","准备"], defaultTendency: "宜守待机", briefMeaning: "时机未到，需耐心等待，同时做好准备。" },

  /* ══════ 上兑 (011) ══════ */
  24: { binaryId: 24, wenwangNo: 45, name: "泽地萃",   upper: "兑", lower: "坤", keywords: ["聚集","汇合","团结"], defaultTendency: "宜主动推进", briefMeaning: "精英汇聚，团结一致，适合集体行动。" },
  25: { binaryId: 25, wenwangNo: 17, name: "泽雷随",   upper: "兑", lower: "震", keywords: ["随从","顺势","灵活"], defaultTendency: "宜缓中进", briefMeaning: "随势而动，灵活应变，不强求方向。" },
  26: { binaryId: 26, wenwangNo: 47, name: "泽水困",   upper: "兑", lower: "坎", keywords: ["困境","受限","坚守"], defaultTendency: "宜止损", briefMeaning: "身陷困境，资源受限，守住核心等待转机。" },
  27: { binaryId: 27, wenwangNo: 58, name: "兑为泽",   upper: "兑", lower: "兑", keywords: ["喜悦","沟通","分享"], defaultTendency: "宜主动推进", briefMeaning: "和悦沟通，彼此分享，适合主动交流。" },
  28: { binaryId: 28, wenwangNo: 31, name: "泽山咸",   upper: "兑", lower: "艮", keywords: ["感应","互动","吸引"], defaultTendency: "宜主动推进", briefMeaning: "感应互动，自然吸引，适合表达心意。" },
  29: { binaryId: 29, wenwangNo: 49, name: "泽火革",   upper: "兑", lower: "离", keywords: ["变革","革新","调整"], defaultTendency: "宜改方式", briefMeaning: "变革之时，旧的不去新的不来，宜换策略。" },
  30: { binaryId: 30, wenwangNo: 28, name: "泽风大过", upper: "兑", lower: "巽", keywords: ["大过","过度","纠正"], defaultTendency: "宜止损", briefMeaning: "过度失衡，需及时纠正，壮士断腕。" },
  31: { binaryId: 31, wenwangNo: 43, name: "泽天夬",   upper: "兑", lower: "乾", keywords: ["决断","果决","告别"], defaultTendency: "宜主动推进", briefMeaning: "当断则断，果决告别，不拖泥带水。" },

  /* ══════ 上艮 (100) ══════ */
  32: { binaryId: 32, wenwangNo: 23, name: "山地剥",   upper: "艮", lower: "坤", keywords: ["剥落","衰退","止损"], defaultTendency: "宜止损", briefMeaning: "剥落衰退，不可逆转时宜止损，保存实力。" },
  33: { binaryId: 33, wenwangNo: 27, name: "山雷颐",   upper: "艮", lower: "震", keywords: ["颐养","蓄力","等待"], defaultTendency: "宜守待机", briefMeaning: "颐养蓄力，养精蓄锐，等待合适的时机。" },
  34: { binaryId: 34, wenwangNo: 4,  name: "山水蒙",   upper: "艮", lower: "坎", keywords: ["启蒙","困惑","求教"], defaultTendency: "宜缓中进", briefMeaning: "蒙昧困惑，信息不足，先问清楚再行动。" },
  35: { binaryId: 35, wenwangNo: 41, name: "山泽损",   upper: "艮", lower: "兑", keywords: ["减损","取舍","精简"], defaultTendency: "宜止损", briefMeaning: "减损取舍，砍掉多余，把力气留给值得的事。" },
  36: { binaryId: 36, wenwangNo: 52, name: "艮为山",   upper: "艮", lower: "艮", keywords: ["止静","反思","节制"], defaultTendency: "宜守待机", briefMeaning: "当止则止，静下来反思，不急于前行。" },
  37: { binaryId: 37, wenwangNo: 22, name: "山火贲",   upper: "艮", lower: "离", keywords: ["文饰","表面","内涵"], defaultTendency: "宜缓中进", briefMeaning: "文饰之美，勿被表面迷惑，看本质再做决定。" },
  38: { binaryId: 38, wenwangNo: 18, name: "山风蛊",   upper: "艮", lower: "巽", keywords: ["蛊事","整顿","纠错"], defaultTendency: "宜改方式", briefMeaning: "积弊需整顿，纠错改过，换一套方法。" },
  39: { binaryId: 39, wenwangNo: 26, name: "山天大畜", upper: "艮", lower: "乾", keywords: ["积蓄","储备","厚积"], defaultTendency: "宜守待机", briefMeaning: "厚积薄发，储备充足后再行动更有力。" },

  /* ══════ 上离 (101) ══════ */
  40: { binaryId: 40, wenwangNo: 35, name: "火地晋",   upper: "离", lower: "坤", keywords: ["前进","晋升","光明"], defaultTendency: "宜主动推进", briefMeaning: "光明前进，晋升可期，顺势向上推进。" },
  41: { binaryId: 41, wenwangNo: 21, name: "火雷噬嗑", upper: "离", lower: "震", keywords: ["噬嗑","决断","清理"], defaultTendency: "宜主动推进", briefMeaning: "咬合决断，快刀斩乱麻，清理障碍。" },
  42: { binaryId: 42, wenwangNo: 64, name: "火水未济", upper: "离", lower: "坎", keywords: ["未成","过渡","审慎"], defaultTendency: "宜缓中进", briefMeaning: "事尚未成，处于过渡，审慎推进莫心急。" },
  43: { binaryId: 43, wenwangNo: 38, name: "火泽睽",   upper: "离", lower: "兑", keywords: ["乖离","分歧","求同"], defaultTendency: "宜改方式", briefMeaning: "意见分歧，宜求同存异，换一种沟通方式。" },
  44: { binaryId: 44, wenwangNo: 56, name: "火山旅",   upper: "离", lower: "艮", keywords: ["旅行","过渡","适应"], defaultTendency: "宜缓中进", briefMeaning: "旅居在外，过渡阶段，适应环境再定夺。" },
  45: { binaryId: 45, wenwangNo: 30, name: "离为火",   upper: "离", lower: "离", keywords: ["光明","依附","热情"], defaultTendency: "宜主动推进", briefMeaning: "光明热烈，依附正道，以热情推动。" },
  46: { binaryId: 46, wenwangNo: 50, name: "火风鼎",   upper: "离", lower: "巽", keywords: ["鼎新","稳固","革新"], defaultTendency: "宜改方式", briefMeaning: "革故鼎新，打破旧框架，建立新秩序。" },
  47: { binaryId: 47, wenwangNo: 14, name: "火天大有", upper: "离", lower: "乾", keywords: ["大有","丰收","分享"], defaultTendency: "宜主动推进", briefMeaning: "大有所获，丰收之时，适合分享和推进。" },

  /* ══════ 上巽 (110) ══════ */
  48: { binaryId: 48, wenwangNo: 20, name: "风地观",   upper: "巽", lower: "坤", keywords: ["观察","审视","等待"], defaultTendency: "宜守待机", briefMeaning: "仔细观察，审视全局后再做判断。" },
  49: { binaryId: 49, wenwangNo: 42, name: "风雷益",   upper: "巽", lower: "震", keywords: ["增益","助人","互利"], defaultTendency: "宜主动推进", briefMeaning: "增益互利，帮助他人的同时也成就自己。" },
  50: { binaryId: 50, wenwangNo: 59, name: "风水涣",   upper: "巽", lower: "坎", keywords: ["涣散","疏通","化解"], defaultTendency: "宜改方式", briefMeaning: "涣散需疏通，化解心结和障碍，重新聚拢。" },
  51: { binaryId: 51, wenwangNo: 61, name: "风泽中孚", upper: "巽", lower: "兑", keywords: ["诚信","中孚","感化"], defaultTendency: "宜缓中进", briefMeaning: "以诚待人，感化对方，不必急于求成。" },
  52: { binaryId: 52, wenwangNo: 53, name: "风山渐",   upper: "巽", lower: "艮", keywords: ["渐进","稳步","积累"], defaultTendency: "宜缓中进", briefMeaning: "循序渐进，一步一个脚印，慢就是快。" },
  53: { binaryId: 53, wenwangNo: 37, name: "风火家人", upper: "巽", lower: "离", keywords: ["家庭","亲密","包容"], defaultTendency: "宜缓中进", briefMeaning: "如家人相处，包容理解，以柔克刚。" },
  54: { binaryId: 54, wenwangNo: 57, name: "巽为风",   upper: "巽", lower: "巽", keywords: ["柔入","顺应","委婉"], defaultTendency: "宜缓中进", briefMeaning: "柔顺渗透，委婉表达，不硬碰硬。" },
  55: { binaryId: 55, wenwangNo: 9,  name: "风天小畜", upper: "巽", lower: "乾", keywords: ["小畜","积累","等待"], defaultTendency: "宜守待机", briefMeaning: "小有积蓄，但不到大展拳脚时，再等等。" },

  /* ══════ 上乾 (111) ══════ */
  56: { binaryId: 56, wenwangNo: 12, name: "天地否",   upper: "乾", lower: "坤", keywords: ["闭塞","阻滞","守正"], defaultTendency: "宜守待机", briefMeaning: "天地闭塞，万事不顺，守住正道等风来。" },
  57: { binaryId: 57, wenwangNo: 25, name: "天雷无妄", upper: "乾", lower: "震", keywords: ["无妄","真实","顺势"], defaultTendency: "宜守待机", briefMeaning: "不妄为，顺其自然，不抱不切实际的期待。" },
  58: { binaryId: 58, wenwangNo: 6,  name: "天水讼",   upper: "乾", lower: "坎", keywords: ["争讼","分歧","理性"], defaultTendency: "宜改方式", briefMeaning: "争讼分歧，保持理性，换个方式解决争端。" },
  59: { binaryId: 59, wenwangNo: 10, name: "天泽履",   upper: "乾", lower: "兑", keywords: ["践行","谨慎","守礼"], defaultTendency: "宜缓中进", briefMeaning: "如履薄冰，谨慎践行，守规矩走好每一步。" },
  60: { binaryId: 60, wenwangNo: 33, name: "天山遁",   upper: "乾", lower: "艮", keywords: ["退避","收敛","等待"], defaultTendency: "宜守待机", briefMeaning: "退避收敛，以退为进，暂时远离是非。" },
  61: { binaryId: 61, wenwangNo: 13, name: "天火同人", upper: "乾", lower: "离", keywords: ["同人","合作","共识"], defaultTendency: "宜主动推进", briefMeaning: "同心协力，寻求合作共识，一起推进。" },
  62: { binaryId: 62, wenwangNo: 44, name: "天风姤",   upper: "乾", lower: "巽", keywords: ["姤遇","偶遇","机缘"], defaultTendency: "宜缓中进", briefMeaning: "不期而遇，顺应机缘，不必刻意强求。" },
  63: { binaryId: 63, wenwangNo: 1,  name: "乾为天",   upper: "乾", lower: "乾", keywords: ["刚健","主动","创造"], defaultTendency: "宜主动推进", briefMeaning: "刚健有力，主动创造，自强不息。" },
};

// ============ 查询函数 ============

/** 根据 binaryId（0-63）获取卦名 */
export function getHexagramName(binaryId: number): string {
  const hex = HEXAGRAM_MAP[binaryId];
  return hex?.name ?? "未录入卦";
}

/** 根据 binaryId 获取默认行动倾向 */
export function getDefaultTendency(binaryId: number): string {
  const hex = HEXAGRAM_MAP[binaryId];
  return hex?.defaultTendency ?? "宜缓中进";
}

/** 根据 binaryId 获取完整卦象数据 */
export function getHexagramByBinaryId(binaryId: number): HexagramData | undefined {
  return HEXAGRAM_MAP[binaryId];
}

/** 根据文王卦序编号（1-64）获取卦象数据 */
export function getHexagramByWenwangNo(wenwangNo: number): HexagramData | undefined {
  for (const hex of Object.values(HEXAGRAM_MAP)) {
    if (hex.wenwangNo === wenwangNo) return hex;
  }
  return undefined;
}

/** 获取所有卦象数据 */
export function getAllHexagrams(): HexagramData[] {
  return Object.values(HEXAGRAM_MAP);
}
