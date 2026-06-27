import type { AuditEventType } from "@/types/platform/audit-log";

export const AUDIT_EVENT_LABELS: Record<AuditEventType, string> = {
  tenant_created: "Restaurante criado",
  invite_accepted: "Convite aceito",
  login: "Login",
  plan_changed: "Plano alterado",
  settings_changed: "Configurações alteradas",
  suspended: "Suspensão",
  reactivated: "Reativação",
};

export const AUDIT_EVENT_FILTERS: { value: AuditEventType | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "tenant_created", label: AUDIT_EVENT_LABELS.tenant_created },
  { value: "invite_accepted", label: AUDIT_EVENT_LABELS.invite_accepted },
  { value: "login", label: AUDIT_EVENT_LABELS.login },
  { value: "plan_changed", label: AUDIT_EVENT_LABELS.plan_changed },
  { value: "settings_changed", label: AUDIT_EVENT_LABELS.settings_changed },
  { value: "suspended", label: AUDIT_EVENT_LABELS.suspended },
  { value: "reactivated", label: AUDIT_EVENT_LABELS.reactivated },
];

export interface AuditLogClientItem {
  id: string;
  type: AuditEventType;
  actorUid?: string;
  actorEmail?: string;
  tenantId?: string;
  tenantName?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogsPageData {
  items: AuditLogClientItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
