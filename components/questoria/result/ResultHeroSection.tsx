import Image from "next/image";
import React, { useEffect, useState } from "react";

type Level = "HIGH" | "MID" | "LOW";

type Props = {
  typeNameJa: string;
  typeNameEn: string;
  tagline: string;
  imageSrc: string;
  colors: { primary: string; secondary: string };
  scores: { purpose: number; design: number; decision: number };
  levels: { purpose: Level; design: Level; decision: Level };
  overallComment?: string;
};

function SkillBar({ label, score, level }: { label: string; score: number; level: Level }) {
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

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">{label}</span>
        <span className="font-mono text-sm font-bold" style={{ color: barColor.text }}>
          {Math.round(score)}
        </span>
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
            width: animated ? `${Math.round(score)}%` : "0%",
            background: `linear-gradient(90deg, ${barColor.bar}88, ${barColor.bar})`,
            boxShadow: `0 0 8px ${barColor.glow}, 0 0 16px ${barColor.glow}`,
          }}
        />
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
  overallComment,
}: Props) {
  const tint = `${colors.primary}18`;

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
            <span
              className="rounded-sm bg-black/60 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-cyan-300 backdrop-blur-sm"
              style={{
                border: "1px solid rgba(0,229,255,0.7)",
                boxShadow: "0 0 10px rgba(0,229,255,0.3)",
              }}
            >
              RESULT
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6">
            <p
              className="mb-2 font-mono text-[11px] tracking-[0.28em] text-cyan-300/90"
              style={{ textShadow: "0 0 8px rgba(0,229,255,0.6)" }}
            >
              {"// YOUR CLASS //"}
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
            <p className="mt-3 border-l-2 border-cyan-400/60 pl-3 text-sm leading-relaxed text-white/80">
              {tagline}
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur">
            <p className="mb-4 font-mono text-[11px] tracking-[0.28em] text-white/75">
              {"// SKILL STATUS //"}
            </p>
            <div className="space-y-4">
              <SkillBar label="目的定義力" score={scores.purpose} level={levels.purpose} />
              <SkillBar label="設計力" score={scores.design} level={levels.design} />
              <SkillBar label="自律判断力" score={scores.decision} level={levels.decision} />
            </div>

            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-white/65">
              {overallComment ?? "TODO: overallComment を他タイプにも追加"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

