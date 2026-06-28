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
import { parseConfigurationGroups } from "@/lib/catalog/parse-configuration";
import { serializeConfigurationGroups } from "@/lib/catalog/serialize-configuration";
import type { MenuItem, ConfigurationGroup } from "@/types";

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

function parseComplementIds(
  data: Record<string, unknown>,
): string[] | undefined {
  const raw = data.complementIds;
  if (!Array.isArray(raw)) return undefined;
  const ids = raw.filter((id): id is string => typeof id === "string" && id.length > 0);
  return ids.length > 0 ? ids : undefined;
}

function docToMenuItem(id: string, data: Record<string, unknown>): MenuItem {
  return {
    id,
    name: data.name as string,
    description: data.description as string | undefined,
    price: data.price as number,
    imageUrl: data.imageUrl as string | undefined,
    available: data.available as boolean,
    availability: parseAvailability(data),
    configurationGroups: parseConfigurationGroups(data.configurationGroups),
    complementIds: parseComplementIds(data),
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
    availability?: AvailabilitySchedule;
    configurationGroups?: ConfigurationGroup[];
    complementIds?: string[];
    order?: number;
  },
): Promise<MenuItem> {
  await ensureClientAuthForWrite(tenantId);
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
    ...(data.availability?.enabled ? { availability: data.availability } : {}),
    configurationGroups: serializeConfigurationGroups(data.configurationGroups),
    complementIds:
      data.complementIds && data.complementIds.length > 0
        ? data.complementIds
        : null,
    order: nextOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  notifyPublicLandingChanged(tenantId);

  return {
    id: ref.id,
    name: data.name,
    description: data.description,
    price: data.price,
    imageUrl: data.imageUrl,
    available: data.available ?? true,
    availability: data.availability?.enabled ? data.availability : undefined,
    configurationGroups: data.configurationGroups,
    complementIds: data.complementIds,
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
    availability?: AvailabilitySchedule | null;
    configurationGroups?: ConfigurationGroup[] | null;
    complementIds?: string[] | null;
    order?: number;
  },
): Promise<void> {
  await ensureClientAuthForWrite(tenantId);
  const payload: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (data.configurationGroups !== undefined) {
    payload.configurationGroups = serializeConfigurationGroups(
      data.configurationGroups,
    );
  }

  if (data.complementIds !== undefined) {
    payload.complementIds =
      data.complementIds && data.complementIds.length > 0
        ? data.complementIds
        : null;
  }

  if (data.availability === null) {
    payload.availability = null;
  } else if (data.availability && !data.availability.enabled) {
    payload.availability = null;
  }

  await updateDoc(doc(itemsRef(tenantId, categoryId), itemId), payload);
  notifyPublicLandingChanged(tenantId);
}

export async function deleteMenuItem(
  tenantId: string,
  categoryId: string,
  itemId: string,
): Promise<void> {
  await ensureClientAuthForWrite(tenantId);
  await deleteDoc(doc(itemsRef(tenantId, categoryId), itemId));
  notifyPublicLandingChanged(tenantId);
}
