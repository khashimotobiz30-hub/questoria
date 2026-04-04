"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DeeperGuideSection } from "@/components/questoria/result/DeeperGuideSection";
import { NextActionSection } from "@/components/questoria/result/NextActionSection";
import { ResultHeroSection } from "@/components/questoria/result/ResultHeroSection";
import { ShareSection } from "@/components/questoria/result/ShareSection";
import { TypeAnalysisSection } from "@/components/questoria/result/TypeAnalysisSection";
import { WhyThisTypeSection } from "@/components/questoria/result/WhyThisTypeSection";
import { LINE_ADD_FRIEND_URL } from "@/data/lineAddFriendUrl";
import { typeDetailMaster } from "@/data/typeDetailMaster";
import { typeMaster } from "@/data/typeMaster";
import { trackEvent } from "@/lib/analytics";
import { parseStoredDiagnosisResult } from "@/lib/parseStoredDiagnosisResult";
import type {
  DiagnosisResult,
  DeeperGuideCopy,
  ResultType,
  ShareCompareCopy,
  TypeAnalysisCopy,
} from "@/types";

const SESSION_KEY_RESULT = "questoria_result";

const TYPE_ANALYSIS_PLACEHOLDER =
  "この項目の解説は準備中です。次の画面改修で本文を追記予定です。";

const ALL_RESULT_TYPES: ResultType[] = [
  "hero",
  "sage",
  "hunter",
  "prophet",
  "artisan",
  "wizard",
  "pioneer",
  "origin",
];

/** purpose / design / decision の High/Low（Play の分類と同一） */
const RESULT_TYPE_BITS: Record<ResultType, [0 | 1, 0 | 1, 0 | 1]> = {
  hero: [1, 1, 1],
  sage: [1, 1, 0],
  hunter: [1, 0, 1],
  prophet: [1, 0, 0],
  artisan: [0, 1, 1],
  wizard: [0, 1, 0],
  pioneer: [0, 0, 1],
  origin: [0, 0, 0],
};

const BITS_TO_RESULT_TYPE = Object.fromEntries(
  (Object.entries(RESULT_TYPE_BITS) as [ResultType, [0 | 1, 0 | 1, 0 | 1]][]).map(
    ([type, bits]) => [bits.join(","), type],
  ),
) as Record<string, ResultType>;

function flipBit(v: 0 | 1): 0 | 1 {
  return v === 1 ? 0 : 1;
}

/** 比較用に4タイプ：各軸を1つだけ反転させた3件＋3軸すべて反転の対極1件（同一診断ロジック上の近傍＋対比） */
function getOtherTypesForCompare(current: ResultType): ResultType[] {
  const [p, d, j] = RESULT_TYPE_BITS[current];
  const a = BITS_TO_RESULT_TYPE[[flipBit(p), d, j].join(",")];
  const b = BITS_TO_RESULT_TYPE[[p, flipBit(d), j].join(",")];
  const c = BITS_TO_RESULT_TYPE[[p, d, flipBit(j)].join(",")];
  const opposite = BITS_TO_RESULT_TYPE[[flipBit(p), flipBit(d), flipBit(j)].join(",")];
  return [a, b, c, opposite];
}

function pickString(...candidates: (string | undefined)[]): string {
  for (const c of candidates) {
    const v = c?.trim();
    if (v) return v;
  }
  return "";
}

function buildTypeAnalysisCopy(
  typeData: (typeof typeMaster)[ResultType],
  detail: (typeof typeDetailMaster)[ResultType] | undefined,
): TypeAnalysisCopy {
  return {
    essence:
      pickString(detail?.essence, typeData.description.essence) || TYPE_ANALYSIS_PLACEHOLDER,
    strength:
      pickString(detail?.strength, typeData.description.strength) || TYPE_ANALYSIS_PLACEHOLDER,
    growth: pickString(detail?.growth, typeData.description.growth) || TYPE_ANALYSIS_PLACEHOLDER,
    thinkingPattern:
      pickString(detail?.thinkingPattern, typeData.thinkingPattern) || TYPE_ANALYSIS_PLACEHOLDER,
    workStyle: pickString(detail?.workStyle, typeData.workStyle) || TYPE_ANALYSIS_PLACEHOLDER,
    riskPoint: pickString(detail?.riskPoint, typeData.riskPoint) || TYPE_ANALYSIS_PLACEHOLDER,
  };
}

function buildDeeperGuideCopy(
  detail: (typeof typeDetailMaster)[ResultType] | undefined,
): DeeperGuideCopy {
  const foot = detail?.lineWelcomeSummary?.trim();
  return {
    title: pickString(detail?.deeperGuideTitle, "さらに詳しく知る"),
    description: pickString(
      detail?.deeperGuideText,
      "この画面では載せきれない深掘り（つまずきやすい場面の整理、タイプに合わせた進め方、行動を成果につなげるヒントなど）を、LINEで詳細レポートとして受け取れます。友だち追加後は、この診断の続きとして自然に読める体裁でお届けします。",
    ),
    buttonLabel: pickString(detail?.deeperGuideLabel, "LINEで詳細レポートを受け取る"),
    footnote: foot || undefined,
  };
}

