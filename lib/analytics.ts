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

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): void {
  if (!isGaEnabled() || typeof window === "undefined" || typeof window.gtag !== "function") return;
  const cleaned =
    params === undefined
      ? undefined
      : Object.fromEntries(
          Object.entries(params).filter(([, v]) => v != null && v !== "") as [
            string,
            string | number | boolean,
          ][],
        );
  window.gtag("event", name, cleaned);
}

export function trackPageView(pagePath: string): void {
  if (!isGaEnabled() || typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", { page_path: pagePath });
}
