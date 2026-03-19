"use client";

type Row = { jp: string; en: string; };

const ROWS: Row[] = [
  { jp: "目的定義力", en: "PURPOSE" },
  { jp: "設計力",    en: "DESIGN" },
  { jp: "自律判断力", en: "DECISION" },
];

export default function StatusPanel() {
  return (
    <div
      className="mx-auto mt-7 w-full max-w-sm border border-[#FFD700]/30 bg-black/60 p-4 text-left"
      style={{ boxShadow:"0 0 20px rgba(255,215,0,0.08), inset 0 0 20px rgba(0,0,0,0.4)" }}
    >
      {/* ヘッダー */}
      <p className="font-mono text-[11px] tracking-[0.28em] text-white/75 mb-4">
  // SKILL STATUS //
</p>

      <div className="flex flex-col gap-4">
        {ROWS.map((row) => (
          <div key={row.en} className="flex items-center gap-3">
            {/* ラベル */}
            <div className="w-20 shrink-0">
              <span className="text-xs font-bold tracking-wide text-white/90"
                style={{ fontFamily:"var(--font-noto)" }}>
                {row.jp}
              </span>
            </div>

            {/* ゲージ本体 */}
            <div className="relative flex-1 h-[6px] bg-[#FFD700]/10 border border-[#FFD700]/25 overflow-hidden">
              {/* スキャン光 */}
              <div
                className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"
                style={{ animation:"scanBar 2.5s ease-in-out infinite" }}
              />
              {/* 縦ライン（目盛り） */}
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-[#FFD700]/20"
                  style={{ left:`${(i + 1) * 10}%` }}
                />
              ))}
            </div>

            {/* ??? */}
            <div className="w-8 shrink-0 text-right font-mono text-[11px] tracking-wider text-[#FFD700]/80"
  style={{ fontFamily:"var(--font-orbitron)" }}>
  ???
</div>
          </div>
        ))}
      </div>
    </div>
  );
}