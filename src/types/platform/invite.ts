import type { PlanId } from "./plan";

export type InviteStatus = "pending" | "accepted" | "expired" | "cancelled";

export interface TenantInvite {
  id: string;
  tenantId: string;
  tenantName: string;
  email: string;
  adminName: string;
  adminPhone?: string;
  planId: PlanId;
  token: string;
  status: InviteStatus;
  sentAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
