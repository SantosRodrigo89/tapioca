import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";
import {
  HighlightsSettings,
  type CategoryWithItems,
} from "@/components/admin/highlights-settings";
import type { Category, MenuItem } from "@/types";

import {
  requireFeature,
  requireTenantEntitlements,
} from "@/lib/platform/require-entitlements.server";

export const metadata: Metadata = { title: "Destaques" };

export default async function MenuHighlightsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenant = await getTenantByIdServer(sessionUser.tenantId);
  if (!tenant) redirect("/auth/login");

  const entitlements = await requireTenantEntitlements(tenant);
  requireFeature(entitlements, "products");

  const categories = await getCategoriesByTenantServer(tenant.id);
  const categoriesWithItems: CategoryWithItems[] = await Promise.all(
    categories.map(async (cat: Category) => {
      const items: MenuItem[] = await getItemsByCategoryServer(tenant.id, cat.id);
      return { ...cat, items };
    }),
  );

  return (
    <div className="max-w-2xl">
      <HighlightsSettings tenant={tenant} categories={categoriesWithItems} />
    </div>
  );
}
