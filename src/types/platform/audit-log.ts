export type AuditEventType =
  | "tenant_created"
  | "invite_accepted"
  | "login"
  | "plan_changed"
  | "settings_changed"
  | "suspended"
  | "reactivated";

export interface AuditLog {
  id: string;
  type: AuditEventType;
  actorUid?: string;
  actorEmail?: string;
  tenantId?: string;
  tenantName?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
