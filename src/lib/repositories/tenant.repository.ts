import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";

export interface UpdateTenantData {
  name?: string;
  description?: string;
  address?: string;
  whatsapp?: string;
  logoUrl?: string;
}

export async function updateTenant(
  tenantId: string,
  data: UpdateTenantData,
): Promise<void> {
  await updateDoc(doc(getClientDb(), "tenants", tenantId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
