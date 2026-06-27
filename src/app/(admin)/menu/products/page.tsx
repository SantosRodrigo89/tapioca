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
import { ProductsPanel } from "@/features/cardapio/products-panel";
import type { CategoryWithItems } from "@/features/cardapio/types";

export const metadata: Metadata = { title: "Produtos" };

export default async function MenuProductsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenantId = sessionUser.tenantId as string;
  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) redirect("/auth/login");

  const entitlements = await requireTenantEntitlements(tenant);
  requireFeature(entitlements, "products");
  const categories = await getCategoriesByTenantServer(tenantId);

  const categoriesWithItems: CategoryWithItems[] = await Promise.all(
    categories.map(async (cat) => {
      const items = await getItemsByCategoryServer(tenantId, cat.id);
      return { ...cat, items };
    }),
  );

  return (
    <Suspense>
      <ProductsPanel
        tenantId={tenantId}
        initialCategories={categoriesWithItems}
      />
    </Suspense>
  );
}
