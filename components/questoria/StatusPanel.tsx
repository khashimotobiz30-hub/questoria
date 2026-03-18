"use client";

type Row = {
  jp: string;
  en: string;
};

const ROWS: Row[] = [
  { jp: "目的定義力", en: "PURPOSE" },
  { jp: "設計力", en: "DESIGN" },
  { jp: "自律判断力", en: "DECISION" },
];

export default function StatusPanel() {
  return (
    <div className="mx-auto mt-7 w-full max-w-sm rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/5 p-4 text-left shadow-[0_0_12px_rgba(0,229,255,0.15)]">
      <div className="flex flex-col gap-3">
        {ROWS.map((row) => (
          <div key={row.en} className="flex items-center gap-3">
            <div className="min-w-[9.5rem]">
              <div
                className="text-xs tracking-[0.2em] text-[#00E5FF]"
                style={{ fontFamily: "var(--font-share-tech)" }}
              >
                <span className="mr-2 text-white/80">{row.jp}</span>
                <span className="text-[#00E5FF]/90">/ {row.en}</span>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-1 overflow-hidden">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="relative h-2 flex-1 overflow-hidden rounded-[2px] border border-[#00E5FF]/20 bg-[#00E5FF]/10"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-transparent via-[#00E5FF]/35 to-transparent"
                    style={{
                      animation: "scan 3.6s ease-in-out infinite",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div
              className="w-10 shrink-0 whitespace-nowrap text-sm tracking-[0.2em] text-[#FFD700]"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              ???
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
