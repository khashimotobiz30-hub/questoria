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

function pickString(...candidates: (string | undefined)[]) {
  for (const c of candidates) {
    const v = c?.trim();
    if (v) return v;
  }
  return "";
}

function wrapByChars(text: string, maxCharsPerLine: number, maxLines: number) {
  const t = (text ?? "").trim().replace(/\r\n/g, "\n");
  if (!t) return { wrapped: "", overflow: false };
  const raw = t.replace(/\n+/g, " ").trim();
  const lines: string[] = [];
  let cur = "";
  for (const ch of raw) {
    const next = cur + ch;
    if (next.length > maxCharsPerLine) {
      lines.push(cur);
      cur = ch;
      if (lines.length >= maxLines) return { wrapped: lines.join("\n"), overflow: true };
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) return { wrapped: lines.slice(0, maxLines).join("\n"), overflow: true };
  return { wrapped: lines.join("\n"), overflow: false };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = pickType(url.searchParams.get("type"));
  const mode = pickMode(url.searchParams.get("mode"));

  const td = typeMaster[type];
  const det = typeDetailMaster[type];
  const taglineRaw = pickString(det?.tagline, td.tagline);
  // 保存画像: 基本2行、必要なら3行まで
  const two = wrapByChars(taglineRaw, 24, 2);
  const three = two.overflow ? wrapByChars(taglineRaw, 24, 3) : two;
  const tagline = three.wrapped;
  const origin = url.origin;
  const bgSrc = `${origin}${typeImageMap[type]}`;
  const rootUrl = `${origin}/`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          color: "white",
          background: "#0A0A0F",
        }}
      >
        <img
          src={bgSrc}
          width={1080}
          height={1350}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 15%",
            filter: "brightness(1.12) contrast(1.06) saturate(0.96)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(10,10,15,0.35) 44%, rgba(0,0,0,0.92) 100%)",
          }}
        />

        {/* Top: title */}
        <div style={{ position: "relative", padding: "56px 64px 0 64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: 0.9 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "rgba(0,229,255,0.82)",
                boxShadow: "0 0 18px rgba(0,229,255,0.35)",
              }}
            />
            <div style={{ fontSize: 30, letterSpacing: 7, opacity: 0.78 }}>QUESTORIA</div>
            <div style={{ marginLeft: "auto" }}>
              <div
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,229,255,0.35)",
                  background: "rgba(0,0,0,0.35)",
                  fontSize: 22,
                  letterSpacing: 6,
                  opacity: 0.88,
                }}
              >
                {mode}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: main text */}
        <div style={{ position: "relative", marginTop: "auto", padding: "0 64px 64px 64px" }}>
          <div style={{ fontSize: 96, fontWeight: 900, color: "#FFD700" }}>{td.nameJa}</div>
          <div style={{ marginTop: 10, fontSize: 30, letterSpacing: 9, opacity: 0.62 }}>{`— ${td.nameEn} —`}</div>

          {tagline ? (
            <div
              style={{
                marginTop: 26,
                paddingLeft: 18,
                borderLeft: "3px solid rgba(0,229,255,0.6)",
                fontSize: 34,
                lineHeight: 1.42,
                opacity: 0.84,
                whiteSpace: "pre-wrap",
                maxHeight: 160,
                overflow: "hidden",
              }}
            >
              {tagline}
            </div>
          ) : null}

          <div
            style={{
              marginTop: 34,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: 0.58,
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: 4 }}>{rootUrl}</div>
            <div style={{ fontSize: 22, letterSpacing: 4, color: "rgba(0,229,255,0.7)" }}>#QUESTORIA</div>
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1350 },
  );
}

