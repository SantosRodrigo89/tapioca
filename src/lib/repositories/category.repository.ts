import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { ensureClientAuthForWrite } from "@/lib/firebase/ensure-client-auth";
import type { Category } from "@/types";

function timestampToDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  return new Date();
}

import type { AvailabilitySchedule } from "@/types";

function parseAvailability(
  data: Record<string, unknown>,
): AvailabilitySchedule | undefined {
  const raw = data.availability as AvailabilitySchedule | undefined;
  if (!raw?.enabled) return undefined;
  return raw;
}

function docToCategory(id: string, data: Record<string, unknown>): Category {
  return {
    id,
    name: data.name as string,
    order: data.order as number,
    active: data.active as boolean,
    availability: parseAvailability(data),
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
}

function categoriesRef(tenantId: string) {
  return collection(getClientDb(), "tenants", tenantId, "categories");
}

export async function getCategoriesByTenant(
  tenantId: string,
  { activeOnly = false }: { activeOnly?: boolean } = {},
): Promise<Category[]> {
  const ref = categoriesRef(tenantId);
  const q = activeOnly
    ? query(ref, where("active", "==", true), orderBy("order", "asc"))
    : query(ref, orderBy("order", "asc"));

  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    docToCategory(d.id, d.data() as Record<string, unknown>),
  );
}

export async function getCategoryById(
  tenantId: string,
  categoryId: string,
): Promise<Category | null> {
  const snap = await getDoc(doc(categoriesRef(tenantId), categoryId));
  if (!snap.exists()) return null;
  return docToCategory(snap.id, snap.data() as Record<string, unknown>);
}

export async function createCategory(
  tenantId: string,
  data: {
    name: string;
    active?: boolean;
    order?: number;
    availability?: AvailabilitySchedule;
  },
): Promise<Category> {
  await ensureClientAuthForWrite(tenantId);
  const existing = await getCategoriesByTenant(tenantId);
  const nextOrder =
    data.order ?? (existing.length > 0
      ? Math.max(...existing.map((c) => c.order)) + 1
      : 0);

  const ref = await addDoc(categoriesRef(tenantId), {
    name: data.name,
    order: nextOrder,
    active: data.active ?? true,
    ...(data.availability?.enabled ? { availability: data.availability } : {}),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: ref.id,
    name: data.name,
    order: nextOrder,
    active: data.active ?? true,
    availability: data.availability?.enabled ? data.availability : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateCategory(
  tenantId: string,
  categoryId: string,
  data: {
    name?: string;
    active?: boolean;
    order?: number;
    availability?: AvailabilitySchedule | null;
  },
): Promise<void> {
  await ensureClientAuthForWrite(tenantId);
  const payload: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (data.availability === null) {
    payload.availability = null;
  } else if (data.availability && !data.availability.enabled) {
    payload.availability = null;
  }

  await updateDoc(doc(categoriesRef(tenantId), categoryId), payload);
}

export async function deleteCategory(
  tenantId: string,
  categoryId: string,
): Promise<void> {
  await ensureClientAuthForWrite(tenantId);
  await deleteDoc(doc(categoriesRef(tenantId), categoryId));
}
