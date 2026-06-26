import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
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
  await updateDoc(doc(getClientDb(), "tenants", tenantId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function updateSiteConfig(
  tenantId: string,
  patch: Partial<SiteConfig>,
  existing?: SiteConfig,
): Promise<void> {
  const base = existing ?? createDefaultSiteConfig();
  const siteConfig = mergeSiteConfigPatch(base, patch);

  await updateDoc(doc(getClientDb(), "tenants", tenantId), {
    siteConfig,
    updatedAt: serverTimestamp(),
  });
}
