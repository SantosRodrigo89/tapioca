import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import {
  requireFeature,
  requireTenantEntitlements,
} from "@/lib/platform/require-entitlements.server";
import { getTenantCatalogServer } from "@/lib/site/tenant-catalog.server";
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

  const catalog = await getTenantCatalogServer(tenantId);
  const categories = catalog.map(({ items: _items, ...category }) => category);
  const itemCounts = Object.fromEntries(
    catalog.map((entry) => [entry.id, entry.items.length]),
  );

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
