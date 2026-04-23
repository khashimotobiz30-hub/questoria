import { ImageResponse } from "next/og";

import { typeDetailMaster } from "@/data/typeDetailMaster";
import { typeMaster } from "@/data/typeMaster";
import type { ResultType } from "@/types";

export const runtime = "edge";

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

function pickType(v: string | null): ResultType {
  const s = (v ?? "").trim() as ResultType;
  if (s in typeMaster) return s;
  return "hero";
}

function pickMode(v: string | null): "WORK" | "LIFE" | "LIGHT" {
  const s = (v ?? "").trim().toUpperCase();
  if (s === "LIFE") return "LIFE";
  if (s === "LIGHT") return "LIGHT";
  return "WORK";
}

function firstLine(text: string, maxChars: number) {
  const t = (text ?? "").trim().split("\n")[0] ?? "";
  if (t.length <= maxChars) return t;
  return `${t.slice(0, maxChars)}…`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function titleFontSize(nameJa: string) {
  // 全タイプで崩れにくいように、長いほど少し縮める
  const len = (nameJa ?? "").trim().length;
  // 4〜10文字程度を想定
  return clamp(100 - (len - 4) * 8, 70, 100);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = pickType(url.searchParams.get("type"));
  const mode = pickMode(url.searchParams.get("mode"));

  const td = typeMaster[type];
  const det = typeDetailMaster[type];
  const taglineRaw = (det?.taglineOg ?? det?.tagline ?? td.tagline ?? "").trim();
  const tagline = firstLine(taglineRaw, 36);
  const bgSrc = `${url.origin}${typeImageMap[type]}`;
  const tSize = titleFontSize(td.nameJa);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          color: "white",
        }}
      >
        <img
          src={bgSrc}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 15%",
            filter: "brightness(1.08) contrast(1.05) saturate(0.96)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(5,7,12,0.78) 56%, rgba(0,0,0,0.94) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 95% at 50% 35%, rgba(0,229,255,0.06), transparent 55%), radial-gradient(120% 100% at 50% 110%, rgba(255,215,0,0.05), transparent 62%)",
          }}
        />

        <div style={{ position: "relative", padding: 64 }}>
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              opacity: 0.9,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "rgba(0,229,255,0.8)",
                boxShadow: "0 0 18px rgba(0,229,255,0.35)",
              }}
            />
            <div style={{ fontSize: 28, letterSpacing: 6, opacity: 0.75 }}>QUESTORIA</div>
            <div
              style={{
                marginLeft: "auto",
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid rgba(0,229,255,0.28)",
                background: "rgba(0,0,0,0.28)",
                fontSize: 20,
                letterSpacing: 6,
                opacity: 0.78,
              }}
            >
              {mode}
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              fontSize: tSize,
              fontWeight: 900,
              color: "#FFD700",
              letterSpacing: 1,
              textShadow: "0 0 28px rgba(255,215,0,0.18), 0 2px 14px rgba(0,0,0,0.75)",
              lineHeight: 1.02,
            }}
          >
            {td.nameJa}
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 28,
              letterSpacing: 8,
              opacity: 0.62,
              textShadow: "0 2px 10px rgba(0,0,0,0.65)",
            }}
          >
            {`— ${td.nameEn} —`}
          </div>

          {tagline ? (
            <div
              style={{
                marginTop: 22,
                paddingLeft: 18,
                borderLeft: "3px solid rgba(0,229,255,0.6)",
                fontSize: 30,
                lineHeight: 1.4,
                opacity: 0.84,
                whiteSpace: "pre-wrap",
                maxWidth: 880,
                textShadow: "0 2px 10px rgba(0,0,0,0.7)",
              }}
            >
              {tagline}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

