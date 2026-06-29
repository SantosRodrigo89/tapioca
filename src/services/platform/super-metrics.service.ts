import { unstable_cache } from "next/cache";
import type { SuperPlatformMetrics } from "@/types/platform";
import type { SuperDashboardMetrics } from "@/types/platform";
import type { TenantStatus } from "@/types";
import { adminDb } from "@/lib/firebase/admin";
import { CACHE_TTL, SUPER_METRICS_CACHE_TAG } from "@/lib/cache/revalidate";
import { countPlatformPageViews } from "@/lib/analytics/posthog.server";
import {
  sumTenantViewsFromFirestore,
} from "@/services/analytics.service";
import { countPendingInvitesServer } from "@/lib/repositories/server/platform/invite.server";
import { listFeaturesServer } from "@/lib/repositories/server/platform/feature.server";
import { listPlansServer } from "@/lib/repositories/server/platform/plan.server";
import { listTemplatesServer } from "@/lib/repositories/server/platform/template.server";

function countByStatus(
  tenants: { status: TenantStatus }[],
  status: TenantStatus,
): number {
  return tenants.filter((t) => t.status === status).length;
}

function isLandingPublished(
  siteConfig: FirebaseFirestore.DocumentData["siteConfig"],
): boolean {
  if (!siteConfig || typeof siteConfig !== "object") return false;
  const sections = (siteConfig as { sections?: { id: string; enabled: boolean }[] })
    .sections;
  const hero = sections?.find((s) => s.id === "hero");
  return hero?.enabled ?? false;
}

async function countTenantCatalog(tenantId: string) {
  const categoriesSnap = await adminDb
    .collection(`tenants/${tenantId}/categories`)
    .get();

  if (categoriesSnap.empty) {
    return { categories: 0, products: 0 };
  }

  const itemSnaps = await Promise.all(
    categoriesSnap.docs.map((catDoc) =>
      adminDb
        .collection(`tenants/${tenantId}/categories/${catDoc.id}/items`)
        .count()
        .get(),
    ),
  );

  return {
    categories: categoriesSnap.size,
    products: itemSnaps.reduce((sum, snap) => sum + snap.data().count, 0),
  };
}

async function aggregateCatalogMetrics(tenantIds: string[]) {
  if (tenantIds.length === 0) {
    return { totalCategories: 0, totalProducts: 0 };
  }

  const perTenant = await Promise.all(
    tenantIds.map((tenantId) => countTenantCatalog(tenantId)),
  );

  return perTenant.reduce(
    (acc, row) => ({
      totalCategories: acc.totalCategories + row.categories,
      totalProducts: acc.totalProducts + row.products,
    }),
    { totalCategories: 0, totalProducts: 0 },
  );
}

async function resolveTotalViews(): Promise<number | null> {
  const fromPostHog = await countPlatformPageViews(30);
  if (fromPostHog !== null) return fromPostHog;

  const fromFirestore = await sumTenantViewsFromFirestore();
  return fromFirestore > 0 ? fromFirestore : null;
}

async function getSuperDashboardMetricsUncached(): Promise<SuperDashboardMetrics> {
  const tenantsSnap = await adminDb.collection("tenants").get();
  const tenants = tenantsSnap.docs.map((doc) => ({
    status: doc.data().status as TenantStatus,
    siteConfig: doc.data().siteConfig,
  }));

  const [{ totalProducts }, pendingInvites, totalViews] = await Promise.all([
    aggregateCatalogMetrics(tenantsSnap.docs.map((d) => d.id)),
    countPendingInvitesServer().catch(() => 0),
    resolveTotalViews(),
  ]);

  return {
    activeTenants: countByStatus(tenants, "active"),
    trialTenants: countByStatus(tenants, "trial"),
    suspendedTenants: countByStatus(tenants, "suspended"),
    cancelledTenants: countByStatus(tenants, "cancelled"),
    pendingInvites,
    totalProducts,
    publishedLandings: tenantsSnap.docs.filter((doc) =>
      isLandingPublished(doc.data().siteConfig),
    ).length,
    totalViews,
  };
}

async function getSuperPlatformMetricsUncached(): Promise<SuperPlatformMetrics> {
  const [tenantsSnap, pendingInvites, plans, templates, features] =
    await Promise.all([
      adminDb.collection("tenants").get(),
      countPendingInvitesServer().catch(() => 0),
      listPlansServer().catch(() => []),
      listTemplatesServer().catch(() => []),
      listFeaturesServer().catch(() => []),
    ]);

  const tenants = tenantsSnap.docs.map((doc) => ({
    status: doc.data().status as TenantStatus,
    siteConfig: doc.data().siteConfig,
  }));

  const { totalCategories, totalProducts } = await aggregateCatalogMetrics(
    tenantsSnap.docs.map((d) => d.id),
  );

  const publishedLandings = tenantsSnap.docs.filter((doc) =>
    isLandingPublished(doc.data().siteConfig),
  ).length;

  const totalViews = await resolveTotalViews();

  return {
    totalTenants: tenantsSnap.size,
    totalProducts,
    totalCategories,
    publishedLandings,
    totalUsers: tenantsSnap.docs.filter((doc) => !!doc.data().ownerUid).length,
    totalQrCodes: tenantsSnap.size,
    totalViews,
    pendingInvites,
    activeTenants: countByStatus(tenants, "active"),
    trialTenants: countByStatus(tenants, "trial"),
    suspendedTenants: countByStatus(tenants, "suspended"),
    cancelledTenants: countByStatus(tenants, "cancelled"),
    totalPlans: plans.length,
    totalTemplates: templates.length,
    totalFeatures: features.length,
  };
}

export function getSuperDashboardMetricsServer(): Promise<SuperDashboardMetrics> {
  return unstable_cache(
    getSuperDashboardMetricsUncached,
    ["super-dashboard-metrics"],
    { revalidate: CACHE_TTL.SUPER_METRICS_SECONDS, tags: [SUPER_METRICS_CACHE_TAG] },
  )();
}

export function getSuperPlatformMetricsServer(): Promise<SuperPlatformMetrics> {
  return unstable_cache(
    getSuperPlatformMetricsUncached,
    ["super-platform-metrics"],
    { revalidate: CACHE_TTL.SUPER_METRICS_SECONDS, tags: [SUPER_METRICS_CACHE_TAG] },
  )();
}
