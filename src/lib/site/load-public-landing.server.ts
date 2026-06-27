import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import {
  CACHE_TTL,
  publicLandingCacheTag,
} from "@/lib/cache/revalidate";
import { getGalleryByTenantServer } from "@/lib/repositories/server/gallery.server";
import { getTenantBySlugServer } from "@/lib/repositories/server/tenant.server";
import { getTenantEntitlementsServer } from "@/lib/platform/get-tenant-entitlements.server";
import { resolveProductDrawerActions } from "@/lib/site/product-experience";
import { resolveHighlights } from "@/lib/site/resolve-highlights";
import type { LandingPageData } from "@/lib/site/landing-types";
import type { TenantEntitlements } from "@/lib/platform/entitlements";
import {
  filterCategoriesWithItems,
  getTenantCatalogServer,
} from "@/lib/site/tenant-catalog.server";
import { getResolvedSiteConfig } from "@/services/site.service";
import type { Tenant, TenantStatus } from "@/types";

export interface PublicLandingPayload {
  tenant: Tenant;
  pageData: LandingPageData;
  entitlements: TenantEntitlements;
  drawerActions: ReturnType<typeof resolveProductDrawerActions>;
}

export interface PublicLandingBlocked {
  kind: "blocked";
  status: TenantStatus;
  name: string;
}

export type PublicLandingResult =
  | ({ kind: "ok" } & PublicLandingPayload)
  | PublicLandingBlocked
  | { kind: "not_found" };

async function loadPublicLandingUncached(
  slug: string,
): Promise<PublicLandingResult> {
  const tenant = await getTenantBySlugServer(slug);
  if (!tenant) return { kind: "not_found" };

  if (tenant.status === "suspended" || tenant.status === "cancelled") {
    return { kind: "blocked", status: tenant.status, name: tenant.name };
  }

  const siteConfig = getResolvedSiteConfig(tenant);
  const entitlements = await getTenantEntitlementsServer(tenant);

  if (!entitlements.landing_page) {
    return { kind: "not_found" };
  }

  const [categoriesWithItems, gallery] = await Promise.all([
    getTenantCatalogServer(tenant.id, {
      activeCategoriesOnly: true,
      availableItemsOnly: true,
    }),
    entitlements.gallery
      ? getGalleryByTenantServer(tenant.id)
      : Promise.resolve([]),
  ]);

  const visibleCategories = filterCategoriesWithItems(categoriesWithItems);
  const highlights = resolveHighlights(siteConfig, tenant, visibleCategories);
  const whatsapp = siteConfig.contact.whatsapp ?? tenant.whatsapp;
  const drawerActions = resolveProductDrawerActions(siteConfig, whatsapp);

  const pageData: LandingPageData = {
    tenant,
    siteConfig,
    gallery,
    categoriesWithItems,
    visibleCategories,
    highlights,
    whatsapp,
  };

  return {
    kind: "ok",
    tenant,
    pageData,
    entitlements,
    drawerActions,
  };
}

export function getPublicLandingBySlug(slug: string): Promise<PublicLandingResult> {
  return unstable_cache(
    () => loadPublicLandingUncached(slug),
    ["public-landing", slug],
    {
      revalidate: CACHE_TTL.PUBLIC_LANDING_SECONDS,
      tags: [publicLandingCacheTag(slug)],
    },
  )();
}

/** Cached tenant lookup for metadata generation (lighter than full landing payload). */
export function getCachedTenantBySlug(slug: string): Promise<Tenant | null> {
  return unstable_cache(
    () => getTenantBySlugServer(slug),
    ["tenant-by-slug", slug],
    {
      revalidate: CACHE_TTL.PUBLIC_LANDING_SECONDS,
      tags: [publicLandingCacheTag(slug)],
    },
  )();
}
