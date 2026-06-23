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
import type { Category } from "@/types";

function timestampToDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  return new Date();
}

function docToCategory(id: string, data: Record<string, unknown>): Category {
  return {
    id,
    name: data.name as string,
    order: data.order as number,
    active: data.active as boolean,
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
  data: { name: string; active?: boolean; order?: number },
): Promise<Category> {
  const existing = await getCategoriesByTenant(tenantId);
  const nextOrder =
    data.order ?? (existing.length > 0
      ? Math.max(...existing.map((c) => c.order)) + 1
      : 0);

  const ref = await addDoc(categoriesRef(tenantId), {
    name: data.name,
    order: nextOrder,
    active: data.active ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: ref.id,
    name: data.name,
    order: nextOrder,
    active: data.active ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateCategory(
  tenantId: string,
  categoryId: string,
  data: { name?: string; active?: boolean; order?: number },
): Promise<void> {
  await updateDoc(doc(categoriesRef(tenantId), categoryId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(
  tenantId: string,
  categoryId: string,
): Promise<void> {
  await deleteDoc(doc(categoriesRef(tenantId), categoryId));
}
