import type { TodayData } from "../data/mockToday";
import { CheckCircle, XCircle } from "lucide-react";

interface YiJiPanelProps {
  data: TodayData;
}

const goodSubs: Record<string, string> = {
  "打扫": "清一清工位怨气。",
  "搬家": "牛马也要换槽。",
  "祈福": "求个甲方少改版。",
};

const avoidSubs: Record<string, string> = {
  "签合同": "别把自己签进去。",
  "开新坑": "坑还没挖，债先来了。",
  "搞大工程": "别急着造人生航母。",
};

const getGoodSub = (item: string) => goodSubs[item] ?? "顺势处理，把小事稳稳落地";
const getAvoidSub = (item: string) => avoidSubs[item] ?? "先缓一缓，别把情绪放大";

export default function YiJiPanel({ data }: YiJiPanelProps) {
  return (
    <div className="grid grid-cols-2" style={{ gap: 14 }}>
      {([
        {
          bg: "#F4F7F1",
          color: "#5F7F4F",
          Icon: CheckCircle,
          title: "今日宜",
          items: data.good,
          subs: goodSubs,
        },
        {
          bg: "#FDF4F3",
          color: "#D65A4A",
          Icon: XCircle,
          title: "今日忌",
          items: data.avoid,
          subs: avoidSubs,
        },
      ] as const).map(({ bg, color, Icon, title, items, subs }) => (
        <div
          key={title}
          style={{
            background: bg,
            borderRadius: 24,
            padding: "16px 16px",
            minHeight: 182,
            boxSizing: "border-box",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 16px rgba(120,72,60,0.05)",
          }}
        >
          {/* 标题区 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Icon className="flex-shrink-0" style={{ width: 16, height: 16, color }} />
            <h3 className="section-title" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2, color }}>
              {title}
            </h3>
          </div>

          {/* 列表区 */}
          <ul style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {items.map((item: string, i: number) => {
              const isLast = i === items.length - 1;
              return (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginBottom: isLast ? 0 : 10,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: color,
                      flexShrink: 0,
                      marginTop: 8,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      className="item-title"
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: "#3B2A24",
                        marginBottom: 4,
                      }}
                    >
                      {item}
                    </p>
                    <p
                      className="item-desc"
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        lineHeight: 1.35,
                        color: "#7A6258",
                      }}
                    >
                      {subs === goodSubs ? getGoodSub(item) : getAvoidSub(item)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
