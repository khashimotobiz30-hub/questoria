"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { LineCtaBannerSection } from "@/components/questoria/result/LineCtaBannerSection";
import { LineMeritBannerSection } from "@/components/questoria/result/LineMeritBannerSection";
import { LockedGuidePreviewSection } from "@/components/questoria/result/LockedGuidePreviewSection";
import { NextActionSection } from "@/components/questoria/result/NextActionSection";
import { ResultPlateSection } from "@/components/questoria/result/ResultPlateSection";
import { ResultHeroSection } from "@/components/questoria/result/ResultHeroSection";
import { ShareSection } from "@/components/questoria/result/ShareSection";
import { ShareModal } from "@/components/questoria/result/ShareModal";
import { TypeAnalysisSection } from "@/components/questoria/result/TypeAnalysisSection";
import { WhyThisTypeSection } from "@/components/questoria/result/WhyThisTypeSection";
import { LINE_ADD_FRIEND_URL } from "@/data/lineAddFriendUrl";
import { typeDetailMaster } from "@/data/typeDetailMaster";
import { typeMaster } from "@/data/typeMaster";
import { trackEvent } from "@/lib/analytics";
import { getLastLightResponseId, markLightResponseClickedLine } from "@/lib/lightResponseLog";
import { downloadLightResponseLogsCsv } from "@/lib/lightResponseLog";
import { markLightResponseClickedLineSupabase } from "@/lib/lightResponseLogSupabase";
import { clearStoredQuestoriaAnswers } from "@/lib/questoriaStorage";
import { readStoredDiagnosisResult } from "@/lib/readStoredDiagnosisResult";
import { readStoredLightDiagnosisResult } from "@/lib/readStoredLightDiagnosisResult";
import type {
  LightDiagnosisResult,
  StoredDiagnosisResult,
  ResultType,
  ShareCompareCopy,
  TypeAnalysisCopy,
} from "@/types";

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

