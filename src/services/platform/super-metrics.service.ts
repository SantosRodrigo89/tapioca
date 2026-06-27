import type { SuperPlatformMetrics } from "@/types/platform";
import type { TenantStatus } from "@/types";
import { adminDb } from "@/lib/firebase/admin";
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

async function aggregateCatalogMetrics(tenantIds: string[]) {
  let totalCategories = 0;
  let totalProducts = 0;

  for (const tenantId of tenantIds) {
    const categoriesSnap = await adminDb
      .collection(`tenants/${tenantId}/categories`)
      .get();
    totalCategories += categoriesSnap.size;
    for (const catDoc of categoriesSnap.docs) {
      const itemsSnap = await adminDb
        .collection(`tenants/${tenantId}/categories/${catDoc.id}/items`)
        .get();
      totalProducts += itemsSnap.size;
    }
  }

  return { totalCategories, totalProducts };
}

export async function getSuperDashboardMetricsServer(): Promise<
  import("@/types/platform").SuperDashboardMetrics
> {
  const tenantsSnap = await adminDb.collection("tenants").get();
  const tenants = tenantsSnap.docs.map((doc) => ({
    status: doc.data().status as TenantStatus,
    siteConfig: doc.data().siteConfig,
  }));

  const { totalProducts } = await aggregateCatalogMetrics(
    tenantsSnap.docs.map((d) => d.id),
  );

  const pendingInvites = await countPendingInvitesServer().catch(() => 0);

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
    totalViews: null,
  };
}

export async function getSuperPlatformMetricsServer(): Promise<SuperPlatformMetrics> {
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

  return {
    totalTenants: tenantsSnap.size,
    totalProducts,
    totalCategories,
    publishedLandings,
    totalUsers: tenantsSnap.docs.filter((doc) => !!doc.data().ownerUid).length,
    totalQrCodes: tenantsSnap.size,
    totalViews: null,
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
