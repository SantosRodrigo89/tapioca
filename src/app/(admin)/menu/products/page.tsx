import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";
import { CatalogClient } from "@/app/(admin)/catalog/catalog-client";
import type { Category, MenuItem } from "@/types";

export const metadata: Metadata = { title: "Produtos" };

type CategoryWithItems = Category & { items: MenuItem[] };

export default async function MenuProductsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenantId = sessionUser.tenantId as string;
  const categories = await getCategoriesByTenantServer(tenantId);

  const categoriesWithItems: CategoryWithItems[] = await Promise.all(
    categories.map(async (cat) => {
      const items = await getItemsByCategoryServer(tenantId, cat.id);
      return { ...cat, items };
    }),
  );

  return (
    <Suspense>
      <CatalogClient
        tenantId={tenantId}
        initialCategories={categoriesWithItems}
      />
    </Suspense>
  );
}
