import { useEffect, useRef, useState } from "react";
import { mockToday } from "../data/mockToday";
import type { TodayData } from "../data/mockToday";
import DateCard from "../components/DateCard";
import FateCard from "../components/FateCard";
import YiJiPanel from "../components/YiJiPanel";
import OracleCard from "../components/OracleCard";
import {
  getDailyCalendarInfo,
  getLocalDateKey,
  type DailyCalendarInfo,
} from "../utils/calendar";

const TODAY_GOOD = ["打扫", "搬家", "祈福"];
const TODAY_AVOID = ["签合同", "开新坑", "搞大工程"];
const TODAY_ORACLE = "该坚持的别松手，\n该放过的别上头。";

function getDevTestDate(): Date | undefined {
  if (!import.meta.env.DEV) {
    return undefined;
  }

  const testDate = new URLSearchParams(window.location.search).get("testDate");

  if (!testDate || !/^\d{4}-\d{2}-\d{2}$/.test(testDate)) {
    return undefined;
  }

  const [year, month, day] = testDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    return undefined;
  }

  return date;
}

function buildTodayData(calendar: DailyCalendarInfo): TodayData {
  return {
    ...mockToday,
    date: `${calendar.solar.displayDate} ${calendar.solar.week}`,
    lunar: calendar.lunar.monthDay,
    ganzhi: calendar.lunar.ganZhiText,
    jianchu: calendar.huangli.zhiXingText,
    nayin: calendar.huangli.dayNaYin,
    wuxing: calendar.huangli.wuxingTag,
    good: TODAY_GOOD,
    avoid: TODAY_AVOID,
    oracle: TODAY_ORACLE,
    basis: [
      `${calendar.huangli.zhiXingText}当值，今天适合顺着节奏处理事情`,
      `${calendar.huangli.dayNaYin}入日，五行表现为${calendar.huangli.wuxingTag}`,
    ],
  };
}

function getCalendarSnapshot() {
  const date = getDevTestDate() ?? new Date();
  const calendar = getDailyCalendarInfo(date);

  return {
    key: getLocalDateKey(date),
    calendar,
    data: buildTodayData(calendar),
  };
}

export default function TodayPage() {
  const [snapshot, setSnapshot] = useState(getCalendarSnapshot);
  const hasLogged = useRef(false);

  useEffect(() => {
    if (!hasLogged.current) {
      console.log("DailyCalendarInfo", snapshot.calendar);
      hasLogged.current = true;
    }
  }, [snapshot.calendar]);

  useEffect(() => {
    const refreshIfDateChanged = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      const nextSnapshot = getCalendarSnapshot();

      if (nextSnapshot.key !== snapshot.key) {
        setSnapshot(nextSnapshot);
      }
    };

    document.addEventListener("visibilitychange", refreshIfDateChanged);

    return () => {
      document.removeEventListener("visibilitychange", refreshIfDateChanged);
    };
  }, [snapshot.key]);

  return (
    <>
      <DateCard data={snapshot.data} />
      <FateCard data={snapshot.data} />
      <YiJiPanel data={snapshot.data} />
      <div className="today-calendar-oracle-scene">
        <OracleCard data={snapshot.data} />
      </div>
      {/* TODO: 后续增加「收进命簿」按钮，由用户手动触发保存 */}
    </>
  );
}
