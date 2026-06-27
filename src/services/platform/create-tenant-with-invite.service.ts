import { randomUUID } from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { getDefaultPlanId } from "@/lib/platform/plans/default-plans";
import { getDefaultTemplateId } from "@/lib/platform/templates/default-templates";
import { getPlanByIdServer } from "@/lib/repositories/server/platform/plan.server";
import { getTemplateByIdServer } from "@/lib/repositories/server/platform/template.server";
import { getPlatformSettingsServer } from "@/lib/repositories/server/platform/platform-settings.server";
import { createInviteServer } from "@/lib/repositories/server/platform/invite.server";
import type { CreateTenantWizardInput } from "@/lib/schemas/platform/create-tenant-wizard.schema";
import {
  createDefaultSiteConfig,
  mergeSiteConfigPatch,
} from "@/services/site.service";
import { logAuditEvent } from "@/services/platform/audit.service";
import { DEFAULT_TENANT_THEME } from "@/lib/utils/theme";

export class CreateTenantError extends Error {
  constructor(
    message: string,
    readonly code: "SLUG_TAKEN" | "PLAN_NOT_FOUND" | "TEMPLATE_NOT_FOUND",
  ) {
    super(message);
    this.name = "CreateTenantError";
  }
}

export interface CreateTenantWithInviteResult {
  tenantId: string;
  slug: string;
  inviteId: string;
  inviteToken: string;
  inviteLink: string;
  expiresAt: Date;
}

function buildInviteLink(token: string, appOrigin: string): string {
  const base = appOrigin.replace(/\/$/, "");
  return `${base}/auth/invite/${token}`;
}

export async function createTenantWithInviteServer(
  input: CreateTenantWizardInput,
  options: { createdByUid: string; createdByEmail?: string | null; appOrigin: string },
): Promise<CreateTenantWithInviteResult> {
  const slugSnap = await adminDb.doc(`slugIndex/${input.slug}`).get();
  if (slugSnap.exists) {
    throw new CreateTenantError(
      "Este slug já está em uso. Escolha outro.",
      "SLUG_TAKEN",
    );
  }

  const planId = input.planId ?? getDefaultPlanId();
  const templateId = input.templateId ?? getDefaultTemplateId();

  const [plan, template, settings] = await Promise.all([
    getPlanByIdServer(planId),
    getTemplateByIdServer(templateId),
    getPlatformSettingsServer(),
  ]);

  if (!plan) {
    throw new CreateTenantError("Plano não encontrado.", "PLAN_NOT_FOUND");
  }
  if (!template) {
    throw new CreateTenantError("Template não encontrado.", "TEMPLATE_NOT_FOUND");
  }

  const tenantRef = adminDb.collection("tenants").doc();
  const tenantId = tenantRef.id;
  const now = FieldValue.serverTimestamp();
  const token = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + settings.inviteExpiryDays);

  const siteConfig = mergeSiteConfigPatch(
    createDefaultSiteConfig(),
    template.siteConfigPreset ?? {},
  );
  if (!siteConfig.hero.title) {
    siteConfig.hero.title = input.name;
  }
  if (!siteConfig.seo.title) {
    siteConfig.seo.title = input.name;
  }

  const theme = template.themePreset ?? DEFAULT_TENANT_THEME;
  const adminPhone = input.adminPhone?.trim() || undefined;

  const batch = adminDb.batch();

  batch.set(tenantRef, {
    id: tenantId,
    slug: input.slug,
    name: input.name,
    description: null,
    logoUrl: null,
    address: null,
    whatsapp: adminPhone ?? null,
    theme,
    siteConfig,
    status: "trial",
    ownerUid: "",
    planId,
    templateId,
    category: input.category,
    createdBy: "super_admin",
    createdAt: now,
    updatedAt: now,
  });

  batch.set(adminDb.doc(`slugIndex/${input.slug}`), {
    tenantId,
    createdAt: now,
  });

  await batch.commit();

  const inviteId = await createInviteServer({
    tenantId,
    tenantName: input.name,
    email: input.email,
    adminName: input.adminName,
    adminPhone,
    planId,
    token,
    status: "pending",
    sentAt: new Date(),
    expiresAt,
    createdBy: options.createdByUid,
  });

  await logAuditEvent({
    type: "tenant_created",
    actorUid: options.createdByUid,
    actorEmail: options.createdByEmail ?? undefined,
    tenantId,
    tenantName: input.name,
    metadata: {
      slug: input.slug,
      planId,
      templateId,
      inviteId,
      adminEmail: input.email,
    },
  });

  return {
    tenantId,
    slug: input.slug,
    inviteId,
    inviteToken: token,
    inviteLink: buildInviteLink(token, options.appOrigin),
    expiresAt,
  };
}
