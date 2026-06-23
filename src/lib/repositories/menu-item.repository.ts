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
import type { MenuItem } from "@/types";

function timestampToDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  return new Date();
}

function docToMenuItem(id: string, data: Record<string, unknown>): MenuItem {
  return {
    id,
    name: data.name as string,
    description: data.description as string | undefined,
    price: data.price as number,
    imageUrl: data.imageUrl as string | undefined,
    available: data.available as boolean,
    order: data.order as number,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
}

function itemsRef(tenantId: string, categoryId: string) {
  return collection(getClientDb(), "tenants", tenantId, "categories", categoryId, "items");
}

export async function getItemsByCategory(
  tenantId: string,
  categoryId: string,
  { availableOnly = false }: { availableOnly?: boolean } = {},
): Promise<MenuItem[]> {
  const ref = itemsRef(tenantId, categoryId);
  const q = availableOnly
    ? query(ref, where("available", "==", true), orderBy("order", "asc"))
    : query(ref, orderBy("order", "asc"));

  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    docToMenuItem(d.id, d.data() as Record<string, unknown>),
  );
}

export async function getMenuItemById(
  tenantId: string,
  categoryId: string,
  itemId: string,
): Promise<MenuItem | null> {
  const snap = await getDoc(doc(itemsRef(tenantId, categoryId), itemId));
  if (!snap.exists()) return null;
  return docToMenuItem(snap.id, snap.data() as Record<string, unknown>);
}

export async function createMenuItem(
  tenantId: string,
  categoryId: string,
  data: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    available?: boolean;
    order?: number;
  },
): Promise<MenuItem> {
  const existing = await getItemsByCategory(tenantId, categoryId);
  const nextOrder =
    data.order ?? (existing.length > 0
      ? Math.max(...existing.map((i) => i.order)) + 1
      : 0);

  const ref = await addDoc(itemsRef(tenantId, categoryId), {
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    imageUrl: data.imageUrl ?? null,
    available: data.available ?? true,
    order: nextOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: ref.id,
    name: data.name,
    description: data.description,
    price: data.price,
    imageUrl: data.imageUrl,
    available: data.available ?? true,
    order: nextOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateMenuItem(
  tenantId: string,
  categoryId: string,
  itemId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string | null;
    available?: boolean;
    order?: number;
  },
): Promise<void> {
  await updateDoc(doc(itemsRef(tenantId, categoryId), itemId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMenuItem(
  tenantId: string,
  categoryId: string,
  itemId: string,
): Promise<void> {
  await deleteDoc(doc(itemsRef(tenantId, categoryId), itemId));
}
