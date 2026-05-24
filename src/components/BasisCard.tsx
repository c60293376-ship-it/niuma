import type { TodayData } from "../data/mockToday";
import { BookOpen } from "lucide-react";

interface BasisCardProps {
  data: TodayData;
}

export default function BasisCard({ data }: BasisCardProps) {
  const basisMeta = [
    { icon: data.jianchu.charAt(0), title: data.jianchu, color: "bg-niuma-primary/10 text-niuma-primary" },
    { icon: data.nayin.slice(-1), title: `${data.nayin} · ${data.wuxing}`, color: "bg-niuma-primaryDark/10 text-niuma-primaryDark" },
  ] as const;

  return (
    <div className="w-full bg-niuma-card rounded-[22px] px-5 py-4 shadow-[0_4px_16px_rgba(120,72,60,0.08)]">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-niuma-primary/70" />
        <span className="section-title text-niuma-textMain font-bold text-[15px] tracking-wider">
          命理依据
        </span>
      </div>

      {/* 两条简洁依据 */}
      <div className="flex flex-col">
        {data.basis.map((desc, i) => {
          const meta = basisMeta[i];
          return (
            <div key={i}>
              <div className="flex items-start gap-3 py-2.5">
                {/* 左侧圆形 icon */}
                <span
                  className={`item-title inline-flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 text-xs font-bold ${meta.color}`}
                >
                  {meta.icon}
                </span>

                {/* 右侧标题 + 一行短说明 */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className="item-title text-niuma-textMain font-bold text-sm">
                    {meta.title}
                  </span>
                  <span className="body-text text-niuma-textSub text-[13px] leading-[1.5]">
                    {desc}
                  </span>
                </div>
              </div>

              {i < data.basis.length - 1 && (
                <div className="border-b border-niuma-border/40 mx-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
