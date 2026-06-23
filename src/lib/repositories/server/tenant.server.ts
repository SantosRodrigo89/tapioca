import { adminDb } from "@/lib/firebase/admin";
import type { Tenant, TenantStatus } from "@/types";

function docToTenant(id: string, data: FirebaseFirestore.DocumentData): Tenant {
  return {
    id,
    slug: data.slug as string,
    name: data.name as string,
    description: data.description ?? undefined,
    logoUrl: data.logoUrl ?? undefined,
    address: data.address ?? undefined,
    whatsapp: data.whatsapp ?? undefined,
    status: data.status as TenantStatus,
    ownerUid: data.ownerUid as string,
    createdAt: (data.createdAt as FirebaseFirestore.Timestamp).toDate(),
    updatedAt: (data.updatedAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export async function getTenantByIdServer(tenantId: string): Promise<Tenant | null> {
  const snap = await adminDb.doc(`tenants/${tenantId}`).get();
  if (!snap.exists) return null;
  return docToTenant(snap.id, snap.data()!);
}

export async function getTenantBySlugServer(slug: string): Promise<Tenant | null> {
  const indexSnap = await adminDb.doc(`slugIndex/${slug}`).get();
  if (!indexSnap.exists) return null;
  const { tenantId } = indexSnap.data() as { tenantId: string };
  return getTenantByIdServer(tenantId);
}
