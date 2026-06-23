import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Tenant, TenantStatus } from "@/types";
import { generateSlug } from "@/lib/utils";

function docToTenant(id: string, data: Record<string, unknown>): Tenant {
  return {
    id,
    slug: data.slug as string,
    name: data.name as string,
    description: data.description as string | undefined,
    logoUrl: data.logoUrl as string | undefined,
    address: data.address as string | undefined,
    whatsapp: data.whatsapp as string | undefined,
    status: data.status as TenantStatus,
    ownerUid: data.ownerUid as string,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  };
}

export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  const snap = await getDoc(doc(db, "tenants", tenantId));
  if (!snap.exists()) return null;
  return docToTenant(snap.id, snap.data() as Record<string, unknown>);
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const indexSnap = await getDoc(doc(db, "slugIndex", slug));
  if (!indexSnap.exists()) return null;
  const { tenantId } = indexSnap.data() as { tenantId: string };
  return getTenantById(tenantId);
}

export interface CreateTenantData {
  ownerUid: string;
  restaurantName: string;
  description?: string;
  address?: string;
  whatsapp?: string;
}

export async function createTenant(
  tenantId: string,
  data: CreateTenantData,
): Promise<Tenant> {
  const slug = generateSlug(data.restaurantName);
  const now = serverTimestamp();

  const tenantData = {
    id: tenantId,
    slug,
    name: data.restaurantName,
    description: data.description ?? null,
    logoUrl: null,
    address: data.address ?? null,
    whatsapp: data.whatsapp ?? null,
    status: "trial" as TenantStatus,
    ownerUid: data.ownerUid,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, "tenants", tenantId), tenantData);
  await setDoc(doc(db, "slugIndex", slug), {
    tenantId,
    createdAt: now,
  });

  const snap = await getDoc(doc(db, "tenants", tenantId));
  return docToTenant(snap.id, snap.data() as Record<string, unknown>);
}

export interface UpdateTenantData {
  name?: string;
  description?: string;
  address?: string;
  whatsapp?: string;
  logoUrl?: string;
}

export async function updateTenant(
  tenantId: string,
  data: UpdateTenantData,
): Promise<void> {
  await updateDoc(doc(db, "tenants", tenantId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