function buildUnifiedShareText(typeNameJa: string) {
  return [
    "QUESTORIAのAIスキル診断をやってみた。",
    `私は「${typeNameJa}」タイプ。`,
    "あなたは何タイプ？",
    "#QUESTORIA #AIスキル診断",
  ].join("\n");
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

function readResultSession(source: "deep" | "light"): StoredDiagnosisResult | null {
  if (typeof window === "undefined") return null;
  return source === "light" ? readStoredLightDiagnosisResult() : readStoredDiagnosisResult();
}

export default function ResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const src = searchParams.get("src");
  const source: "deep" | "light" = src === "light" ? "light" : "deep";

  // Hydration-safe: keep SSR and first client render identical.
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<StoredDiagnosisResult | null>(null);
  const isReady = mounted && loaded && result !== null;

  const [glitchClearing, setGlitchClearing] = useState(true);
  const [glitchIntensity, setGlitchIntensity] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    // Avoid synchronous setState in effect (lint) and keep hydration stable.
    const t = window.setTimeout(() => {
      setMounted(true);
      const next = readResultSession(source);
      setResult(next);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, [source]);

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
      source,
    });
  }, [mounted, loaded, result, source]);

  // Keep first render stable (server/client). Only render after client has loaded session.
  if (!mounted || !loaded) return null;
  if (!result) return null;

  const typeData = typeMaster[result.resultType];
  const imageSrc = typeImageMap[result.resultType] ?? "/top/hero.jpg";
  const rootUrl = `${window.location.origin}/`;
  const isLight = (r: StoredDiagnosisResult): r is LightDiagnosisResult =>
    (r as LightDiagnosisResult).source === "light";
  const shareModeLabel = isLight(result)
    ? "LIGHT"
    : (result.mode ?? "work") === "life"
      ? "LIFE"
      : "WORK";
  const shareLandingUrl = `${window.location.origin}/share?type=${encodeURIComponent(
    result.resultType,
  )}&mode=${encodeURIComponent(shareModeLabel)}`;
  const shareText = buildUnifiedShareText(typeData.nameJa);
  const shareCopyText = `${shareText}\n${shareLandingUrl}`;

  const detail = typeDetailMaster[result.resultType];
  const typeAnalysisCopy = buildTypeAnalysisCopy(typeData, detail);
  const shareCompareCopy = buildShareCompareCopy(detail);
  const typeNameJaByResultType = ALL_RESULT_TYPES.reduce(
    (acc, k) => {
      acc[k] = typeMaster[k].nameJa;
      return acc;
    },
    {} as Record<ResultType, string>,
  );

  const displayScores = isLight(result)
    ? {
        purpose: result.normalizedScores.purpose,
        design: result.normalizedScores.design,
        decision: result.normalizedScores.judgment,
      }
    : result.normalizedScores;

  const displayLevels = isLight(result)
    ? {
        purpose: result.levels.purpose,
        design: result.levels.design,
        decision: result.levels.judgment,
      }
    : result.levels;

  const handleInviteFriends = () => {
    trackEvent("click_invite_friend", {
      type_id: result.resultType,
      result_type: result.resultType,
      title: typeData.nameJa,
      source,
    });
    const url = shareLandingUrl;
    void (async () => {
      try {
        if (navigator.share) {
          try {
            await navigator.share({
              title: "QUESTORIA",
              text: shareText,
              url,
            });
            return;
          } catch (e) {
            if ((e as Error).name === "AbortError") return;
          }
        }
        await navigator.clipboard.writeText(shareCopyText);
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
      source,
    });
    const url = shareLandingUrl;
    const text = shareText;
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(text);
    window.open(
      `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleCopyLink = async () => {
    trackEvent("click_share_copy_link", {
      type_id: result.resultType,
      result_type: result.resultType,
      title: typeData.nameJa,
      source_section: "share_modal",
      source,
    });
    const url = shareLandingUrl;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback: select/copy via prompt (least bad)
      window.prompt("リンクをコピーしてください", url);
    }
  };

  const handleSaveShareImage = async () => {
    trackEvent("click_share_save_image", {
      type_id: result.resultType,
      result_type: result.resultType,
      title: typeData.nameJa,
      source_section: "share_modal",
      source,
    });

    try {
      // 本命A（サーバー側OG生成）と同じ方式で、保存画像を生成してダウンロードする。
      const api = `/api/og/save?type=${encodeURIComponent(result.resultType)}&mode=${encodeURIComponent(
        shareModeLabel,
      )}`;
      const res = await fetch(api);
      if (!res.ok) throw new Error("og save fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "questoria-result.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // フォールバック: プレースホルダーを保存
      const downloadUrl = "/top/result-preview-origin.png";
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "questoria-result.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const handleGoDeeper = () => {
    router.push("/play?fresh=1");
  };

  return (
    <main
      className="relative min-h-[100svh] w-full overflow-hidden text-white"
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

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="px-4 pb-12 pt-4">
          <ResultPlateSection>
            <div className="py-4">
              <ResultHeroSection
                typeNameJa={typeData.nameJa}
                typeNameEn={typeData.nameEn}
                tagline={pickString(detail?.tagline, typeData.tagline)}
                imageSrc={imageSrc}
                colors={typeData.colors}
                scores={displayScores}
                levels={displayLevels}
                mode={isLight(result) ? undefined : result.mode ?? "work"}
                source={isLight(result) ? "light" : "deep"}
                overallComment={detail?.overallComment ?? typeData.overallComment}
                disableOverallClamp={detail != null}
                hideSkillStatusDescription
                embedded
                hideSkillStatus
              />
            </div>

            <div className="px-5 py-6">
              <ShareSection
                otherTypes={getOtherTypesForCompare(result.resultType)}
                typeImageMap={typeImageMap}
                typeNameJaByResultType={typeNameJaByResultType}
                copy={shareCompareCopy}
                onShare={() => setShareOpen(true)}
                source={isLight(result) ? "light" : "deep"}
                onDeeperDiagnosis={handleGoDeeper}
                embedded
              />
            </div>

            {/* 認知バナーは外枠に近づけつつ安全余白は残す */}
            <div className="px-2 py-6 sm:px-3">
              <LineMeritBannerSection />
            </div>

            <div className="px-5 py-7">
              <WhyThisTypeSection summaryOverride={detail?.judgementReason} hideCoreLabel embedded />
            </div>
            <div className="px-5 py-6">
              <TypeAnalysisSection
                copy={typeAnalysisCopy}
                hideIntro
                hideGrowth
                hideTierLabel
                unifyItemTitleTone
                openRiskPointByDefault
                hideRiskPointClosedPreview
                embedded
              />
            </div>
            <div className="px-5 py-7">
              <NextActionSection
                title={detail?.nextActionTitle ?? "AI活用の際に意識するべきこと"}
                riskPoint={pickString(detail?.riskPoint, typeData.riskPoint)}
                growth={pickString(detail?.growth, typeData.description.growth)}
                lead={pickString(detail?.nextActionLead, typeData.nextActionLead)}
                bodyOverride={detail?.nextActionBody}
                immediateActionOverride={detail?.nextActionImmediateAction}
                nextActions={
                  detail?.nextActions
                    ? Array.from(detail.nextActions)
                    : typeData.nextActions && typeData.nextActions.length > 0
                      ? typeData.nextActions
                      : undefined
                }
                embedded
              />
            </div>
            <div className="px-5 py-7">
              <LockedGuidePreviewSection embedded lineUrl={LINE_ADD_FRIEND_URL} />
            </div>
            {/* 本命CTAはプレート内で横幅を少し広げる（安全余白は残す） */}
            <div className="px-3 py-7 sm:px-4">
              <LineCtaBannerSection
                lineUrl={LINE_ADD_FRIEND_URL}
                onClick={() =>
                  (() => {
                    trackEvent("click_line_banner_cta", {
                      type_id: result.resultType,
                      result_type: result.resultType,
                      title: typeData.nameJa,
                      source_section: "line_banner_cta",
                      source,
                    });
                    const lastLightId = getLastLightResponseId();
                    if (lastLightId) {
                      markLightResponseClickedLine(lastLightId);
                      void markLightResponseClickedLineSupabase(lastLightId);
                    }
                  })()
                }
              />
            </div>
          </ResultPlateSection>

          <ShareModal
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            preview={{
              typeNameJa: typeData.nameJa,
              typeNameEn: typeData.nameEn,
              imageSrc,
              tagline: pickString(detail?.tagline, typeData.tagline),
            }}
            onShareX={handleShareX}
            onCopyLink={handleCopyLink}
            onSaveImage={handleSaveShareImage}
          />

          {searchParams.get("export") === "1" ? (
            <div className="pt-2">
              <button
                type="button"
                className="w-full rounded-xl border border-white/18 bg-black/22 px-4 py-3 font-mono text-[12px] tracking-[0.16em] text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition hover:border-white/24 hover:bg-black/28 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35"
                onClick={() => downloadLightResponseLogsCsv()}
              >
                診断ログをダウンロード（CSV）
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

