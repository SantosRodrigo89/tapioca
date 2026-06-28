import { adminDb } from "@/lib/firebase/admin";
import type { Complement } from "@/types";

function docToComplement(
  id: string,
  data: FirebaseFirestore.DocumentData,
): Complement {
  return {
    id,
    name: data.name as string,
    description: data.description ?? undefined,
    price: data.price as number,
    imageUrl: data.imageUrl ?? undefined,
    enabled: data.enabled as boolean,
    order: data.order as number,
    createdAt: (data.createdAt as FirebaseFirestore.Timestamp).toDate(),
    updatedAt: (data.updatedAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export async function getComplementsByTenantServer(
  tenantId: string,
  { enabledOnly = false }: { enabledOnly?: boolean } = {},
): Promise<Complement[]> {
  let query = adminDb
    .collection(`tenants/${tenantId}/complements`)
    .orderBy("order", "asc") as FirebaseFirestore.Query;

  if (enabledOnly) {
    query = query.where("enabled", "==", true);
  }

  const snap = await query.get();
  return snap.docs.map((d) => docToComplement(d.id, d.data()));
}
