import type { TenantAnalyticsSummary } from "@/lib/analytics/events";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { isPostHogServerConfigured } from "@/lib/analytics/posthog-config";
import {
  countEventsForTenant,
  topProductsForTenant,
} from "@/lib/analytics/posthog.server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function getTenantAnalyticsSummary(
  tenantId: string,
): Promise<TenantAnalyticsSummary> {
  const configured = isPostHogServerConfigured();

  if (!configured) {
    return {
      views7d: null,
      views30d: null,
      whatsappClicks30d: null,
      topProducts: [],
      configured: false,
    };
  }

  const [views7d, views30d, whatsappClicks30d, topProducts] = await Promise.all([
    countEventsForTenant(ANALYTICS_EVENTS.PAGE_VIEW, tenantId, 7),
    countEventsForTenant(ANALYTICS_EVENTS.PAGE_VIEW, tenantId, 30),
    countEventsForTenant(ANALYTICS_EVENTS.WHATSAPP_CLICK, tenantId, 30),
    topProductsForTenant(tenantId, 30),
  ]);

  return {
    views7d,
    views30d,
    whatsappClicks30d,
    topProducts,
    configured: true,
  };
}

export async function syncTenantViewsMetric(
  tenantId: string,
): Promise<number | null> {
  const views30d = await countEventsForTenant(
    ANALYTICS_EVENTS.PAGE_VIEW,
    tenantId,
    30,
  );

  if (views30d === null) return null;

  await adminDb.doc(`tenants/${tenantId}`).update({
    "metrics.views": views30d,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return views30d;
}

export async function syncAllTenantViewsMetrics(): Promise<{
  synced: number;
  failed: number;
}> {
  const tenantsSnap = await adminDb.collection("tenants").get();
  let synced = 0;
  let failed = 0;

  for (const doc of tenantsSnap.docs) {
    try {
      const result = await syncTenantViewsMetric(doc.id);
      if (result === null) {
        failed += 1;
      } else {
        synced += 1;
      }
    } catch (err) {
      console.error("[analytics] sync tenant", doc.id, err);
      failed += 1;
    }
  }

  return { synced, failed };
}

export async function sumTenantViewsFromFirestore(): Promise<number> {
  const tenantsSnap = await adminDb.collection("tenants").get();
  return tenantsSnap.docs.reduce((sum, doc) => {
    const views = doc.data().metrics?.views;
    return sum + (typeof views === "number" ? views : 0);
  }, 0);
}
