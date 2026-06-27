import type { Plan } from "@/types/platform/plan";
import type { PlatformFeature } from "@/types/platform/feature";
import type { Tenant } from "@/types";
import { FEATURE_IDS } from "@/lib/platform/features/feature-catalog";
import { resolveFeature } from "@/lib/platform/features/resolve-feature";
import { getPlanByIdServer } from "@/lib/repositories/server/platform/plan.server";
import { listFeaturesServer } from "@/lib/repositories/server/platform/feature.server";
import { getDefaultPlanId } from "@/lib/platform/plans/default-plans";
import type { TenantEntitlements } from "@/lib/platform/entitlements";

export type { TenantEntitlements } from "@/lib/platform/entitlements";

export async function getTenantEntitlementsServer(
  tenant: Pick<Tenant, "planId" | "featureOverrides">,
): Promise<TenantEntitlements> {
  const planId = tenant.planId ?? getDefaultPlanId();

  const [plan, features] = await Promise.all([
    getPlanByIdServer(planId).catch(() => null),
    listFeaturesServer().catch(() => [] as PlatformFeature[]),
  ]);

  const featureById = new Map(features.map((f) => [f.id, f]));
  const entitlements = {} as TenantEntitlements;

  for (const featureId of FEATURE_IDS) {
    entitlements[featureId] = resolveFeature(featureId, {
      tenant: { featureOverrides: tenant.featureOverrides },
      plan: plan as Pick<Plan, "features"> | null,
      feature: featureById.get(featureId) ?? null,
    });
  }

  return entitlements;
}
