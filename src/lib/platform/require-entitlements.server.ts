import { redirect } from "next/navigation";
import type { FeatureId } from "@/types/platform";
import type { Tenant } from "@/types";
import {
  getTenantEntitlementsServer,
  type TenantEntitlements,
} from "@/lib/platform/get-tenant-entitlements.server";

export function redirectIfTenantBlocked(tenant: Tenant): void {
  if (tenant.status === "suspended" || tenant.status === "cancelled") {
    redirect(`/auth/account-blocked?status=${tenant.status}`);
  }
}

export async function requireTenantEntitlements(
  tenant: Tenant,
): Promise<TenantEntitlements> {
  redirectIfTenantBlocked(tenant);
  return getTenantEntitlementsServer(tenant);
}

export function requireFeature(
  entitlements: TenantEntitlements,
  featureId: FeatureId,
  fallback = "/dashboard",
): void {
  if (!entitlements[featureId]) {
    redirect(fallback);
  }
}
