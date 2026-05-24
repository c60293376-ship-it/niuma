export type Wuxing = "金" | "木" | "水" | "火" | "土";

export type DailyCalendarInfo = {
  solar: {
    year: number;
    month: number;
    day: number;
    week: string;
    displayDate: string;
  };
  lunar: {
    monthDay: string;
    yearGanZhi: string;
    monthGanZhi: string;
    dayGanZhi: string;
    ganZhiText: string;
  };
  huangli: {
    zhiXing: string;
    zhiXingText: string;
    dayNaYin: string;
    wuxing: Wuxing;
    wuxingTag: string;
    yi: string[];
    ji: string[];
  };
};

const WEEK_TEXT = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const JIANCHU = ["建", "除", "满", "平", "定", "执", "破", "危", "成", "收", "开", "闭"];
const LUNAR_MONTH = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
const LUNAR_DAY = [
  "初一",
  "初二",
  "初三",
  "初四",
  "初五",
  "初六",
  "初七",
  "初八",
  "初九",
  "初十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
  "廿一",
  "廿二",
  "廿三",
  "廿四",
  "廿五",
  "廿六",
  "廿七",
  "廿八",
  "廿九",
  "三十",
];

const NAYIN = [
  "海中金",
  "炉中火",
  "大林木",
  "路旁土",
  "剑锋金",
  "山头火",
  "涧下水",
  "城头土",
  "白蜡金",
  "杨柳木",
  "泉中水",
  "屋上土",
  "霹雳火",
  "松柏木",
  "长流水",
  "砂石金",
  "山下火",
  "平地木",
  "壁上土",
  "金箔金",
  "覆灯火",
  "天河水",
  "大驿土",
  "钗钏金",
  "桑柘木",
  "大溪水",
  "沙中土",
  "天上火",
  "石榴木",
  "大海水",
];

const YI_SETS = [
  ["整理", "开工", "补光"],
  ["沟通", "收纳", "复盘"],
  ["学习", "清洁", "早睡"],
  ["见人", "定计划", "换气"],
];

const JI_SETS = [
  ["硬扛", "熬夜", "乱堆"],
  ["冲动下单", "久坐不动", "拖延"],
  ["争执", "阴暗处久待", "暴饮暴食"],
  ["临时反悔", "堆杂物", "过度内耗"],
];

const WUXING_TAGS: Record<Wuxing, string> = {
  金: "金气偏硬",
  木: "木气舒展",
  水: "水气浮动",
  火: "韧性偏强",
  土: "土气沉稳",
};

function normalizeList(items: string[]): string[] {
  return items.map((item) => item.trim()).filter(Boolean);
}

function getWuxingFromNaYin(dayNaYin: string): Wuxing {
  const wuxing = [...dayNaYin].reverse().find((char): char is Wuxing =>
    ["金", "木", "水", "火", "土"].includes(char),
  );

  return wuxing ?? "土";
}

function getDayIndex(date: Date): number {
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(utc / 86_400_000);
}

function getGanZhi(index: number): string {
  return `${GAN[index % GAN.length]}${ZHI[index % ZHI.length]}`;
}

export function getTodayInLocalDate(date = new Date()) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    week: WEEK_TEXT[date.getDay()],
    displayDate: `${date.getMonth() + 1}月${date.getDate()}日`,
  };
}

export function getLocalDateKey(date = new Date()): string {
  const { year, month, day } = getTodayInLocalDate(date);
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${year}-${pad(month)}-${pad(day)}`;
}

export function getDailyCalendarInfo(date = new Date()): DailyCalendarInfo {
  const localDate = getTodayInLocalDate(date);
  const dayIndex = getDayIndex(date);
  const yearGanZhi = getGanZhi(localDate.year - 4);
  const monthGanZhi = getGanZhi(localDate.year * 12 + localDate.month + 14);
  const dayGanZhi = getGanZhi(dayIndex + 40);
  const zhiXing = JIANCHU[dayIndex % JIANCHU.length];
  const dayNaYin = NAYIN[dayIndex % NAYIN.length];
  const wuxing = getWuxingFromNaYin(dayNaYin);
  const lunarMonth = LUNAR_MONTH[(localDate.month + Math.floor(localDate.day / 29)) % LUNAR_MONTH.length];
  const lunarDay = LUNAR_DAY[(localDate.day + 14) % LUNAR_DAY.length];
  const listIndex = dayIndex % YI_SETS.length;

  return {
    solar: localDate,
    lunar: {
      monthDay: `${lunarMonth}月${lunarDay}`,
      yearGanZhi,
      monthGanZhi,
      dayGanZhi,
      ganZhiText: `${yearGanZhi}年 ${monthGanZhi}月 ${dayGanZhi}日`,
    },
    huangli: {
      zhiXing,
      zhiXingText: `${zhiXing}日`,
      dayNaYin,
      wuxing,
      wuxingTag: WUXING_TAGS[wuxing],
      yi: normalizeList(YI_SETS[listIndex]),
      ji: normalizeList(JI_SETS[listIndex]),
    },
  };
}
