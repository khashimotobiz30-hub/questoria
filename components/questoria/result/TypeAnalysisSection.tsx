import React, { useMemo, useState } from "react";

type Item = {
  id: string;
  title: string;
  body?: string;
  defaultOpen?: boolean;
  showPreviewWhenClosed?: boolean;
  tone?: "primary" | "secondary";
};

function oneLinePreview(text: string, maxChars = 44) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars)}…`;
}

function AccordionItem({ item }: { item: Item }) {
  const [open, setOpen] = useState(Boolean(item.defaultOpen));
  const preview =
    !open && item.showPreviewWhenClosed && item.body ? oneLinePreview(item.body) : "";
  const isSecondary = item.tone === "secondary";
  const isPrimary = item.tone === "primary";

  return (
    <div
      className={[
        "relative rounded-2xl border bg-black/30 transition-all duration-200",
        isPrimary
          ? "border-white/12 bg-gradient-to-b from-white/7 to-black/30 shadow-[0_0_40px_rgba(255,215,0,0.05)]"
          : "border-white/10",
        isSecondary ? "opacity-90" : "",
        open && isPrimary ? "shadow-[0_0_60px_rgba(255,215,0,0.10)]" : "",
        open && isSecondary ? "border-white/15" : "",
      ].join(" ")}
    >
      {isPrimary ? (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-10"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,215,0,0.10), rgba(0,229,255,0.06), transparent)",
              opacity: 0.75,
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-3 left-0 w-[2px] rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,215,0,0.0), rgba(255,215,0,0.65), rgba(0,229,255,0.25), rgba(255,215,0,0.0))",
              boxShadow: "0 0 18px rgba(255,215,0,0.18)",
            }}
          />
        </>
      ) : null}
      <button
        type="button"
        className={`flex w-full items-center justify-between gap-3 text-left ${
          isSecondary ? "px-4 py-3" : "px-4 py-4"
        }`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          {!isSecondary ? (
            <p className="font-mono text-[11px] tracking-[0.28em] text-white/55">
              {"// TYPE ANALYSIS //"}
            </p>
          ) : null}
          <div className="mt-1 flex items-center gap-2">
            {isSecondary ? (
              <span className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-white/55">
                NOTE
              </span>
            ) : null}
            {isPrimary ? (
              <span className="rounded-full border border-[#FFD700]/22 bg-[#FFD700]/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-[#FFD700]">
                CORE
              </span>
            ) : null}
            <p
              className={`font-semibold ${isPrimary ? "text-[#FFD700]" : "text-white/90"} ${
                isSecondary ? "text-[13px]" : "text-sm"
              }`}
            >
              {item.title}
            </p>
          </div>
          {preview ? (
            <p className="mt-1 line-clamp-1 text-[12px] leading-relaxed text-white/55">
              {preview}
            </p>
          ) : null}
        </div>
        <span
          className={`shrink-0 rounded-lg border px-2 py-2 transition-all ${
            isPrimary
              ? "border-white/12 bg-black/35 text-white/70"
              : "border-white/10 bg-black/25 text-white/55"
          } ${open ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-all duration-200 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className={`px-4 ${isSecondary ? "pb-3" : "pb-4"}`}>
            {item.body ? (
              <p
                className={`whitespace-pre-line leading-relaxed ${
                  isSecondary ? "text-[13px] text-white/70" : "text-sm text-white/75"
                }`}
              >
                {item.body}
              </p>
            ) : (
              <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-3">
                <p className="text-sm text-white/60">TODO: このタイプの文章を追加予定</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TypeAnalysisSection({
  typeData,
}: {
  typeData: {
    description: { essence: string; strength: string; growth: string };
    thinkingPattern?: string;
    workStyle?: string;
    riskPoint?: string;
  };
}) {
  const items = useMemo<Item[]>(
    () => [
      {
        id: "essence",
        title: "ESSENCE（本質）",
        body: typeData.description.essence,
        defaultOpen: true,
        tone: "primary",
      },
      {
        id: "strength",
        title: "STRENGTH（強み）",
        body: typeData.description.strength,
        defaultOpen: true,
        tone: "primary",
      },
      {
        id: "thinkingPattern",
        title: "THINKING PATTERN（思考パターン）",
        body: typeData.thinkingPattern,
        showPreviewWhenClosed: true,
        tone: "secondary",
      },
      {
        id: "workStyle",
        title: "WORK STYLE（働き方）",
        body: typeData.workStyle,
        showPreviewWhenClosed: true,
        tone: "secondary",
      },
      {
        id: "riskPoint",
        title: "RISK POINT（注意ポイント）",
        body: typeData.riskPoint,
        showPreviewWhenClosed: true,
        tone: "secondary",
      },
      {
        id: "growth",
        title: "GROWTH（伸びしろ）",
        body: typeData.description.growth,
        defaultOpen: true,
        tone: "primary",
      },
    ],
    [typeData],
  );

  return (
    <section className="space-y-3">
      <div className="px-0.5">
        <p className="font-mono text-[11px] tracking-[0.28em] text-white/60">
          {"// TYPE ANALYSIS //"}
        </p>
        <h2 className="mt-2 font-orbitron text-lg font-bold tracking-wide text-white">
          あなたの傾向
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          あなたらしさは、こんな感じです。
        </p>
      </div>

      {items.map((item) => (
        <AccordionItem key={item.id} item={item} />
      ))}
    </section>
  );
}

