import type { FeatureCategory, FeatureId, PlatformFeature } from "@/types/platform/feature";
import type { PlanId } from "@/types/platform/plan";

export const FEATURE_CATEGORY_LABELS: Record<FeatureCategory, string> = {
  core: "Core",
  growth: "Growth",
  premium: "Premium",
  future: "Futuro",
};

export type FeatureListItem = PlatformFeature;

export interface PlanFeaturesItem {
  id: PlanId;
  name: string;
  features: Partial<Record<FeatureId, boolean>>;
}

export interface TenantFeaturesItem {
  id: string;
  name: string;
  slug: string;
  planId: string;
  featureOverrides?: Partial<Record<FeatureId, boolean>>;
}

export function getPlanFeatureValue(
  plan: PlanFeaturesItem,
  feature: FeatureListItem,
): boolean {
  const value = plan.features[feature.id];
  if (value !== undefined) return value;
  return feature.globalEnabled;
}
