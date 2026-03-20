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

const ALL_TYPES: ResultType[] = [
  "hero","sage","berserker","oracle",
  "artisan","wizard","pioneer","origin"
];

const typeNameMap: Record<ResultType, string> = {
  hero: "勇者", sage: "賢者", berserker: "狂戦士", oracle: "占い師",
  artisan: "鍛冶師", wizard: "魔法使い", pioneer: "冒険者", origin: "はじまりの者",
};

function openXShare(text: string) {
  const encoded = encodeURIComponent(text);
  const url = `https://twitter.com/intent/tweet?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function ResultPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [glitchClearing, setGlitchClearing] = useState(true);
  const [glitchIntensity, setGlitchIntensity] = useState(1);
  const [otherTypes, setOtherTypes] = useState<ResultType[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY_RESULT);
    if (!raw) { router.replace("/quest"); return; }
    try {
      const parsed = JSON.parse(raw) as DiagnosisResult;
      setResult(parsed);
      // 自分以外からランダム4タイプ
      const others = ALL_TYPES
        .filter(t => t !== parsed.resultType)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      setOtherTypes(others);
      setIsReady(true);
    } catch {
      router.replace("/quest");
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const t1 = setTimeout(() => setGlitchIntensity(0.4), 400);
    const t2 = setTimeout(() => setGlitchIntensity(0.1), 1200);
    const t3 = setTimeout(() => setGlitchClearing(false), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isReady]);

  if (!isReady || !result) return null;

  const typeData = typeMaster[result.resultType];
  const imageSrc = typeImageMap[result.resultType] ?? "/top/hero.jpg";
  const questLabel = result.questType === "business" ? "BUSINESS QUEST" : "DAILY QUEST";
  const questLabelJa = result.questType === "business" ? "ビジネスクエスト" : "日常クエスト";

  const shareTextInviteFriends = `QUESTORIAのAIスキル診断やってみた。\n私は「${typeData.nameJa}」。\nあなたは何タイプ？\n#QUESTORIA #AIスキル診断\nquestoria.app`;

  return (
    <main
      className="min-h-[100svh] w-full bg-[#0A0A0F] text-white"
      style={{
        filter: glitchClearing ? `blur(${glitchIntensity * 1.5}px)` : "none",
        transition: "filter 0.6s ease",
      }}
    >
      {/* グリッチノイズオーバーレイ */}
      {glitchClearing && (
        <div className="pointer-events-none fixed inset-0 z-50"
          style={{ opacity: glitchIntensity, transition: "opacity 0.6s ease" }}>
          <div style={{ position:"absolute", inset:0,
            background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,229,255,0.05) 2px,rgba(0,229,255,0.05) 3px)" }} />
          <div style={{ position:"absolute", inset:0,
            background:"repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(255,0,60,0.02) 4px,rgba(255,0,60,0.02) 5px)" }} />
        </div>
      )}

      <div className="mx-auto w-full max-w-md">

        {/* ── ヒーローセクション ── */}
        <div className="relative w-full overflow-hidden" style={{ height: "75svh" }}>

          <Image
            src={imageSrc}
            alt={typeData.nameJa}
            fill
            sizes="(min-width: 768px) 448px, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 15%", filter: "brightness(1.3)" }}
            priority
          />

          {/* 上部グラデーション */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
          {/* 下部グラデーション */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{ height:"60%", background:"linear-gradient(to top, #0A0A0F 20%, rgba(10,10,15,0.6) 55%, transparent 100%)" }} />

          {/* 上部バー：ロゴ＋バッジ */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-4 z-10">
           
            <span className="font-mono text-xs tracking-[0.3em] text-[#FFD700]"
              style={{ textShadow:"0 0 10px rgba(255,215,0,0.9), 0 0 20px rgba(255,215,0,0.4)" }}>
              QUESTORIA
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-300 px-2 py-0.5 bg-black/60 backdrop-blur-sm"
              style={{ border:"1px solid rgba(0,229,255,0.7)", boxShadow:"0 0 10px rgba(0,229,255,0.3), inset 0 0 8px rgba(0,229,255,0.05)" }}>
              QUEST COMPLETE
            </span>
          </div>

          {/* タイプ名オーバーレイ */}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-6 z-10">
            {/* クエスト種別バッジ */}
            <div className="mb-2 inline-flex items-center gap-1.5">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 border border-white/20 px-2 py-0.5 rounded-sm bg-black/40">
                {questLabel}
              </span>
            </div>
            <p className="font-mono text-[11px] tracking-[0.28em] text-cyan-300/90 mb-2"
              style={{ textShadow:"0 0 8px rgba(0,229,255,0.6)" }}>
              // YOUR CLASS //
            </p>
            <h1
              className="font-orbitron text-5xl font-black leading-none tracking-wide text-[#FFD700]"
              style={{ textShadow:"0 0 40px rgba(255,215,0,0.6), 0 0 80px rgba(255,215,0,0.2), 0 2px 12px rgba(0,0,0,0.9)" }}
            >
              {typeData.nameJa}
            </h1>
            <p className="mt-2 font-mono text-sm tracking-[0.3em] text-white/50">
              — {typeData.nameEn} —
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/75 border-l-2 border-cyan-400/60 pl-3">
              {typeData.tagline}
            </p>
          </div>
        </div>

        {/* ── コンテンツ部 ── */}
        <div className="px-4 pb-12 pt-2 space-y-6">

          {/* スキルバー */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0B1224]/80 to-black/60 p-5 shadow-[0_0_30px_rgba(0,229,255,0.05)] backdrop-blur">
            <p className="font-mono text-[11px] tracking-[0.28em] text-white/75 mb-5">
              // SKILL STATUS //
            </p>
            <div className="space-y-4">
              <SkillBar label="目的定義力" score={result.normalizedScores.purpose} level={result.levels.purpose} />
              <SkillBar label="設計力" score={result.normalizedScores.design} level={result.levels.design} />
              <SkillBar label="自律判断力" score={result.normalizedScores.decision} level={result.levels.decision} />
            </div>
          </div>

          {/* 説明文 */}
          <div className="space-y-3">
            <div className="rounded-xl border border-[#FFD700]/25 bg-gradient-to-b from-[#FFD700]/8 to-[#FFD700]/3 p-4 shadow-[0_0_20px_rgba(255,215,0,0.05)]">
              <p className="font-mono text-xs tracking-[0.24em] text-[#FFD700] mb-2"
                style={{ textShadow:"0 0 8px rgba(255,215,0,0.5)" }}>ESSENCE</p>
              <p className="text-sm leading-relaxed text-white/80">{typeData.description.essence}</p>
            </div>
            <div className="rounded-xl border border-cyan-300/25 bg-gradient-to-b from-cyan-300/8 to-cyan-300/3 p-4 shadow-[0_0_20px_rgba(0,229,255,0.05)]">
              <p className="font-mono text-xs tracking-[0.24em] text-cyan-300 mb-2"
                style={{ textShadow:"0 0 8px rgba(0,229,255,0.5)" }}>STRENGTH</p>
              <p className="text-sm leading-relaxed text-white/80">{typeData.description.strength}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-gradient-to-b from-white/6 to-white/2 p-4">
              <p className="font-mono text-xs tracking-[0.24em] text-white/70 mb-2">GROWTH</p>
              <p className="text-sm leading-relaxed text-white/80">{typeData.description.growth}</p>
            </div>
          </div>

         

          {/* COMPARE */}
          <div className="rounded-2xl border border-[#FFD700]/20 bg-gradient-to-b from-[#FFD700]/8 to-transparent p-5 shadow-[0_0_30px_rgba(255,215,0,0.05)]">
            <p className="text-center font-mono text-xs tracking-[0.3em] text-[#FFD700] mb-3"
              style={{ textShadow:"0 0 8px rgba(255,215,0,0.5)" }}>
              COMPARE
            </p>
            <div className="space-y-1 text-center text-sm leading-relaxed text-white/75">
              <p>あなたの友達は何タイプ？</p>
              <p>勇者？ 賢者？ それとも魔法使い？</p>
              <p>結果を比べてみよう。</p>
            </div>
            <button type="button"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-cyan-300/30 bg-black/50 px-4 py-3 text-sm font-semibold tracking-wide text-white/95 shadow-[0_0_24px_rgba(0,229,255,0.08)] transition hover:border-cyan-300/50 hover:bg-black/60"
              onClick={() => openXShare(shareTextInviteFriends)}>
              ▶ 友達にも診断させる
            </button>
          </div>

 {/* 他タイプちら見せ */}
 <div className="rounded-2xl border border-white/20 bg-gradient-to-b from-white/4 to-transparent p-5">
            <p className="font-mono text-[11px] tracking-[0.28em] text-white/50 mb-4">
              // OTHER TYPES //
            </p>
            <div className="grid grid-cols-4 gap-2">
              {otherTypes.map(type => (
                <div key={type} className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  onClick={() => router.push("/")}>
                  <div className="relative w-full aspect-square overflow-hidden rounded-lg border border-white/10 group-hover:border-cyan-300/40 transition">
                    <Image
                      src={typeImageMap[type]}
                      alt={typeNameMap[type]}
                      fill
                      className="object-cover object-top"
                      style={{ filter:"brightness(1.0) grayscale(0.1)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <span className="text-[10px] text-white/75 group-hover:text-white/100 transition text-center leading-tight">
                    {typeNameMap[type]}
                  </span>
                </div>
              ))}
            </div>
          <button
  type="button"
  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#FFD700]/40 bg-black/50 px-4 py-3 text-sm font-semibold text-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.1)] transition hover:border-[#FFD700]/70 hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]"
  style={{ textShadow:"0 0 10px rgba(255,215,0,0.5)" }}
  onClick={() => router.push("/")}
>
  他のタイプが気になる？<br />クリックしてもう一度診断してみよう！
</button>
          </div>
          

        </div>
      </div>
    </main>
  );
}

type Level = "HIGH" | "MID" | "LOW";

function SkillBar({ label, score, level }: { label: string; score: number; level: Level }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(t);
  }, []);

  const barColor = level === "HIGH"
    ? { bar: "#FFD700", glow: "rgba(255,215,0,0.6)", text: "#FFD700" }
    : level === "MID"
    ? { bar: "#C8A800", glow: "rgba(200,168,0,0.4)", text: "#C8A800" }
    : { bar: "#6B5900", glow: "rgba(107,89,0,0.3)", text: "#6B5900" };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">{label}</span>
        <span className="font-mono text-sm font-bold" style={{ color: barColor.text }}>
          {score}
        </span>
      </div>
      <div className="relative h-[6px] w-full rounded-full bg-white/10 overflow-hidden">
        <div className="absolute inset-0 rounded-full"
          style={{ background:"linear-gradient(90deg, rgba(255,215,0,0.05), transparent)" }} />
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${score}%` : "0%",
            background: `linear-gradient(90deg, ${barColor.bar}88, ${barColor.bar})`,
            boxShadow: `0 0 8px ${barColor.glow}, 0 0 16px ${barColor.glow}`,
          }}
        />
      </div>
    </div>
  );
}