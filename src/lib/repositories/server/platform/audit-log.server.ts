import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { AuditLog, AuditEventType } from "@/types/platform/audit-log";

function docToAuditLog(
  id: string,
  data: FirebaseFirestore.DocumentData,
): AuditLog {
  return {
    id,
    type: data.type as AuditEventType,
    actorUid: data.actorUid ?? undefined,
    actorEmail: data.actorEmail ?? undefined,
    tenantId: data.tenantId ?? undefined,
    tenantName: data.tenantName ?? undefined,
    metadata: data.metadata ?? undefined,
    createdAt: (data.createdAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export async function listAuditLogsServer(limit = 50): Promise<AuditLog[]> {
  const snap = await adminDb
    .collection("auditLogs")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((doc) => docToAuditLog(doc.id, doc.data()));
}

export async function createAuditLogServer(
  event: Omit<AuditLog, "id" | "createdAt">,
): Promise<string> {
  const ref = adminDb.collection("auditLogs").doc();
  await ref.set({
    ...event,
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}
