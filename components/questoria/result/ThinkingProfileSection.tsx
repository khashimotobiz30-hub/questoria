import React from "react";

import { sectionLabelClass } from "@/components/questoria/result/resultCardTheme";

type Level = "HIGH" | "MID" | "LOW";

type AxisCard = {
  key: "purpose" | "design" | "decision";
  title: string;
  description: string;
  score: number;
  level: Level;
  comment: string;
};

function levelBadge(level: Level) {
  if (level === "HIGH") return { label: "HIGH", cls: "border-[#FFD700]/40 text-[#FFD700]" };
  if (level === "MID") return { label: "MID", cls: "border-cyan-300/40 text-cyan-200" };
  return { label: "LOW", cls: "border-white/20 text-white/60" };
}

function levelToBar(level: Level) {
  if (level === "HIGH") return { color: "#FFD700", glow: "rgba(255,215,0,0.35)" };
  if (level === "MID") return { color: "#00E5FF", glow: "rgba(0,229,255,0.25)" };
  return { color: "#6B5900", glow: "rgba(107,89,0,0.18)" };
}

export function ThinkingProfileSection({
  axes,
  profileSummary,
}: {
  axes: AxisCard[];
  profileSummary?: string;
}) {
  return (
    <section className="space-y-4">
      <div className="px-0.5">
        <p className={sectionLabelClass}>YOUR THINKING PROFILE</p>
        <h2 className="mt-2 font-orbitron text-lg font-bold tracking-wide text-white">
          なぜこのタイプなのか
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          3つの軸スコアが、あなたの思考のクセを形作っています。
        </p>
      </div>

      <div className="space-y-3">
        {axes.map((axis) => {
          const b = levelBadge(axis.level);
          return (
            <div
              key={axis.key}
              className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#0B1224]/80 to-black/60 p-4 shadow-[0_0_30px_rgba(0,229,255,0.05)] backdrop-blur"
            >
              <div
                className={`absolute right-3 top-3 rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.22em] ${b.cls}`}
              >
                {b.label}
              </div>

              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/90">{axis.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/55">
                    {axis.description}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-3xl font-black leading-none text-white">
                    {Math.round(axis.score)}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, Math.round(axis.score)))}%`,
                      background: `linear-gradient(90deg, ${levelToBar(axis.level).color}00, ${levelToBar(axis.level).color}AA, ${levelToBar(axis.level).color})`,
                      boxShadow: `0 0 14px ${levelToBar(axis.level).glow}`,
                    }}
                  />
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/75">{axis.comment}</p>
            </div>
          );
        })}
      </div>

      {profileSummary ? (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className={sectionLabelClass}>SUMMARY</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/75">
            {profileSummary}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
          <p className="text-sm text-white/60">
            ここは各タイプごとの要約が入ります。（TODO: profileSummary を他タイプにも追加）
          </p>
        </div>
      )}
    </section>
  );
}

