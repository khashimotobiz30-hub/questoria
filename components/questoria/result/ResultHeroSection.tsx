import Image from "next/image";
import React, { useEffect, useState } from "react";

import { ResultCardDecor, resultCardShellClass, sectionLabelClass } from "@/components/questoria/result/resultCardTheme";
import type { DiagnosisMode } from "@/types";

type Level = "HIGH" | "MID" | "LOW";

type Props = {
  typeNameJa: string;
  typeNameEn: string;
  tagline: string;
  imageSrc: string;
  colors: { primary: string; secondary: string };
  scores: { purpose: number; design: number; decision: number };
  levels: { purpose: Level; design: Level; decision: Level };
  mode?: DiagnosisMode;
  source?: "deep" | "light";
  overallComment?: string;
  disableOverallClamp?: boolean;
  hideSkillStatusDescription?: boolean;
};

function SkillBar({
  label,
  score,
  level,
  hideScoreNumber,
}: {
  label: string;
  score: number;
  level: Level;
  hideScoreNumber?: boolean;
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 350);
    return () => clearTimeout(t);
  }, []);

  const barColor =
    level === "HIGH"
      ? { bar: "#FFD700", glow: "rgba(255,215,0,0.55)", text: "#FFD700" }
      : level === "MID"
        ? { bar: "#C8A800", glow: "rgba(200,168,0,0.35)", text: "#C8A800" }
        : { bar: "#6B5900", glow: "rgba(107,89,0,0.25)", text: "#6B5900" };

  const pct = Math.max(0, Math.min(100, Math.round(score)));
  const tipLeft = pct <= 2 ? "0%" : `calc(${pct}% - 6px)`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">{label}</span>
        {!hideScoreNumber && (
          <span className="font-mono text-sm font-bold" style={{ color: barColor.text }}>
            {Math.round(score)}
          </span>
        )}
      </div>

      <div className="relative h-[10px] w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, rgba(255,215,0,0.05), transparent)",
          }}
        />
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: animated ? `${pct}%` : "0%",
            background: `linear-gradient(90deg, ${barColor.bar}88, ${barColor.bar})`,
            boxShadow: `0 0 8px ${barColor.glow}, 0 0 16px ${barColor.glow}`,
          }}
        />
        {animated && pct > 0 ? (
          <div
            className="absolute top-0 h-[10px] w-[6px]"
            style={{
              left: tipLeft,
              background: `linear-gradient(180deg, rgba(255,255,255,0.20), transparent)`,
              boxShadow: "0 0 6px rgba(255,255,255,0.22)",
              filter: "drop-shadow(0 0 2px rgba(255,255,255,0.20))",
              borderRadius: 9999,
            }}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  );
}

export function ResultHeroSection({
  typeNameJa,
  typeNameEn,
  tagline,
  imageSrc,
  colors,
  scores,
  levels,
  mode,
  source,
  overallComment,
  disableOverallClamp,
  hideSkillStatusDescription,
}: Props) {
  const tint = `${colors.primary}18`;
  const modeLabel = source === "light" ? "LIGHT" : (mode ?? "work") === "life" ? "LIFE" : "WORK";
  const hideSkillStatus = source === "light";

  return (
    <section className="px-4 pt-4">
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent shadow-[0_0_60px_rgba(0,229,255,0.06)]"
        style={{ backgroundColor: tint }}
      >
        <div className="relative h-[44svh] w-full">
          <Image
            src={imageSrc}
            alt={typeNameJa}
            fill
            sizes="(min-width: 768px) 448px, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 15%", filter: "brightness(1.25) contrast(1.05)" }}
            priority
          />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 to-transparent pointer-events-none" />
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "65%",
              background:
                "linear-gradient(to top, #0A0A0F 18%, rgba(10,10,15,0.55) 60%, transparent 100%)",
            }}
          />

          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
            <span
              className="font-mono text-xs tracking-[0.3em] text-[#FFD700]"
              style={{
                textShadow: "0 0 10px rgba(255,215,0,0.9), 0 0 20px rgba(255,215,0,0.4)",
              }}
            >
              QUESTORIA
            </span>
            <div className="flex items-center gap-2">
              <span
                className="rounded-sm bg-black/60 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-cyan-300 backdrop-blur-sm"
                style={{
                  border: "1px solid rgba(0,229,255,0.7)",
                  boxShadow: "0 0 10px rgba(0,229,255,0.3)",
                }}
              >
                RESULT
              </span>
              <span
                className="rounded-sm bg-black/50 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-cyan-200/90 backdrop-blur-sm"
                style={{
                  border: "1px solid rgba(0,229,255,0.38)",
                  boxShadow: "0 0 10px rgba(0,229,255,0.16)",
                }}
              >
                {modeLabel}
              </span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6">
            <p
              className="mb-2 font-mono text-[11px] tracking-[0.28em] text-cyan-300/90"
              style={{ textShadow: "0 0 8px rgba(0,229,255,0.6)" }}
            >
              YOUR CLASS
            </p>
            <h1
              className="font-orbitron text-5xl font-black leading-none tracking-wide text-[#FFD700]"
              style={{
                textShadow:
                  "0 0 40px rgba(255,215,0,0.6), 0 0 80px rgba(255,215,0,0.2), 0 2px 12px rgba(0,0,0,0.9)",
              }}
            >
              {typeNameJa}
            </h1>
            <p className="mt-2 font-mono text-sm tracking-[0.3em] text-white/50">
              — {typeNameEn} —
            </p>
            <p className="mt-3 whitespace-pre-line border-l-2 border-cyan-400/60 pl-3 text-sm leading-relaxed text-white/80">
              {tagline}
            </p>
          </div>
        </div>

        {/* 横は控えめに詰め、SKILL STATUS カードをヒーロー内で広く（下セクションのカード幅に近づける） */}
        {!hideSkillStatus && (
          <div className="space-y-4 px-1.5 pb-5 pt-5 sm:px-2">
            <div className={resultCardShellClass("default")}>
              <ResultCardDecor withRail />
              <div className="relative z-[1] p-4">
                <p className={sectionLabelClass}>
                  <span className="mr-2 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.22)]" aria-hidden>
                    ◆
                  </span>
                  SKILL STATUS
                </p>
                <div className="mt-3 space-y-4 border-t border-white/10 pt-4">
                  <SkillBar label="目的定義力" score={scores.purpose} level={levels.purpose} />
                  <SkillBar label="設計力" score={scores.design} level={levels.design} />
                  <SkillBar label="自律判断力" score={scores.decision} level={levels.decision} />
                </div>

                {!hideSkillStatusDescription && (
                  <p
                    className={`mt-4 border-t border-white/10 pt-4 whitespace-pre-line text-sm leading-relaxed text-white/65 ${
                      disableOverallClamp ? "pb-0.5" : "line-clamp-4"
                    }`}
                  >
                    {overallComment ?? "TODO: overallComment を他タイプにも追加"}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

