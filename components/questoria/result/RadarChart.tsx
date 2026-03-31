import React from "react";

type Props = {
  values: { purpose: number; design: number; decision: number };
  color: string;
};

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function toPercent01(score0to100: number) {
  return clamp01(score0to100 / 100);
}

export function RadarChart({ values, color }: Props) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;

  const axes = [
    { key: "purpose", label: "目的定義力", angleDeg: -90 },
    { key: "design", label: "設計力", angleDeg: 30 },
    { key: "decision", label: "自律判断力", angleDeg: 150 },
  ] as const;

  const points = axes
    .map((a) => {
      const angle = (a.angleDeg * Math.PI) / 180;
      const v = toPercent01(values[a.key]);
      const x = cx + Math.cos(angle) * r * v;
      const y = cy + Math.sin(angle) * r * v;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const grid = [0.25, 0.5, 0.75, 1].map((t) =>
    axes
      .map((a) => {
        const angle = (a.angleDeg * Math.PI) / 180;
        const x = cx + Math.cos(angle) * r * t;
        const y = cy + Math.sin(angle) * r * t;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" "),
  );

  return (
    <div className="w-full">
      <div className="relative mx-auto w-[180px]">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="h-[180px] w-[180px]"
          role="img"
          aria-label="Thinking profile radar chart"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {grid.map((p, i) => (
            <polygon
              key={i}
              points={p}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
          ))}

          {axes.map((a) => {
            const angle = (a.angleDeg * Math.PI) / 180;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            return (
              <line
                key={a.key}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
              />
            );
          })}

          <polygon
            points={points}
            fill={`${color}22`}
            stroke={color}
            strokeWidth="2"
            filter="url(#glow)"
          />

          {axes.map((a) => {
            const angle = (a.angleDeg * Math.PI) / 180;
            const v = toPercent01(values[a.key]);
            const x = cx + Math.cos(angle) * r * v;
            const y = cy + Math.sin(angle) * r * v;
            return <circle key={a.key} cx={x} cy={y} r="3.5" fill={color} />;
          })}
        </svg>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        {axes.map((a) => (
          <div key={a.key} className="rounded-lg border border-white/10 bg-black/30 p-2">
            <p className="text-[10px] leading-tight text-white/60">{a.label}</p>
            <p className="mt-1 font-mono text-sm font-bold text-white/90">
              {Math.round(values[a.key])}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

