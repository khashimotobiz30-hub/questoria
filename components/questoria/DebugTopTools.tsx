"use client";

import { useEffect, useState } from "react";

const TARGET_KEYS = [
  "questoria_result",
  "questoria_answers",
  "questoria_question_order",
  "questoria_choice_order",
] as const;

function safeGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeRemove(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    // noop
  }
}

export default function DebugTopTools() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [rows, setRows] = useState<Array<{ key: string; session: string; local: string }>>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams(window.location.search);
    const isEnabled = params.get("debugTop") === "1";
    setEnabled(isEnabled);
    if (!isEnabled) return;

    const shouldClear = params.get("clearStorage") === "1";
    if (shouldClear) {
      for (const key of TARGET_KEYS) {
        safeRemove(sessionStorage, key);
        safeRemove(localStorage, key);
      }
      setCleared(true);
    }

    setRows(
      TARGET_KEYS.map((key) => ({
        key,
        session: safeGet(sessionStorage, key) ? "present" : "empty",
        local: safeGet(localStorage, key) ? "present" : "empty",
      })),
    );
  }, [mounted]);

  // Hydration-safe: keep SSR and first client render identical.
  if (!mounted || !enabled) return null;

  return (
    <div className="fixed inset-x-3 top-3 z-[80] rounded-xl border border-cyan-300/25 bg-black/70 p-3 font-mono text-[11px] tracking-wide text-cyan-100/90 shadow-[0_0_24px_rgba(0,229,255,0.12)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-cyan-200/95">DEBUG TOP</p>
          <p className="mt-0.5 text-white/70">
            {cleared ? "storage cleared" : "storage status"} (add <span className="text-cyan-200">clearStorage=1</span>{" "}
            to clear)
          </p>
        </div>
        <a
          href="/"
          className="shrink-0 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-white/80 hover:border-white/25 hover:bg-white/10"
        >
          close
        </a>
      </div>

      <div className="mt-2 space-y-1 text-white/75">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between gap-2">
            <span className="truncate">{r.key}</span>
            <span className="shrink-0 text-[10px] text-white/65">
              s:{r.session} / l:{r.local}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

