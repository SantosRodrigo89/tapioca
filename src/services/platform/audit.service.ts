import type { AuditEventType } from "@/types/platform/audit-log";
import { createAuditLogServer } from "@/lib/repositories/server/platform/audit-log.server";

export async function logAuditEvent(input: {
  type: AuditEventType;
  actorUid?: string;
  actorEmail?: string;
  tenantId?: string;
  tenantName?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await createAuditLogServer(input);
  } catch (err) {
    console.error("[audit]", err);
  }
}
