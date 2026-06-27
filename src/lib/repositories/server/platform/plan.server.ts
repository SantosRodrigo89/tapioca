import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { Plan } from "@/types/platform/plan";

function docToPlan(id: string, data: FirebaseFirestore.DocumentData): Plan {
  return {
    id: id as Plan["id"],
    name: data.name as string,
    description: data.description as string,
    priceCents: data.priceCents as number,
    color: data.color as string,
    order: data.order as number,
    status: data.status as Plan["status"],
    features: (data.features as Plan["features"]) ?? {},
    createdAt: (data.createdAt as FirebaseFirestore.Timestamp).toDate(),
    updatedAt: (data.updatedAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export async function listPlansServer(): Promise<Plan[]> {
  const snap = await adminDb.collection("plans").orderBy("order", "asc").get();
  return snap.docs.map((doc) => docToPlan(doc.id, doc.data()));
}

export async function getPlanByIdServer(planId: string): Promise<Plan | null> {
  const snap = await adminDb.doc(`plans/${planId}`).get();
  if (!snap.exists) return null;
  return docToPlan(snap.id, snap.data()!);
}

export async function upsertPlanServer(
  plan: Omit<Plan, "createdAt" | "updatedAt">,
): Promise<void> {
  const ref = adminDb.doc(`plans/${plan.id}`);
  const existing = await ref.get();
  await ref.set(
    {
      ...plan,
      updatedAt: FieldValue.serverTimestamp(),
      ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true },
  );
}

export async function updatePlanServer(
  planId: string,
  updates: Partial<Omit<Plan, "id" | "createdAt" | "updatedAt">>,
): Promise<Plan> {
  const existing = await getPlanByIdServer(planId);
  if (!existing) {
    throw new Error("PLAN_NOT_FOUND");
  }

  const merged: Omit<Plan, "createdAt" | "updatedAt"> = {
    ...existing,
    ...updates,
    id: existing.id,
    features: updates.features ?? existing.features,
  };

  await upsertPlanServer(merged);
  const updated = await getPlanByIdServer(planId);
  if (!updated) throw new Error("PLAN_NOT_FOUND");
  return updated;
}
