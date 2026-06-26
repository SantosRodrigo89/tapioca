import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { parseSiteConfigFromFirestore } from "@/lib/firestore/site-config";
import type {
  DaySchedule,
  Tenant,
  TenantStatus,
  TenantTheme,
} from "@/types";
import { DEFAULT_TENANT_THEME } from "@/lib/utils/theme";

function parseTheme(data: FirebaseFirestore.DocumentData): TenantTheme | undefined {
  const theme = data.theme as Record<string, string> | undefined;
  if (!theme?.primaryColor) return undefined;
  return {
    primaryColor: theme.primaryColor,
    primaryDarkColor: theme.primaryDarkColor ?? DEFAULT_TENANT_THEME.primaryDarkColor,
    secondaryColor: theme.secondaryColor ?? DEFAULT_TENANT_THEME.secondaryColor,
  };
}

function docToTenant(id: string, data: FirebaseFirestore.DocumentData): Tenant {
  return {
    id,
    slug: data.slug as string,
    name: data.name as string,
    description: data.description ?? undefined,
    logoUrl: data.logoUrl ?? undefined,
    bannerUrl: data.bannerUrl ?? undefined,
    address: data.address ?? undefined,
    whatsapp: data.whatsapp ?? undefined,
    theme: parseTheme(data),
    openingHours: (data.openingHours as DaySchedule[] | undefined) ?? undefined,
    highlightItemIds: (data.highlightItemIds as string[] | undefined) ?? undefined,
    siteConfig: parseSiteConfigFromFirestore(data.siteConfig),
    status: data.status as TenantStatus,
    ownerUid: data.ownerUid as string,
    createdAt: (data.createdAt as FirebaseFirestore.Timestamp).toDate(),
    updatedAt: (data.updatedAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export async function getTenantByIdServer(tenantId: string): Promise<Tenant | null> {
  const snap = await adminDb.doc(`tenants/${tenantId}`).get();
  if (!snap.exists) return null;
  return docToTenant(snap.id, snap.data()!);
}

export async function getTenantBySlugServer(slug: string): Promise<Tenant | null> {
  const indexSnap = await adminDb.doc(`slugIndex/${slug}`).get();
  if (!indexSnap.exists) return null;
  const { tenantId } = indexSnap.data() as { tenantId: string };
  return getTenantByIdServer(tenantId);
}

export async function listTenantsServer(): Promise<Tenant[]> {
  const snap = await adminDb
    .collection("tenants")
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((doc) => docToTenant(doc.id, doc.data()));
}

export async function updateTenantStatusServer(
  tenantId: string,
  status: TenantStatus,
): Promise<void> {
  await adminDb.doc(`tenants/${tenantId}`).update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
