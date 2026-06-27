import type { FeatureId } from "@/types/platform";

export type TenantEntitlements = Record<FeatureId, boolean>;

/** Maps landing section ids to required features. */
export const SECTION_FEATURE_MAP: Partial<Record<string, FeatureId>> = {
  hero: "landing_page",
  about: "landing_page",
  differentials: "landing_page",
  featured: "products",
  menu: "products",
  gallery: "gallery",
  contact: "landing_page",
  location: "landing_page",
  footer: "landing_page",
};

/** Maps admin site editor tabs to required features. */
export const SITE_TAB_FEATURE_MAP = {
  appearance: "landing_page",
  banner: "landing_page",
  about: "landing_page",
  differentials: "landing_page",
  featured: "products",
  gallery: "gallery",
  contact: "landing_page",
  hours: "landing_page",
  seo: "landing_page",
  qr: "qr_code",
} as const satisfies Record<string, FeatureId>;

export function isEntitled(
  entitlements: TenantEntitlements,
  featureId: FeatureId,
): boolean {
  return entitlements[featureId] ?? false;
}
