import { adminDb } from "@/lib/firebase/admin";
import type { MenuItem } from "@/types";

function docToMenuItem(
  id: string,
  data: FirebaseFirestore.DocumentData,
): MenuItem {
  return {
    id,
    name: data.name as string,
    description: data.description ?? undefined,
    price: data.price as number,
    imageUrl: data.imageUrl ?? undefined,
    available: data.available as boolean,
    order: data.order as number,
    createdAt: (data.createdAt as FirebaseFirestore.Timestamp).toDate(),
    updatedAt: (data.updatedAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export async function getItemsByCategoryServer(
  tenantId: string,
  categoryId: string,
  { availableOnly = false }: { availableOnly?: boolean } = {},
): Promise<MenuItem[]> {
  let query = adminDb
    .collection(`tenants/${tenantId}/categories/${categoryId}/items`)
    .orderBy("order", "asc") as FirebaseFirestore.Query;

  if (availableOnly) {
    query = query.where("available", "==", true);
  }

  const snap = await query.get();
  return snap.docs.map((d) => docToMenuItem(d.id, d.data()));
}
