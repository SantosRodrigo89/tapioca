import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";
import { ProductsPanel } from "@/features/cardapio/products-panel";
import type { CategoryWithItems } from "@/features/cardapio/types";

export const metadata: Metadata = { title: "Produtos" };

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
      <ProductsPanel
        tenantId={tenantId}
        initialCategories={categoriesWithItems}
      />
    </Suspense>
  );
}
