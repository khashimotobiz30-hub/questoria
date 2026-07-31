import Image from "next/image";
import React from "react";

import { ResultCardDecor, resultCardShellClass } from "@/components/questoria/result/resultCardTheme";
import type { ResultType, ShareCompareCopy } from "@/types";

export function ShareSection({
  otherTypes: _otherTypes,
  typeImageMap: _typeImageMap,
  typeNameJaByResultType: _typeNameJaByResultType,
  copy: _copy,
  onShare,
  embedded,
}: {
  otherTypes: ResultType[];
  typeImageMap: Record<ResultType, string>;
  typeNameJaByResultType: Record<ResultType, string>;
  copy: ShareCompareCopy;
  onShare: () => void;
  /** 結果プレート内に埋め込む（外枠カードを弱める） */
  embedded?: boolean;
}) {
  const actions = (
    <div className="flex justify-center">
      <button
        type="button"
        className="group relative block w-full max-w-[15.5rem] overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/25 active:scale-[0.99] sm:max-w-[16.5rem]"
        onClick={onShare}
        aria-label="結果をシェア"
      >
        <div className="relative w-full [aspect-ratio:1024/300]">
          <Image
            src="/top/banners/share-result-plate.png"
            alt="結果をシェア"
            fill
            sizes="(min-width: 768px) 448px, 100vw"
            className="object-contain"
            style={{ filter: "contrast(1.02) saturate(0.98)" }}
            priority={false}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, rgba(230,197,90,0.07), rgba(0,229,255,0.045), transparent)",
          }}
          aria-hidden="true"
        />
      </button>
    </div>
  );

  return (
    <section className="space-y-5">
      {embedded ? (
        <div className="space-y-4">{actions}</div>
      ) : (
        <div className={resultCardShellClass("emphasis")}>
          <ResultCardDecor withRail />
          <div className="relative z-[1] space-y-4 p-5">{actions}</div>
        </div>
      )}
    </section>
  );
}
