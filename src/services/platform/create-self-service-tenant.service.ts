import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { getDefaultPlanId } from "@/lib/platform/plans/default-plans";
import { getDefaultTemplateId } from "@/lib/platform/templates/default-templates";
import { getPlanByIdServer } from "@/lib/repositories/server/platform/plan.server";
import { getTemplateByIdServer } from "@/lib/repositories/server/platform/template.server";
import { getPlatformSettingsServer } from "@/lib/repositories/server/platform/platform-settings.server";
import {
  createDefaultSiteConfig,
  mergeSiteConfigPatch,
} from "@/services/site.service";
import { DEFAULT_TENANT_THEME } from "@/lib/utils/theme";

export class SelfServiceTenantError extends Error {
  constructor(
    message: string,
    readonly code: "USER_NOT_FOUND" | "SLUG_TAKEN" | "INVALID_SLUG",
  ) {
    super(message);
    this.name = "SelfServiceTenantError";
  }
}

export interface CreateSelfServiceTenantInput {
  uid: string;
  restaurantName: string;
  slug: string;
}

export interface CreateSelfServiceTenantResult {
  tenantId: string;
  slug: string;
}

export async function createSelfServiceTenantServer(
  input: CreateSelfServiceTenantInput,
): Promise<CreateSelfServiceTenantResult> {
  const userRecord = await adminAuth.getUser(input.uid).catch(() => null);
  if (!userRecord) {
    throw new SelfServiceTenantError("Usuário não encontrado.", "USER_NOT_FOUND");
  }

  const slugSnap = await adminDb.doc(`slugIndex/${input.slug}`).get();
  if (slugSnap.exists) {
    throw new SelfServiceTenantError(
      "Nome do restaurante já está em uso. Tente um nome diferente.",
      "SLUG_TAKEN",
    );
  }

  const settings = await getPlatformSettingsServer();
  const planId = settings.defaultPlanId ?? getDefaultPlanId();
  const templateId = getDefaultTemplateId();

  const [plan, template] = await Promise.all([
    getPlanByIdServer(planId),
    getTemplateByIdServer(templateId),
  ]);

  const resolvedPlanId = plan ? planId : getDefaultPlanId();
  const tenantId = input.uid;
  const now = FieldValue.serverTimestamp();

  const siteConfig = mergeSiteConfigPatch(
    createDefaultSiteConfig(),
    template?.siteConfigPreset ?? {},
  );
  if (!siteConfig.hero.title) {
    siteConfig.hero.title = input.restaurantName;
  }
  if (!siteConfig.seo.title) {
    siteConfig.seo.title = input.restaurantName;
  }

  const theme = template?.themePreset ?? DEFAULT_TENANT_THEME;

  const batch = adminDb.batch();

  batch.set(adminDb.doc(`tenants/${tenantId}`), {
    id: tenantId,
    slug: input.slug,
    name: input.restaurantName,
    description: null,
    logoUrl: null,
    address: null,
    whatsapp: null,
    theme,
    siteConfig,
    status: "trial",
    ownerUid: input.uid,
    planId: resolvedPlanId,
    templateId: template ? templateId : null,
    category: template?.category ?? "restaurante",
    createdBy: "signup",
    lastAccessAt: now,
    createdAt: now,
    updatedAt: now,
  });

  batch.set(adminDb.doc(`slugIndex/${input.slug}`), {
    tenantId,
    createdAt: now,
  });

  await batch.commit();

  await adminAuth.setCustomUserClaims(input.uid, {
    role: "tenant_admin",
    tenantId,
  });

  return { tenantId, slug: input.slug };
}
