/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { DiagnosisResult, ResultType } from "@/types";
import { typeMaster } from "@/data/typeMaster";

const SESSION_KEY_RESULT = "questoria_result";

const typeImageMap: Record<ResultType, string> = {
  hero: "/top/hero.jpg",
  sage: "/top/sage.jpg",
  berserker: "/top/berserker.jpg",
  oracle: "/top/oracle.jpg",
  artisan: "/top/artisan.jpg",
  wizard: "/top/wizard.jpg",
  pioneer: "/top/pioneer.jpg",
  origin: "/top/origin.jpg",
};

function openXShare(text: string) {
  const encoded = encodeURIComponent(text);
  const url = `https://twitter.com/intent/tweet?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function toTrianglePoint(
  centerX: number,
  centerY: number,
  radius: number,
  angleDeg: number,
  value: number,
  maxValue: number
): { x: number; y: number } {
  const clamped = Math.max(0, Math.min(maxValue, value));
  const ratio = clamped / maxValue;
  const angleRad = (angleDeg * Math.PI) / 180;
  const r = radius * ratio;
  return {
    x: centerX + r * Math.cos(angleRad),
    y: centerY + r * Math.sin(angleRad),
  };
}

function getRadarPoints(scores: DiagnosisResult["normalizedScores"]): string {
  // center of the triangle grid in the SVG above
  const cx = 130;
  const cy = 110;
  const maxRadius = 75;
  const maxValue = 100;

  // 上: purpose（目的定義力） -90°
  const purposePoint = toTrianglePoint(
    cx,
    cy,
    maxRadius,
    -90,
    scores.purpose,
    maxValue
  );
  // 右下: design（設計力） 30°
  const designPoint = toTrianglePoint(
    cx,
    cy,
    maxRadius,
    30,
    scores.design,
    maxValue
  );
  // 左下: decision（自律判断力）210°
  const decisionPoint = toTrianglePoint(
    cx,
    cy,
    maxRadius,
    210,
    scores.decision,
    maxValue
  );

  return `${purposePoint.x},${purposePoint.y} ${designPoint.x},${designPoint.y} ${decisionPoint.x},${decisionPoint.y}`;
}

export default function ResultPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY_RESULT);
    if (!raw) {
      router.replace("/quest");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as DiagnosisResult;
      setResult(parsed);
      setIsReady(true);
    } catch {
      router.replace("/quest");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isReady || !result) {
    return null;
  }

  const typeData = typeMaster[result.resultType];
  const imageSrc = typeImageMap[result.resultType] ?? "/top/hero.jpg";
  const radarPoints = getRadarPoints(result.normalizedScores);

  const shareTextFirstView = `QUESTORIAのAIスキル診断やってみたら「${typeData.nameJa}」だった。\n${typeData.tagline}\nこれ、ちょっと当たってるかも。\n#QUESTORIA #AIスキル診断\nquestoria.app`;

  const shareTextInviteFriends = `QUESTORIAのAIスキル診断やってみた。\n私は「${typeData.nameJa}」。\nあなたは何タイプ？\n#QUESTORIA #AIスキル診断\nquestoria.app`;

  return (
    <main className="min-h-[100svh] w-full bg-[#0A0A0F] px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-cyan-400/25 bg-gradient-to-b from-[#0B1224] via-[#070C17] to-[#050812] p-5 shadow-[0_0_40px_rgba(0,229,255,0.08)] backdrop-blur">
          <header className="text-center">
            <p className="font-mono text-[11px] tracking-[0.3em] text-cyan-300/80">
              QUESTORIA RESULT
            </p>
            <h1 className="mt-2 font-orbitron text-3xl tracking-wide text-[#FFD700]">
              {typeData.nameJa}
              <span className="ml-2 align-middle font-mono text-sm tracking-[0.2em] text-cyan-200/80">
                / {typeData.nameEn}
              </span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {typeData.tagline}
            </p>
          </header>

          <section className="mt-6 grid grid-cols-1 gap-4">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs tracking-[0.24em] text-white/70">
                  CHARACTER
                </p>
                <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-0.5 font-mono text-[10px] tracking-wide text-cyan-200/80">
                  VISUAL
                </span>
              </div>
              <div className="mt-3 aspect-[4/5] w-full overflow-hidden rounded-lg border border-[#FFD700]/20 bg-gradient-to-b from-[#0A0A0F] via-black/40 to-[#0A0A0F]">
                <div className="relative flex h-full w-full items-center justify-center">
                  <Image
                    src={imageSrc}
                    alt={typeData.nameJa}
                    fill
                    sizes="(min-width: 768px) 384px, 100vw"
                    className="object-contain opacity-95"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs tracking-[0.24em] text-white/70">
                  RADAR
                </p>
                <span className="rounded-full border border-[#FFD700]/25 bg-[#FFD700]/10 px-2 py-0.5 font-mono text-[10px] tracking-wide text-[#FFD700]/80">
                  SCORE
                </span>
              </div>

              <div className="mt-3 rounded-lg border border-cyan-300/20 bg-black/40 p-4">
                <svg
                  viewBox="0 0 260 230"
                  role="img"
                  aria-label="AI skill radar chart"
                  className="h-auto w-full"
                >
                  <defs>
                    <linearGradient id="grid" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#00E5FF" stopOpacity="0.25" />
                      <stop offset="1" stopColor="#FFD700" stopOpacity="0.18" />
                    </linearGradient>
                    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#00E5FF" stopOpacity="0.3" />
                      <stop offset="1" stopColor="#00E5FF" stopOpacity="0.08" />
                    </linearGradient>
                  </defs>

                  <rect x="0" y="0" width="260" height="230" fill="transparent" />

                  <g stroke="url(#grid)" strokeWidth="1.1">
                    <polygon
                      points="130,35 215,155 45,155"
                      fill="none"
                      opacity="0.4"
                    />
                    <polygon
                      points="130,55 204,150 56,150"
                      fill="none"
                      opacity="0.55"
                    />
                    <polygon
                      points="130,75 193,145 67,145"
                      fill="none"
                      opacity="0.8"
                    />
                    <line x1="130" y1="35" x2="130" y2="170" opacity="0.55" />
                    <line x1="45" y1="155" x2="215" y2="155" opacity="0.4" />
                    <line x1="45" y1="155" x2="130" y2="35" opacity="0.4" />
                    <line x1="215" y1="155" x2="130" y2="35" opacity="0.4" />
                  </g>

                  <polygon
                    points={radarPoints}
                    fill="url(#fill)"
                    stroke="#00E5FF"
                    strokeOpacity="0.9"
                    strokeWidth="1.8"
                  />

                  <g
                    fill="#E8F0FF"
                    fillOpacity="0.8"
                    fontFamily="monospace"
                    fontSize="9"
                  >
                    <text x="130" y="26" textAnchor="middle">
                      目的定義力
                    </text>
                    <text x="220" y="163" textAnchor="end">
                      設計力
                    </text>
                    <text x="40" y="163" textAnchor="start">
                      自律判断力
                    </text>
                  </g>

                  {/* score legend under chart */}
                  <g
                    fill="#E8F0FF"
                    fillOpacity="0.85"
                    fontFamily="monospace"
                    fontSize="9"
                  >
                    <text x="130" y="200" textAnchor="middle">
                      P:{result.normalizedScores.purpose} / D:
                      {result.normalizedScores.design} / A:
                      {result.normalizedScores.decision}
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-1 gap-3">
            <div className="rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/5 p-4">
              <p className="font-mono text-xs tracking-[0.24em] text-[#FFD700]/90">
                ESSENCE
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {typeData.description.essence}
              </p>
            </div>

            <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4">
              <p className="font-mono text-xs tracking-[0.24em] text-cyan-200/90">
                STRENGTH
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {typeData.description.strength}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="font-mono text-xs tracking-[0.24em] text-white/80">
                GROWTH
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {typeData.description.growth}
              </p>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-1 gap-3">
            <button
              type="button"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-black/40 px-4 py-3 text-sm font-semibold tracking-wide text-white/90 shadow-[0_0_24px_rgba(0,229,255,0.08)] transition hover:border-cyan-300/45 hover:bg-black/55"
              aria-label="Share on X (visual only)"
              onClick={() => openXShare(shareTextFirstView)}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-base">
                𝕏
              </span>
              <span className="font-mono tracking-[0.18em]">SHARE</span>
              <span className="ml-auto font-mono text-[11px] tracking-wide text-white/45">
                open tweet
              </span>
            </button>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#FFD700]/25 bg-black/40 px-4 py-3 text-sm font-semibold tracking-wide text-white/90 shadow-[0_0_24px_rgba(255,215,0,0.06)] transition hover:border-[#FFD700]/45 hover:bg-black/55"
              aria-label="Save image (visual only)"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-base">
                ⬇
              </span>
              <span className="font-mono tracking-[0.18em]">SAVE</span>
              <span className="ml-auto font-mono text-[11px] tracking-wide text-white/45">
                coming soon
              </span>
            </button>
          </section>

          <section className="mt-7 rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-center font-mono text-xs tracking-[0.3em] text-cyan-200/80">
              SKILL ANALYSIS
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <SkillRow
                labelJa="目的定義力"
                labelEn="PURPOSE"
                score={result.normalizedScores.purpose}
                level={result.levels.purpose}
              />
              <SkillRow
                labelJa="設計力"
                labelEn="DESIGN"
                score={result.normalizedScores.design}
                level={result.levels.design}
              />
              <SkillRow
                labelJa="自律判断力"
                labelEn="AUTONOMY"
                score={result.normalizedScores.decision}
                level={result.levels.decision}
              />
            </div>
          </section>

          <section className="mt-7 rounded-2xl border border-[#FFD700]/15 bg-[#FFD700]/5 p-4">
            <p className="text-center font-mono text-xs tracking-[0.3em] text-[#FFD700]/85">
              COMPARE
            </p>
            <div className="mt-3 space-y-1 text-center text-sm leading-relaxed text-white/80">
              <p>あなたの友達は何タイプ？</p>
              <p>勇者？ 賢者？ それとも魔法使い？</p>
              <p>結果を比べてみよう。</p>
            </div>

            <button
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-cyan-300/25 bg-black/45 px-4 py-3 text-sm font-semibold tracking-wide text-white/95 shadow-[0_0_24px_rgba(0,229,255,0.08)] transition hover:border-cyan-300/45 hover:bg-black/60"
              onClick={() => openXShare(shareTextInviteFriends)}
            >
              ▶ 友達にも診断させる
            </button>
          </section>

          <div className="mt-7 flex flex-col items-center justify-center gap-2">
            <p className="font-mono text-[11px] tracking-[0.28em] text-white/45">
              SCROLL
            </p>
            <div className="flex flex-col items-center">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300/60" />
              <span className="mt-1 text-lg leading-none text-cyan-200/70">
                ↓
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

type Level = "HIGH" | "MID" | "LOW";

type SkillRowProps = {
  labelJa: string;
  labelEn: string;
  score: number;
  level: Level;
};

function SkillRow({ labelJa, labelEn, score, level }: SkillRowProps) {
  const levelColor =
    level === "HIGH"
      ? "bg-emerald-400/15 text-emerald-300 border-emerald-300/40"
      : level === "MID"
      ? "bg-cyan-400/10 text-cyan-200 border-cyan-300/40"
      : "bg-amber-400/10 text-amber-200 border-amber-300/40";

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/60 px-3 py-3">
      <div>
        <p className="text-sm font-medium text-white/90">{labelJa}</p>
        <p className="font-mono text-[11px] tracking-[0.26em] text-white/45">
          {labelEn}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-orbitron text-lg text-white">
          {score}
          <span className="ml-0.5 text-xs text-white/60">/100</span>
        </span>
        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.18em] ${levelColor}`}
        >
          {level}
        </span>
      </div>
    </div>
  );
}

