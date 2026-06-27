import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import { getGalleryByTenantServer } from "@/lib/repositories/server/gallery.server";
import { getResolvedSiteConfig } from "@/services/site.service";
import { getTenantCatalogServer } from "@/lib/site/tenant-catalog.server";
import {
  requireFeature,
  requireTenantEntitlements,
} from "@/lib/platform/require-entitlements.server";
import { SiteEditor } from "./site-editor";

export const metadata: Metadata = { title: "Presença Digital" };

export default async function SitePage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenantId = sessionUser.tenantId as string;
  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) redirect("/auth/login");

  const entitlements = await requireTenantEntitlements(tenant);
  requireFeature(entitlements, "landing_page");

  const [categoriesWithItems, gallery] = await Promise.all([
    getTenantCatalogServer(tenantId),
    getGalleryByTenantServer(tenantId),
  ]);

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