function buildShareCompareCopy(
  detail: (typeof typeDetailMaster)[ResultType] | undefined,
): ShareCompareCopy {
  return {
    lead: pickString(
      detail?.shareLead,
      "スタート地点は人それぞれです。友達や同僚の結果と見比べると、立ち位置が整理されやすくなります。",
    ),
    compareHint: pickString(
      detail?.shareText,
      "まずは診断リンクを送り、感想を交換してみるのがおすすめです。",
    ),
  };
}

const typeImageMap: Record<ResultType, string> = {
  hero: "/top/hero.jpg",
  sage: "/top/sage.jpg",
  hunter: "/top/hunter.jpg",
  prophet: "/top/prophet.jpg",
  artisan: "/top/artisan.jpg",
  wizard: "/top/wizard.jpg",
  pioneer: "/top/pioneer.jpg",
  origin: "/top/origin.jpg",
};

function readResultSession(): DiagnosisResult | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(SESSION_KEY_RESULT);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    return parseStoredDiagnosisResult(parsed);
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

  useEffect(() => {
    if (!mounted || !loaded || result === null) return;
    const rt = result.resultType;
    try {
      const key = `questoria_ga_result_view_${rt}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* sessionStorage 不可時は重複送信の可能性あり */
    }
    const td = typeMaster[rt];
    const det = typeDetailMaster[rt];
    trackEvent("result_view", {
      type_id: rt,
      result_type: rt,
      title: pickString(det?.title, td.nameJa),
    });
  }, [mounted, loaded, result]);

  // Keep first render stable (server/client). Only render after client has loaded session.
  if (!mounted || !loaded) return null;
  if (!result) return null;

  const typeData = typeMaster[result.resultType];
  const imageSrc = typeImageMap[result.resultType] ?? "/top/hero.jpg";

  const detail = typeDetailMaster[result.resultType];
  const typeAnalysisCopy = buildTypeAnalysisCopy(typeData, detail);
  const deeperGuideCopy = buildDeeperGuideCopy(detail);
  const shareCompareCopy = buildShareCompareCopy(detail);
  const typeNameJaByResultType = ALL_RESULT_TYPES.reduce(
    (acc, k) => {
      acc[k] = typeMaster[k].nameJa;
      return acc;
    },
    {} as Record<ResultType, string>,
  );

  const handleInviteFriends = () => {
    trackEvent("click_invite_friend", {
      type_id: result.resultType,
      result_type: result.resultType,
      title: typeData.nameJa,
    });
    const url = `${window.location.origin}/`;
    void (async () => {
      try {
        if (navigator.share) {
          try {
            await navigator.share({
              title: "QUESTORIA",
              text: `${typeData.nameJa}タイプの診断結果`,
              url,
            });
            return;
          } catch (e) {
            if ((e as Error).name === "AbortError") return;
          }
        }
        await navigator.clipboard.writeText(url);
      } catch {
        /* noop */
      }
    })();
  };

  const handleShareX = () => {
    trackEvent("click_share_x", {
      type_id: result.resultType,
      result_type: result.resultType,
      title: typeData.nameJa,
    });
    const url = window.location.origin + "/";
    const text = `QUESTORIA — ${typeData.nameJa}タイプでした。`;
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?text=${t}&url=${u}`, "_blank", "noopener,noreferrer");
  };

  const handleRerun = () => {
    trackEvent("click_retry_diagnosis", {
      type_id: result.resultType,
      result_type: result.resultType,
      title: typeData.nameJa,
    });
    try {
      sessionStorage.removeItem(SESSION_KEY_RESULT);
    } catch {
      /* noop */
    }
    router.push("/");
  };

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
          tagline={pickString(detail?.tagline, typeData.tagline)}
          imageSrc={imageSrc}
          colors={typeData.colors}
          scores={result.normalizedScores}
          levels={result.levels}
          overallComment={detail?.overallComment ?? typeData.overallComment}
          disableOverallClamp={detail != null}
        />

        <div className="space-y-8 px-4 pb-12 pt-6">
          <WhyThisTypeSection
            judgementReason={detail?.judgementReason}
            highAxisReason={detail?.highAxisReason}
            lowAxisReason={detail?.lowAxisReason}
            combinationInsight={detail?.combinationInsight}
            profileSummary={detail?.profileSummary ?? typeData.profileSummary}
          />

          <TypeAnalysisSection copy={typeAnalysisCopy} />

          <NextActionSection
            lead={detail?.nextActionLead}
            nextActions={
              detail?.nextActions
                ? Array.from(detail.nextActions)
                : typeData.nextActions && typeData.nextActions.length > 0
                  ? typeData.nextActions
                  : undefined
            }
            note={detail?.nextActionNote}
          />

          <DeeperGuideSection
            copy={deeperGuideCopy}
            lineUrl={LINE_ADD_FRIEND_URL}
            onLineCtaClick={() =>
              trackEvent("click_line_deeper_guide", {
                type_id: result.resultType,
                result_type: result.resultType,
                title: typeData.nameJa,
                source_section: "deeper_guide",
              })
            }
          />

          <ShareSection
            otherTypes={getOtherTypesForCompare(result.resultType)}
            typeImageMap={typeImageMap}
            typeNameJaByResultType={typeNameJaByResultType}
            copy={shareCompareCopy}
            onInviteFriends={handleInviteFriends}
            onShareX={handleShareX}
            onRerun={handleRerun}
          />
        </div>
      </div>
    </main>
  );
}
