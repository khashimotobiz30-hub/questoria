export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function isGaEnabled(): boolean {
  return GA_MEASUREMENT_ID.length > 0;
}

function isGaDebugMode(): boolean {
  if (typeof window === "undefined") return false;
  // Allow forcing DebugView in any env via query param.
  // Example: https://.../light?ga_debug=1
  try {
    const q = window.location?.search ?? "";
    if (q.includes("ga_debug=1")) return true;
  } catch {
    // noop
  }
  return process.env.NODE_ENV === "development";
}

function ensureGtag(): ((...args: unknown[]) => void) | null {
  if (typeof window === "undefined") return null;
  // Prepare a queue early so events don't get dropped before gtag.js loads.
  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag !== "function") {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }
  return window.gtag;
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): void {
  if (!isGaEnabled()) return;
  const gtag = ensureGtag();
  if (!gtag) return;
  const cleaned =
    params === undefined
      ? undefined
      : Object.fromEntries(
          Object.entries(params).filter(([, v]) => v != null && v !== "") as [
            string,
            string | number | boolean,
          ][],
        );
  const debug = isGaDebugMode();
  const withDebug = cleaned ? { ...cleaned, ...(debug ? { debug_mode: true } : null) } : cleaned;
  gtag("event", name, withDebug);
}

export function trackPageView(pagePath: string): void {
  if (!isGaEnabled()) return;
  const gtag = ensureGtag();
  if (!gtag) return;
  const debug = isGaDebugMode();
  gtag("event", "page_view", debug ? { page_path: pagePath, debug_mode: true } : { page_path: pagePath });
}
