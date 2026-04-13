"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  containerId: string;
  sectionIds: [string, string, string];
};

export default function HomeScrollIndicator({ containerId, sectionIds }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo(
    () =>
      sectionIds.map((id, idx) => ({
        id,
        idx,
        href: `#${id}`,
        label: `${idx + 1} / ${sectionIds.length}`,
      })),
    [sectionIds],
  );

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length !== sectionIds.length) return;

    let raf = 0;
    let bestRatioById = new Map<string, number>();

    const commitBest = () => {
      raf = 0;
      let best = { idx: 0, ratio: -1 };
      for (const [idx, id] of sectionIds.entries()) {
        const r = bestRatioById.get(id) ?? 0;
        if (r > best.ratio) best = { idx, ratio: r };
      }
      setActiveIndex((prev) => (prev === best.idx ? prev : best.idx));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          bestRatioById.set((e.target as HTMLElement).id, e.intersectionRatio);
        }
        if (!raf) raf = window.requestAnimationFrame(commitBest);
      },
      { root, threshold: [0, 0.25, 0.45, 0.6, 0.75, 0.9, 1] },
    );

    for (const el of sections) observer.observe(el);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      observer.disconnect();
      bestRatioById = new Map();
    };
  }, [containerId, sectionIds]);

  return (
    <nav
      className="pointer-events-none fixed top-1/2 z-20 -translate-y-1/2"
      style={{ right: "calc(env(safe-area-inset-right) + 0.85rem)" }}
      aria-label="トップ画面の現在位置"
    >
      <ol className="flex flex-col items-center gap-2.5">
        {items.map((it) => {
          const isActive = it.idx === activeIndex;
          return (
            <li key={it.id} className="pointer-events-auto">
              <a
                href={it.href}
                aria-label={it.label}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "block size-2.5 rounded-full transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/35",
                  isActive
                    ? "bg-cyan-200/90 shadow-[0_0_12px_rgba(90,220,220,0.55),0_0_28px_rgba(64,192,200,0.25)]"
                    : "border border-white/28 bg-white/5 shadow-[0_0_10px_rgba(255,215,0,0.06)] hover:border-white/40 hover:bg-white/10",
                ].join(" ")}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

