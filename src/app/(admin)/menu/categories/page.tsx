import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";
import { CategoriesPanel } from "@/features/cardapio/categories-panel";

export const metadata: Metadata = { title: "Categorias" };

export default async function MenuCategoriesPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenantId = sessionUser.tenantId as string;
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
