import { adminDb } from "@/lib/firebase/admin";
import type { GalleryImage } from "@/types";

function docToGalleryImage(
  id: string,
  data: FirebaseFirestore.DocumentData,
): GalleryImage {
  return {
    id,
    url: data.url as string,
    caption: data.caption ?? undefined,
    order: data.order as number,
    createdAt: (data.createdAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export async function getGalleryByTenantServer(
  tenantId: string,
): Promise<GalleryImage[]> {
  const snap = await adminDb
    .collection(`tenants/${tenantId}/gallery`)
    .orderBy("order", "asc")
    .get();

  return snap.docs.map((d) => docToGalleryImage(d.id, d.data()));
}
