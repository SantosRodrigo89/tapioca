import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { PlatformSettings } from "@/types/platform/platform-settings";
import { getDefaultPlanId } from "@/lib/platform/plans/default-plans";

export const PLATFORM_SETTINGS_DOC = "platform/settings";

export function getDefaultPlatformSettings(): Omit<PlatformSettings, "updatedAt"> {
  return {
    platformName: "Mesio",
    contactEmail: "contato@mesio.app",
    domain: "mesio.app",
    timezone: "America/Sao_Paulo",
    defaultPlanId: getDefaultPlanId(),
    trialDays: 14,
    inviteExpiryDays: 7,
  };
}

function docToSettings(data: FirebaseFirestore.DocumentData): PlatformSettings {
  return {
    platformName: data.platformName as string,
    logoUrl: data.logoUrl ?? undefined,
    contactEmail: data.contactEmail as string,
    domain: data.domain as string,
    supportUrl: data.supportUrl ?? undefined,
    theme: data.theme ?? undefined,
    timezone: data.timezone as string,
    defaultPlanId: data.defaultPlanId as string,
    trialDays: data.trialDays as number,
    inviteExpiryDays: data.inviteExpiryDays as number,
    updatedAt: (data.updatedAt as FirebaseFirestore.Timestamp).toDate(),
  };
}

export async function getPlatformSettingsServer(): Promise<PlatformSettings> {
  const snap = await adminDb.doc(PLATFORM_SETTINGS_DOC).get();
  if (!snap.exists) {
    const defaults = getDefaultPlatformSettings();
    return { ...defaults, updatedAt: new Date() };
  }
  return docToSettings(snap.data()!);
}

export async function upsertPlatformSettingsServer(
  settings: Omit<PlatformSettings, "updatedAt">,
): Promise<void> {
  await adminDb.doc(PLATFORM_SETTINGS_DOC).set(
    {
      ...settings,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}
