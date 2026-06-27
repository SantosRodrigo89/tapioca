import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { TenantInvite } from "@/types/platform/invite";

function docToInvite(
  id: string,
  data: FirebaseFirestore.DocumentData,
): TenantInvite {
  return {
    id,
    tenantId: data.tenantId as string,
    tenantName: data.tenantName as string,
    email: data.email as string,
    adminName: data.adminName as string,
    adminPhone: data.adminPhone ?? undefined,
    planId: data.planId as TenantInvite["planId"],
    token: data.token as string,
    status: data.status as TenantInvite["status"],
    sentAt: (data.sentAt as FirebaseFirestore.Timestamp).toDate(),
    expiresAt: (data.expiresAt as FirebaseFirestore.Timestamp).toDate(),
    acceptedAt: data.acceptedAt
      ? (data.acceptedAt as FirebaseFirestore.Timestamp).toDate()
      : undefined,
    createdBy: data.createdBy as string,
    createdAt: (data.createdAt as FirebaseFirestore.Timestamp).toDate(),
    updatedAt: (data.updatedAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export async function listInvitesServer(): Promise<TenantInvite[]> {
  const snap = await adminDb
    .collection("invites")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((doc) => docToInvite(doc.id, doc.data()));
}

export async function countPendingInvitesServer(): Promise<number> {
  const snap = await adminDb
    .collection("invites")
    .where("status", "==", "pending")
    .count()
    .get();
  return snap.data().count;
}

export async function getInviteByIdServer(
  inviteId: string,
): Promise<TenantInvite | null> {
  const snap = await adminDb.doc(`invites/${inviteId}`).get();
  if (!snap.exists) return null;
  return docToInvite(snap.id, snap.data()!);
}

export async function getInviteByTokenServer(
  token: string,
): Promise<TenantInvite | null> {
  const snap = await adminDb
    .collection("invites")
    .where("token", "==", token)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return docToInvite(doc.id, doc.data());
}

export async function createInviteServer(
  invite: Omit<TenantInvite, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const ref = adminDb.collection("invites").doc();
  await ref.set({
    ...invite,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateInviteStatusServer(
  inviteId: string,
  status: TenantInvite["status"],
  extra?: { acceptedAt?: Date },
): Promise<void> {
  await adminDb.doc(`invites/${inviteId}`).update({
    status,
    ...(extra?.acceptedAt ? { acceptedAt: extra.acceptedAt } : {}),
    updatedAt: FieldValue.serverTimestamp(),
  });
}
