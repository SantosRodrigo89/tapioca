import type { FeatureId } from "@/types/platform";
import type { Plan } from "@/types/platform/plan";
import type { PlatformFeature } from "@/types/platform/feature";
import type { Tenant } from "@/types";
import { resolvePlanFeature } from "@/lib/platform/plans/default-plans";

export function resolveFeature(
  featureId: FeatureId,
  options: {
    tenant?: Pick<Tenant, "featureOverrides"> | null;
    plan?: Pick<Plan, "features"> | null;
    feature?: Pick<PlatformFeature, "globalEnabled" | "defaultEnabled"> | null;
  },
): boolean {
  const tenantOverride = options.tenant?.featureOverrides?.[featureId];
  if (tenantOverride !== undefined) return tenantOverride;

  const globalDefault =
    options.feature?.globalEnabled ?? options.feature?.defaultEnabled ?? true;

  return resolvePlanFeature(options.plan, featureId, globalDefault);
}

export function isFeatureEnabled(
  featureId: FeatureId,
  tenant: Tenant,
  plan: Plan | null,
  feature: PlatformFeature | null,
): boolean {
  return resolveFeature(featureId, { tenant, plan, feature });
}

export function getResolvedFeatureState(
  featureId: FeatureId,
  context: {
    feature: PlatformFeature;
    plan: Pick<Plan, "features"> | null;
    tenantOverrides?: Partial<Record<FeatureId, boolean>>;
  },
): {
  resolved: boolean;
  hasOverride: boolean;
  overrideValue?: boolean;
  planValue?: boolean;
} {
  const hasOverride = context.tenantOverrides?.[featureId] !== undefined;
  const overrideValue = context.tenantOverrides?.[featureId];
  const planValue = context.plan?.features?.[featureId];

  const resolved = resolveFeature(featureId, {
    tenant: { featureOverrides: context.tenantOverrides },
    plan: context.plan,
    feature: context.feature,
  });

  return { resolved, hasOverride, overrideValue, planValue };
}
