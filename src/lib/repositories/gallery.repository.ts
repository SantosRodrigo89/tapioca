import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { ensureClientAuthForWrite } from "@/lib/firebase/ensure-client-auth";
import { notifyPublicLandingChanged } from "@/lib/cache/notify-public-landing";
import type { GalleryImage } from "@/types";

function timestampToDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  return new Date();
}

function docToGalleryImage(
  id: string,
  data: Record<string, unknown>,
): GalleryImage {
  return {
    id,
    url: data.url as string,
    caption: data.caption as string | undefined,
    order: data.order as number,
    createdAt: timestampToDate(data.createdAt),
  };
}

function galleryRef(tenantId: string) {
  return collection(getClientDb(), "tenants", tenantId, "gallery");
}

export async function listGalleryImages(
  tenantId: string,
): Promise<GalleryImage[]> {
  const q = query(galleryRef(tenantId), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    docToGalleryImage(d.id, d.data() as Record<string, unknown>),
  );
}

export async function createGalleryImage(
  tenantId: string,
  imageId: string,
  data: {
    url: string;
    caption?: string;
    order?: number;
  },
): Promise<GalleryImage> {
  await ensureClientAuthForWrite(tenantId);
  const existing = await listGalleryImages(tenantId);
  const nextOrder =
    data.order ??
    (existing.length > 0 ? Math.max(...existing.map((i) => i.order)) + 1 : 0);

  await setDoc(doc(galleryRef(tenantId), imageId), {
    url: data.url,
    ...(data.caption ? { caption: data.caption } : {}),
    order: nextOrder,
    createdAt: serverTimestamp(),
  });

  notifyPublicLandingChanged(tenantId);

  return {
    id: imageId,
    url: data.url,
    caption: data.caption,
    order: nextOrder,
    createdAt: new Date(),
  };
}

export async function updateGalleryImage(
  tenantId: string,
  imageId: string,
  data: {
    url?: string;
    caption?: string | null;
    order?: number;
  },
): Promise<void> {
  await ensureClientAuthForWrite(tenantId);
  const payload: Record<string, unknown> = { ...data };

  if (data.caption === null) {
    payload.caption = null;
  }

  await updateDoc(doc(galleryRef(tenantId), imageId), payload);
  notifyPublicLandingChanged(tenantId);
}

export async function deleteGalleryImage(
  tenantId: string,
  imageId: string,
): Promise<void> {
  await ensureClientAuthForWrite(tenantId);
  await deleteDoc(doc(galleryRef(tenantId), imageId));
  notifyPublicLandingChanged(tenantId);
}

export async function reorderGalleryImages(
  tenantId: string,
  updates: { id: string; order: number }[],
): Promise<void> {
  await Promise.all(
    updates.map(({ id, order }) =>
      updateGalleryImage(tenantId, id, { order }),
    ),
  );
}

export async function getGalleryImageById(
  tenantId: string,
  imageId: string,
): Promise<GalleryImage | null> {
  const snap = await getDoc(doc(galleryRef(tenantId), imageId));
  if (!snap.exists()) return null;
  return docToGalleryImage(snap.id, snap.data() as Record<string, unknown>);
}
