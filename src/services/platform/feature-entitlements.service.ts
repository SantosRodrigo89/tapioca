import type { FeatureId } from "@/types/platform/feature";
import type { Plan, PlanId } from "@/types/platform/plan";
import type { PlatformFeature } from "@/types/platform/feature";
import { getFeatureByIdServer, updateFeatureServer } from "@/lib/repositories/server/platform/feature.server";
import { getPlanByIdServer, updatePlanServer } from "@/lib/repositories/server/platform/plan.server";
import {
  getTenantByIdServer,
  setTenantFeatureOverrideServer,
} from "@/lib/repositories/server/tenant.server";
import { resolveFeature } from "@/lib/platform/features/resolve-feature";

export class FeatureEntitlementError extends Error {
  constructor(
    message: string,
    readonly code: "NOT_FOUND",
  ) {
    super(message);
    this.name = "FeatureEntitlementError";
  }
}

export async function updateGlobalFeatureServer(
  featureId: FeatureId,
  updates: { globalEnabled?: boolean; defaultEnabled?: boolean },
): Promise<PlatformFeature> {
  const existing = await getFeatureByIdServer(featureId);
  if (!existing) {
    throw new FeatureEntitlementError("Recurso não encontrado.", "NOT_FOUND");
  }

  await updateFeatureServer(featureId, updates);
  return (await getFeatureByIdServer(featureId))!;
}

export async function updatePlanFeatureServer(
  planId: PlanId,
  featureId: FeatureId,
  enabled: boolean,
): Promise<Plan> {
  const plan = await getPlanByIdServer(planId);
  if (!plan) {
    throw new FeatureEntitlementError("Plano não encontrado.", "NOT_FOUND");
  }

  const feature = await getFeatureByIdServer(featureId);
  if (!feature) {
    throw new FeatureEntitlementError("Recurso não encontrado.", "NOT_FOUND");
  }

  await updatePlanServer(planId, {
    features: { ...plan.features, [featureId]: enabled },
  });

  return (await getPlanByIdServer(planId))!;
}

export async function updateTenantFeatureServer(
  tenantId: string,
  featureId: FeatureId,
  enabled: boolean | null,
): Promise<{
  tenantId: string;
  featureOverrides: Partial<Record<FeatureId, boolean>> | undefined;
  resolved: boolean;
}> {
  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) {
    throw new FeatureEntitlementError("Restaurante não encontrado.", "NOT_FOUND");
  }

  const feature = await getFeatureByIdServer(featureId);
  if (!feature) {
    throw new FeatureEntitlementError("Recurso não encontrado.", "NOT_FOUND");
  }

  await setTenantFeatureOverrideServer(tenantId, featureId, enabled);

  const updated = await getTenantByIdServer(tenantId);
  const plan = await getPlanByIdServer(updated?.planId ?? "starter");

  const resolved = resolveFeature(featureId, {
    tenant: updated,
    plan,
    feature,
  });

  return {
    tenantId,
    featureOverrides: updated?.featureOverrides,
    resolved,
  };
}
