"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { NextActionSection } from "@/components/questoria/result/NextActionSection";
import { ResultBackplate } from "@/components/questoria/result/ResultBackplate";
import { ResultHeroSection } from "@/components/questoria/result/ResultHeroSection";
import { ShareSection } from "@/components/questoria/result/ShareSection";
import { ThinkingProfileSection } from "@/components/questoria/result/ThinkingProfileSection";
import { TypeAnalysisSection } from "@/components/questoria/result/TypeAnalysisSection";
import { typeMaster } from "@/data/typeMaster";
import type { DiagnosisResult, ResultType } from "@/types";

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

function readResultSession(): DiagnosisResult | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(SESSION_KEY_RESULT);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as DiagnosisResult;
    if (!parsed?.resultType || !parsed?.answers || parsed.answers.length !== 12) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export default function ResultPage() {
  const router = useRouter();

  // Hydration-safe: keep SSR and first client render identical.
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const isReady = mounted && loaded && result !== null;

  const otherTypes = useMemo(() => {
    if (!result) return [];

    const otherTypeMap: Record<ResultType, ResultType[]> = {
      hero: ["sage", "berserker", "artisan", "wizard"],
      sage: ["hero", "oracle", "wizard", "artisan"],
      berserker: ["hero", "pioneer", "artisan", "oracle"],
      oracle: ["sage", "hero", "wizard", "origin"],
      artisan: ["hero", "wizard", "berserker", "sage"],
      wizard: ["sage", "artisan", "oracle", "hero"],
      pioneer: ["berserker", "hero", "origin", "artisan"],
      origin: ["oracle", "pioneer", "wizard", "sage"],
    };

    return otherTypeMap[result.resultType];
  }, [result]);

  const [glitchClearing, setGlitchClearing] = useState(true);
  const [glitchIntensity, setGlitchIntensity] = useState(1);

  useEffect(() => {
    // Avoid synchronous setState in effect (lint) and keep hydration stable.
    const t = window.setTimeout(() => {
      setMounted(true);
      const next = readResultSession();
      setResult(next);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted || !loaded) return;
    if (result === null) {
      router.replace("/");
    }
  }, [loaded, mounted, result, router]);

  useEffect(() => {
    if (!isReady) return;

    const t1 = setTimeout(() => setGlitchIntensity(0.4), 400);
    const t2 = setTimeout(() => setGlitchIntensity(0.1), 1200);
    const t3 = setTimeout(() => setGlitchClearing(false), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isReady]);

  // Keep first render stable (server/client). Only render after client has loaded session.
  if (!mounted || !loaded) return null;
  if (!result) return null;

  const typeData = typeMaster[result.resultType];
  const imageSrc = typeImageMap[result.resultType] ?? "/top/hero.jpg";

  const shareTextInviteFriends = `QUESTORIAのAIスキル診断やってみた。
私は「${typeData.nameJa}」。
あなたは何タイプ？
#QUESTORIA #AIスキル診断
https://questoria-liart.vercel.app`;

  const shareTextResult = `QUESTORIAのAIスキル診断 結果：
私は「${typeData.nameJa}（${typeData.nameEn}）」。
#QUESTORIA #AIスキル診断
https://questoria-liart.vercel.app`;

  return (
    <main
      className="min-h-[100svh] w-full bg-[#0A0A0F] text-white"
      style={{
        filter: glitchClearing ? `blur(${glitchIntensity * 1.5}px)` : "none",
        transition: "filter 0.6s ease",
      }}
    >
      {glitchClearing && (
        <div
          className="pointer-events-none fixed inset-0 z-50"
          style={{ opacity: glitchIntensity, transition: "opacity 0.6s ease" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,229,255,0.05) 2px,rgba(0,229,255,0.05) 3px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(255,0,60,0.02) 4px,rgba(255,0,60,0.02) 5px)",
            }}
          />
        </div>
      )}

      <div className="mx-auto w-full max-w-md">
        <ResultHeroSection
          typeNameJa={typeData.nameJa}
          typeNameEn={typeData.nameEn}
          tagline={typeData.tagline}
          imageSrc={imageSrc}
          colors={typeData.colors}
          scores={result.normalizedScores}
          levels={result.levels}
          overallComment={typeData.overallComment}
        />

        <ResultBackplate>
          <div className="space-y-8 px-4 pb-12 pt-6">
            <ThinkingProfileSection
              axes={[
                {
                  key: "purpose",
                  title: "目的定義力",
                  description: "何を解くべきかを見極める力",
                  score: result.normalizedScores.purpose,
                  level: result.levels.purpose,
                  comment:
                    result.levels.purpose === "HIGH"
                      ? "論点を早めに言語化でき、迷いを減らしやすいです。"
                      : result.levels.purpose === "MID"
                        ? "短い言語化を挟むと、精度が上がります。"
                        : "最初の1文が曖昧だと、ブレやすいです。",
                },
                {
                  key: "design",
                  title: "設計力",
                  description: "AI活用の進め方を組み立てる力",
                  score: result.normalizedScores.design,
                  level: result.levels.design,
                  comment:
                    result.levels.design === "HIGH"
                      ? "AIの使いどころを分解し、手順化が得意です。"
                      : result.levels.design === "MID"
                        ? "迷ったら「入力→出力→検証」で安定します。"
                        : "最初に一度だけ手順化すると、安定します。",
                },
                {
                  key: "decision",
                  title: "自律判断力",
                  description: "情報を鵜呑みにせず自分で決める力",
                  score: result.normalizedScores.decision,
                  level: result.levels.decision,
                  comment:
                    result.levels.decision === "HIGH"
                      ? "意思決定を自分で握り、AIを材料にできます。"
                      : result.levels.decision === "MID"
                        ? "基準を1つ決めてから見ると、迷いが減ります。"
                        : "先に“決める軸”を置くと、安定します。",
                },
              ]}
              profileSummary={typeData.profileSummary}
            />

            <TypeAnalysisSection typeData={typeData} />

            <NextActionSection
              nextActions={typeData.nextActions}
              message="3つ全部やる必要はありません。まずは1つだけ、今日の仕事に混ぜてみてください。"
            />

            <ShareSection
              otherTypes={otherTypes}
              typeImageMap={typeImageMap}
              onShareX={() => openXShare(shareTextResult)}
              onInviteFriends={() => openXShare(shareTextInviteFriends)}
              onRerun={() => router.push("/")}
            />
          </div>
        </ResultBackplate>
      </div>
    </main>
  );
}
