import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";
import { SettingsClient } from "./settings-client";
import type { Category, MenuItem } from "@/types";

export const metadata: Metadata = { title: "Configurações" };

export default async function SettingsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenantId = sessionUser.tenantId as string;
  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) redirect("/auth/login");

  const categories = await getCategoriesByTenantServer(tenantId);
  const categoriesWithItems = await Promise.all(
    categories.map(async (cat: Category) => {
      const items: MenuItem[] = await getItemsByCategoryServer(
        tenantId,
        cat.id,
      );
      return { ...cat, items };
    }),
  );

  return (
    <SettingsClient tenant={tenant} categories={categoriesWithItems} />
  );
}
