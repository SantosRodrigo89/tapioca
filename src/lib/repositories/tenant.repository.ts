import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { ensureClientAuthForWrite } from "@/lib/firebase/ensure-client-auth";
import { notifyPublicLandingChanged } from "@/lib/cache/notify-public-landing";
import { stripUndefined } from "@/lib/firestore/sanitize";
import {
  createDefaultSiteConfig,
  mergeSiteConfigPatch,
} from "@/services/site.service";
import type { DaySchedule, SiteConfig, TenantTheme } from "@/types";

export interface UpdateTenantData {
  name?: string;
  description?: string;
  address?: string;
  whatsapp?: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  theme?: TenantTheme;
  openingHours?: DaySchedule[];
  highlightItemIds?: string[];
}

export async function updateTenant(
  tenantId: string,
  data: UpdateTenantData,
): Promise<void> {
  await ensureClientAuthForWrite(tenantId);
  await updateDoc(doc(getClientDb(), "tenants", tenantId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
  notifyPublicLandingChanged(tenantId);
}

export async function updateSiteConfig(
  tenantId: string,
  patch: Partial<SiteConfig>,
  existing?: SiteConfig,
): Promise<void> {
  await ensureClientAuthForWrite(tenantId);
  const base = existing ?? createDefaultSiteConfig();
  const siteConfig = stripUndefined(mergeSiteConfigPatch(base, patch));

  await updateDoc(doc(getClientDb(), "tenants", tenantId), {
    siteConfig,
    updatedAt: serverTimestamp(),
  });
  notifyPublicLandingChanged(tenantId);
}
