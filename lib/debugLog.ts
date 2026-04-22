const DEBUG_LOG_KEY = "questoria_debug_log";

export function isDebugLogEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const s = sessionStorage.getItem(DEBUG_LOG_KEY);
    if (s === "1") return true;
    if (s === "0") return false;
  } catch {
    // noop
  }
  try {
    const l = localStorage.getItem(DEBUG_LOG_KEY);
    return l === "1";
  } catch {
    return false;
  }
}

export function setDebugLogEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  const v = enabled ? "1" : "0";
  try {
    sessionStorage.setItem(DEBUG_LOG_KEY, v);
  } catch {
    // noop
  }
  try {
    localStorage.setItem(DEBUG_LOG_KEY, v);
  } catch {
    // noop
  }
}

export function clearDebugLogFlag(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(DEBUG_LOG_KEY);
  } catch {
    // noop
  }
  try {
    localStorage.removeItem(DEBUG_LOG_KEY);
  } catch {
    // noop
  }
}

/** Apply `log=1` (enable) / `log=0` (disable+clear) if present. */
export function syncDebugLogFromQueryParam(raw: string | null): void {
  if (typeof window === "undefined") return;
  if (raw === "1") {
    setDebugLogEnabled(true);
    return;
  }
  if (raw === "0") {
    clearDebugLogFlag();
  }
}

