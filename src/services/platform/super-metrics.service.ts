import type { SuperDashboardMetrics } from "@/types/platform";
import type { TenantStatus } from "@/types";
import { adminDb } from "@/lib/firebase/admin";
import { countPendingInvitesServer } from "@/lib/repositories/server/platform/invite.server";

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

export async function getSuperDashboardMetricsServer(): Promise<SuperDashboardMetrics> {
  const tenantsSnap = await adminDb.collection("tenants").get();
  const tenants = tenantsSnap.docs.map((doc) => ({
    status: doc.data().status as TenantStatus,
    siteConfig: doc.data().siteConfig,
  }));

  let totalProducts = 0;
  for (const doc of tenantsSnap.docs) {
    const categoriesSnap = await adminDb
      .collection(`tenants/${doc.id}/categories`)
      .get();
    for (const catDoc of categoriesSnap.docs) {
      const itemsSnap = await adminDb
        .collection(`tenants/${doc.id}/categories/${catDoc.id}/items`)
        .get();
      totalProducts += itemsSnap.size;
    }
  }

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

export async function getSuperPlatformMetricsServer() {
  const tenantsSnap = await adminDb.collection("tenants").get();
  let totalCategories = 0;
  let totalProducts = 0;

  for (const doc of tenantsSnap.docs) {
    const categoriesSnap = await adminDb
      .collection(`tenants/${doc.id}/categories`)
      .get();
    totalCategories += categoriesSnap.size;
    for (const catDoc of categoriesSnap.docs) {
      const itemsSnap = await adminDb
        .collection(`tenants/${doc.id}/categories/${catDoc.id}/items`)
        .get();
      totalProducts += itemsSnap.size;
    }
  }

  const pendingInvites = await countPendingInvitesServer().catch(() => 0);

  return {
    totalTenants: tenantsSnap.size,
    totalProducts,
    totalCategories,
    publishedLandings: tenantsSnap.docs.filter((doc) =>
      isLandingPublished(doc.data().siteConfig),
    ).length,
    totalUsers: tenantsSnap.size,
    totalQrCodes: tenantsSnap.size,
    totalViews: null as number | null,
    pendingInvites,
  };
}
