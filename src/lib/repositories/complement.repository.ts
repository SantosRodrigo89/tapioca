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
import { notifyPublicLandingChanged } from "@/lib/cache/notify-public-landing";
import { getCategoriesByTenant } from "@/lib/repositories/category.repository";
import { getItemsByCategory } from "@/lib/repositories/menu-item.repository";
import type { Complement } from "@/types";

function timestampToDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  return new Date();
}

function optionalStringToFirestore(value: string | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function docToComplement(id: string, data: Record<string, unknown>): Complement {
  return {
    id,
    name: data.name as string,
    description: (data.description as string | null) ?? undefined,
    price: data.price as number,
    imageUrl: (data.imageUrl as string | null) ?? undefined,
    enabled: data.enabled as boolean,
    order: data.order as number,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
}

function complementsRef(tenantId: string) {
  return collection(getClientDb(), "tenants", tenantId, "complements");
}

export async function getComplementsByTenant(
  tenantId: string,
  { enabledOnly = false }: { enabledOnly?: boolean } = {},
): Promise<Complement[]> {
  const ref = complementsRef(tenantId);
  const q = enabledOnly
    ? query(ref, where("enabled", "==", true), orderBy("order", "asc"))
    : query(ref, orderBy("order", "asc"));

  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    docToComplement(d.id, d.data() as Record<string, unknown>),
  );
}

export async function getComplementById(
  tenantId: string,
  complementId: string,
): Promise<Complement | null> {
  const snap = await getDoc(doc(complementsRef(tenantId), complementId));
  if (!snap.exists()) return null;
  return docToComplement(snap.id, snap.data() as Record<string, unknown>);
}

export async function createComplement(
  tenantId: string,
  data: {
    name: string;
    description?: string;
    price: number;
    enabled?: boolean;
    order?: number;
  },
): Promise<Complement> {
  await ensureClientAuthForWrite(tenantId);
  const existing = await getComplementsByTenant(tenantId);
  const nextOrder =
    data.order ??
    (existing.length > 0 ? Math.max(...existing.map((c) => c.order)) + 1 : 0);

  const description = optionalStringToFirestore(data.description);

  const ref = await addDoc(complementsRef(tenantId), {
    name: data.name,
    description,
    price: data.price,
    enabled: data.enabled ?? true,
    order: nextOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  notifyPublicLandingChanged(tenantId);

  return {
    id: ref.id,
    name: data.name,
    description: description ?? undefined,
    price: data.price,
    enabled: data.enabled ?? true,
    order: nextOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateComplement(
  tenantId: string,
  complementId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    enabled?: boolean;
    order?: number;
    imageUrl?: string | null;
  },
): Promise<void> {
  await ensureClientAuthForWrite(tenantId);

  const payload: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (data.description !== undefined) {
    payload.description = optionalStringToFirestore(data.description);
  }

  await updateDoc(doc(complementsRef(tenantId), complementId), payload);
  notifyPublicLandingChanged(tenantId);
}

export async function deleteComplement(
  tenantId: string,
  complementId: string,
): Promise<void> {
  await ensureClientAuthForWrite(tenantId);
  await deleteDoc(doc(complementsRef(tenantId), complementId));
  notifyPublicLandingChanged(tenantId);
}

export interface ComplementUsageProduct {
  categoryId: string;
  itemId: string;
  name: string;
}

export async function getComplementUsage(
  tenantId: string,
  complementId: string,
): Promise<{ count: number; products: ComplementUsageProduct[] }> {
  const categories = await getCategoriesByTenant(tenantId);
  const products: ComplementUsageProduct[] = [];

  await Promise.all(
    categories.map(async (category) => {
      const items = await getItemsByCategory(tenantId, category.id);
      for (const item of items) {
        if (item.complementIds?.includes(complementId)) {
          products.push({
            categoryId: category.id,
            itemId: item.id,
            name: item.name,
          });
        }
      }
    }),
  );

  return { count: products.length, products };
}

export async function removeComplementFromProducts(
  tenantId: string,
  complementId: string,
  products: ComplementUsageProduct[],
): Promise<void> {
  const { updateMenuItem } = await import(
    "@/lib/repositories/menu-item.repository"
  );

  await Promise.all(
    products.map(async ({ categoryId, itemId }) => {
      const items = await getItemsByCategory(tenantId, categoryId);
      const item = items.find((candidate) => candidate.id === itemId);
      if (!item?.complementIds?.includes(complementId)) return;

      const nextIds = item.complementIds.filter((id) => id !== complementId);
      await updateMenuItem(tenantId, categoryId, itemId, {
        complementIds: nextIds.length > 0 ? nextIds : null,
      });
    }),
  );
}
