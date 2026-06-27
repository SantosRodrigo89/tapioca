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
import { ProductsPanel } from "@/features/cardapio/products-panel";

export const metadata: Metadata = { title: "Produtos" };

export default async function MenuProductsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenantId = sessionUser.tenantId as string;
  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) redirect("/auth/login");

  const entitlements = await requireTenantEntitlements(tenant);
  requireFeature(entitlements, "products");

  const categoriesWithItems = await getTenantCatalogServer(tenantId);

  return (
    <Suspense>
      <ProductsPanel
        tenantId={tenantId}
        initialCategories={categoriesWithItems}
      />
    </Suspense>
  );
}
