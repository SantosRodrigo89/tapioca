import type { InviteStatus } from "@/types/platform/invite";
import type { PlanId } from "@/types/platform/plan";

import type { TenantInvite } from "@/types/platform/invite";

export interface InviteListItem {
  id: string;
  tenantId: string;
  tenantName: string;
  email: string;
  adminName: string;
  adminPhone?: string;
  planId: PlanId;
  token: string;
  status: InviteStatus;
  sentAt: string;
  expiresAt: string;
  acceptedAt?: string;
  createdBy: string;
}

export function serializeInviteForClient(invite: TenantInvite): InviteListItem {
  return {
    id: invite.id,
    tenantId: invite.tenantId,
    tenantName: invite.tenantName,
    email: invite.email,
    adminName: invite.adminName,
    adminPhone: invite.adminPhone,
    planId: invite.planId,
    token: invite.token,
    status: invite.status,
    sentAt: invite.sentAt.toISOString(),
    expiresAt: invite.expiresAt.toISOString(),
    acceptedAt: invite.acceptedAt?.toISOString(),
    createdBy: invite.createdBy,
  };
}

export function getInvitePublicLink(token: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/invite/${token}`;
  }
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  return `${base}/auth/invite/${token}`;
}
