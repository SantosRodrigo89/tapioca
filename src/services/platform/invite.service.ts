import { randomUUID } from "crypto";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { TenantInvite } from "@/types/platform/invite";
import {
  getInviteByIdServer,
  getInviteByTokenServer,
  updateInviteResendServer,
  updateInviteStatusServer,
} from "@/lib/repositories/server/platform/invite.server";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import { getPlatformSettingsServer } from "@/lib/repositories/server/platform/platform-settings.server";
import { logAuditEvent } from "@/services/platform/audit.service";

export class InviteError extends Error {
  constructor(
    message: string,
    readonly code:
      | "NOT_FOUND"
      | "INVALID_STATUS"
      | "EXPIRED"
      | "TENANT_TAKEN"
      | "EMAIL_EXISTS"
      | "EMAIL_MISMATCH"
      | "PASSWORD_REQUIRED",
  ) {
    super(message);
    this.name = "InviteError";
  }
}

export interface InvitePreview {
  id: string;
  tenantName: string;
  email: string;
  adminName: string;
  planId: TenantInvite["planId"];
  status: TenantInvite["status"];
  expiresAt: Date;
  expired: boolean;
}

export async function resolveInviteExpiry(
  invite: TenantInvite,
): Promise<TenantInvite> {
  if (invite.status !== "pending") return invite;
  if (invite.expiresAt.getTime() > Date.now()) return invite;

  await updateInviteStatusServer(invite.id, "expired");
  return { ...invite, status: "expired" };
}

export async function getInvitePreviewByTokenServer(
  token: string,
): Promise<InvitePreview | null> {
  const invite = await getInviteByTokenServer(token);
  if (!invite) return null;

  const resolved = await resolveInviteExpiry(invite);

  return {
    id: resolved.id,
    tenantName: resolved.tenantName,
    email: resolved.email,
    adminName: resolved.adminName,
    planId: resolved.planId,
    status: resolved.status,
    expiresAt: resolved.expiresAt,
    expired: resolved.status === "expired",
  };
}

function buildInviteLink(token: string, appOrigin: string): string {
  const base = appOrigin.replace(/\/$/, "");
  return `${base}/auth/invite/${token}`;
}

export async function acceptInviteServer(
  token: string,
  options: {
    password?: string;
    sessionUser?: { uid: string; email?: string | null } | null;
  },
): Promise<{ tenantId: string; slug: string; email: string; uid: string }> {
  const invite = await getInviteByTokenServer(token);
  if (!invite) {
    throw new InviteError("Convite não encontrado.", "NOT_FOUND");
  }

  const resolved = await resolveInviteExpiry(invite);
  if (resolved.status !== "pending") {
    if (resolved.status === "expired") {
      throw new InviteError("Este convite expirou.", "EXPIRED");
    }
    throw new InviteError("Este convite não está mais disponível.", "INVALID_STATUS");
  }

  const tenant = await getTenantByIdServer(resolved.tenantId);
  if (!tenant) {
    throw new InviteError("Restaurante não encontrado.", "NOT_FOUND");
  }

  if (tenant.ownerUid && tenant.ownerUid !== options.sessionUser?.uid) {
    throw new InviteError(
      "Este restaurante já possui um administrador.",
      "TENANT_TAKEN",
    );
  }

  let uid: string;

  if (options.sessionUser) {
    if (
      options.sessionUser.email?.toLowerCase() !== resolved.email.toLowerCase()
    ) {
      throw new InviteError(
        "Faça login com o e-mail do convite para aceitar.",
        "EMAIL_MISMATCH",
      );
    }
    uid = options.sessionUser.uid;
  } else if (options.password) {
    const existing = await adminAuth.getUserByEmail(resolved.email).catch(() => null);
    if (existing) {
      throw new InviteError(
        "Este e-mail já possui conta. Faça login para aceitar o convite.",
        "EMAIL_EXISTS",
      );
    }

    const userRecord = await adminAuth.createUser({
      email: resolved.email,
      password: options.password,
      displayName: resolved.adminName,
    });
    uid = userRecord.uid;
  } else {
    throw new InviteError("Informe uma senha para criar sua conta.", "PASSWORD_REQUIRED");
  }

  const acceptedAt = new Date();

  await adminDb.doc(`tenants/${resolved.tenantId}`).update({
    ownerUid: uid,
    whatsapp: resolved.adminPhone ?? tenant.whatsapp ?? null,
    updatedAt: FieldValue.serverTimestamp(),
  });

  await updateInviteStatusServer(resolved.id, "accepted", { acceptedAt });

  await adminAuth.setCustomUserClaims(uid, {
    role: "tenant_admin",
    tenantId: resolved.tenantId,
  });

  await logAuditEvent({
    type: "invite_accepted",
    actorUid: uid,
    actorEmail: resolved.email,
    tenantId: resolved.tenantId,
    tenantName: resolved.tenantName,
    metadata: { inviteId: resolved.id },
  });

  return {
    tenantId: resolved.tenantId,
    slug: tenant.slug,
    email: resolved.email,
    uid,
  };
}

export async function resendInviteServer(
  inviteId: string,
  appOrigin: string,
): Promise<{ token: string; inviteLink: string; expiresAt: Date }> {
  const invite = await getInviteByIdServer(inviteId);
  if (!invite) {
    throw new InviteError("Convite não encontrado.", "NOT_FOUND");
  }

  if (invite.status === "accepted") {
    throw new InviteError("Convite já foi aceito.", "INVALID_STATUS");
  }
  if (invite.status === "cancelled") {
    throw new InviteError("Convite cancelado não pode ser reenviado.", "INVALID_STATUS");
  }

  const settings = await getPlatformSettingsServer();
  const token = randomUUID();
  const sentAt = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + settings.inviteExpiryDays);

  await updateInviteResendServer(inviteId, token, sentAt, expiresAt);

  return {
    token,
    inviteLink: buildInviteLink(token, appOrigin),
    expiresAt,
  };
}

export async function cancelInviteServer(inviteId: string): Promise<void> {
  const invite = await getInviteByIdServer(inviteId);
  if (!invite) {
    throw new InviteError("Convite não encontrado.", "NOT_FOUND");
  }

  if (invite.status === "accepted") {
    throw new InviteError("Convite já foi aceito.", "INVALID_STATUS");
  }
  if (invite.status === "cancelled") {
    return;
  }

  await updateInviteStatusServer(inviteId, "cancelled");
}

export function getInviteLinkFromToken(token: string, appOrigin: string): string {
  return buildInviteLink(token, appOrigin);
}
