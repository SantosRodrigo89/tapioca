export const CACHE_TTL = {
  /** Public landing page data (menu + gallery + entitlements snapshot). */
  PUBLIC_LANDING_SECONDS: 120,
  /** Super-admin aggregate metrics. */
  SUPER_METRICS_SECONDS: 300,
} as const;

export function publicLandingCacheTag(slug: string): string {
  return `public-landing-${slug}`;
}

export const SUPER_METRICS_CACHE_TAG = "super-metrics";
