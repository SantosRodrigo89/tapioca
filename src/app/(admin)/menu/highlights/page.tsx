import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import {
  requireFeature,
  requireTenantEntitlements,
} from "@/lib/platform/require-entitlements.server";
import { getTenantCatalogServer } from "@/lib/site/tenant-catalog.server";
import { HighlightsSettings } from "@/components/admin/highlights-settings";

export const metadata: Metadata = { title: "Destaques" };

export default async function MenuHighlightsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenant = await getTenantByIdServer(sessionUser.tenantId);
  if (!tenant) redirect("/auth/login");

  const entitlements = await requireTenantEntitlements(tenant);
  requireFeature(entitlements, "products");

  const categoriesWithItems = await getTenantCatalogServer(tenant.id);

  return (
    <div className="max-w-2xl">
      <HighlightsSettings tenant={tenant} categories={categoriesWithItems} />
    </div>
  );
}
