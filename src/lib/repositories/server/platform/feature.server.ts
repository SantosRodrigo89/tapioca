import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { PlatformFeature } from "@/types/platform/feature";

function docToFeature(
  id: string,
  data: FirebaseFirestore.DocumentData,
): PlatformFeature {
  return {
    id: id as PlatformFeature["id"],
    name: data.name as string,
    description: data.description as string,
    category: data.category as PlatformFeature["category"],
    globalEnabled: data.globalEnabled as boolean,
    defaultEnabled: data.defaultEnabled as boolean,
    order: data.order as number,
  };
}

export async function listFeaturesServer(): Promise<PlatformFeature[]> {
  const snap = await adminDb
    .collection("features")
    .orderBy("order", "asc")
    .get();
  return snap.docs.map((doc) => docToFeature(doc.id, doc.data()));
}

export async function getFeatureByIdServer(
  featureId: string,
): Promise<PlatformFeature | null> {
  const snap = await adminDb.doc(`features/${featureId}`).get();
  if (!snap.exists) return null;
  return docToFeature(snap.id, snap.data()!);
}

export async function upsertFeatureServer(
  feature: PlatformFeature,
): Promise<void> {
  await adminDb.doc(`features/${feature.id}`).set(
    {
      name: feature.name,
      description: feature.description,
      category: feature.category,
      globalEnabled: feature.globalEnabled,
      defaultEnabled: feature.defaultEnabled,
      order: feature.order,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export async function updateFeatureGlobalServer(
  featureId: string,
  globalEnabled: boolean,
): Promise<void> {
  await adminDb.doc(`features/${featureId}`).update({
    globalEnabled,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
