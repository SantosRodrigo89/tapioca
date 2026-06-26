import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";
import { getGalleryByTenantServer } from "@/lib/repositories/server/gallery.server";
import { getResolvedSiteConfig } from "@/services/site.service";
import { SiteEditor } from "./site-editor";
import type { Category, MenuItem } from "@/types";

export const metadata: Metadata = { title: "Presença Digital" };

export default async function SitePage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenantId = sessionUser.tenantId as string;
  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) redirect("/auth/login");

  const [categories, gallery] = await Promise.all([
    getCategoriesByTenantServer(tenantId),
    getGalleryByTenantServer(tenantId),
  ]);

  const categoriesWithItems = await Promise.all(
    categories.map(async (cat: Category) => {
      const items: MenuItem[] = await getItemsByCategoryServer(
        tenantId,
        cat.id,
      );
      return { ...cat, items };
    }),
  );

  const siteConfig = getResolvedSiteConfig(tenant);
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  const publicUrl = base ? `${base}/${tenant.slug}` : `/${tenant.slug}`;

  return (
    <SiteEditor
      tenant={tenant}
      siteConfig={siteConfig}
      categories={categoriesWithItems}
      gallery={gallery}
      publicUrl={publicUrl}
    />
  );
}
