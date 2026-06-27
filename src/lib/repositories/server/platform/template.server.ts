import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { SiteTemplate } from "@/types/platform/template";

function docToTemplate(
  id: string,
  data: FirebaseFirestore.DocumentData,
): SiteTemplate {
  return {
    id,
    name: data.name as string,
    description: data.description as string,
    category: data.category as SiteTemplate["category"],
    thumbnailUrl: data.thumbnailUrl ?? undefined,
    siteConfigPreset: (data.siteConfigPreset as SiteTemplate["siteConfigPreset"]) ?? {},
    themePreset: data.themePreset ?? undefined,
    status: data.status as SiteTemplate["status"],
    order: data.order as number,
    createdAt: (data.createdAt as FirebaseFirestore.Timestamp).toDate(),
    updatedAt: (data.updatedAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export async function listTemplatesServer(): Promise<SiteTemplate[]> {
  const snap = await adminDb
    .collection("templates")
    .orderBy("order", "asc")
    .get();
  return snap.docs.map((doc) => docToTemplate(doc.id, doc.data()));
}

export async function getTemplateByIdServer(
  templateId: string,
): Promise<SiteTemplate | null> {
  const snap = await adminDb.doc(`templates/${templateId}`).get();
  if (!snap.exists) return null;
  return docToTemplate(snap.id, snap.data()!);
}

export async function upsertTemplateServer(
  template: Omit<SiteTemplate, "createdAt" | "updatedAt">,
): Promise<void> {
  const ref = adminDb.doc(`templates/${template.id}`);
  const existing = await ref.get();
  await ref.set(
    {
      ...template,
      updatedAt: FieldValue.serverTimestamp(),
      ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true },
  );
}

export async function updateTemplateServer(
  templateId: string,
  updates: Partial<Omit<SiteTemplate, "id" | "createdAt" | "updatedAt">>,
): Promise<SiteTemplate> {
  const existing = await getTemplateByIdServer(templateId);
  if (!existing) {
    throw new Error("TEMPLATE_NOT_FOUND");
  }

  const merged: Omit<SiteTemplate, "createdAt" | "updatedAt"> = {
    ...existing,
    ...updates,
    id: existing.id,
    siteConfigPreset: updates.siteConfigPreset ?? existing.siteConfigPreset,
  };

  await upsertTemplateServer(merged);
  const updated = await getTemplateByIdServer(templateId);
  if (!updated) throw new Error("TEMPLATE_NOT_FOUND");
  return updated;
}
