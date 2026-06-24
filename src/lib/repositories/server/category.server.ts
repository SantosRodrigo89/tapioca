import { adminDb } from "@/lib/firebase/admin";
import type { Category, AvailabilitySchedule } from "@/types";

function parseAvailability(
  data: FirebaseFirestore.DocumentData,
): AvailabilitySchedule | undefined {
  const raw = data.availability as AvailabilitySchedule | undefined;
  if (!raw?.enabled) return undefined;
  return raw;
}

function docToCategory(
  id: string,
  data: FirebaseFirestore.DocumentData,
): Category {
  return {
    id,
    name: data.name as string,
    order: data.order as number,
    active: data.active as boolean,
    availability: parseAvailability(data),
    createdAt: (data.createdAt as FirebaseFirestore.Timestamp).toDate(),
    updatedAt: (data.updatedAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export async function getCategoriesByTenantServer(
  tenantId: string,
  { activeOnly = false }: { activeOnly?: boolean } = {},
): Promise<Category[]> {
  let query = adminDb
    .collection(`tenants/${tenantId}/categories`)
    .orderBy("order", "asc") as FirebaseFirestore.Query;

  if (activeOnly) {
    query = query.where("active", "==", true);
  }

  const snap = await query.get();
  return snap.docs.map((d) => docToCategory(d.id, d.data()));
}
