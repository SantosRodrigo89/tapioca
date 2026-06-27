import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";
import {
  requireFeature,
  requireTenantEntitlements,
} from "@/lib/platform/require-entitlements.server";
import { CategoriesPanel } from "@/features/cardapio/categories-panel";

export const metadata: Metadata = { title: "Categorias" };

export default async function MenuCategoriesPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenantId = sessionUser.tenantId as string;
  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) redirect("/auth/login");

  const entitlements = await requireTenantEntitlements(tenant);
  requireFeature(entitlements, "categories");

  const categories = await getCategoriesByTenantServer(tenantId);

  const itemCountsEntries = await Promise.all(
    categories.map(async (cat) => {
      const items = await getItemsByCategoryServer(tenantId, cat.id);
      return [cat.id, items.length] as const;
    }),
  );
  const itemCounts = Object.fromEntries(itemCountsEntries);

  return (
    <Suspense>
      <CategoriesPanel
        tenantId={tenantId}
        initialCategories={categories}
        itemCounts={itemCounts}
      />
    </Suspense>
  );
}
