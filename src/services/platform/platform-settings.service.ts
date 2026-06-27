import type { PlatformSettings } from "@/types/platform/platform-settings";
import type { UpdatePlatformSettingsFormInput } from "@/lib/schemas/platform/platform-settings.schema";
import {
  getPlatformSettingsServer,
  upsertPlatformSettingsServer,
} from "@/lib/repositories/server/platform/platform-settings.server";
import { logAuditEvent } from "@/services/platform/audit.service";

function normalizeOptionalUrl(value: string | undefined): string | undefined {
  if (!value || value.trim() === "") return undefined;
  return value.trim();
}

function normalizeSettingsInput(
  input: UpdatePlatformSettingsFormInput,
): Omit<PlatformSettings, "updatedAt"> {
  const primaryColor = input.theme?.primaryColor?.trim();
  return {
    platformName: input.platformName.trim(),
    logoUrl: normalizeOptionalUrl(input.logoUrl),
    contactEmail: input.contactEmail.trim(),
    domain: input.domain.trim(),
    supportUrl: normalizeOptionalUrl(input.supportUrl),
    theme: primaryColor ? { primaryColor } : undefined,
    timezone: input.timezone,
    defaultPlanId: input.defaultPlanId,
    trialDays: input.trialDays,
    inviteExpiryDays: input.inviteExpiryDays,
  };
}

function settingsSnapshot(settings: PlatformSettings) {
  return {
    platformName: settings.platformName,
    contactEmail: settings.contactEmail,
    domain: settings.domain,
    defaultPlanId: settings.defaultPlanId,
    trialDays: settings.trialDays,
    inviteExpiryDays: settings.inviteExpiryDays,
  };
}

export async function updatePlatformSettingsAdminServer(
  input: UpdatePlatformSettingsFormInput,
  actor: { uid: string; email?: string | null },
): Promise<PlatformSettings> {
  const existing = await getPlatformSettingsServer();
  const normalized = normalizeSettingsInput(input);

  await upsertPlatformSettingsServer(normalized);
  const updated = await getPlatformSettingsServer();

  await logAuditEvent({
    type: "settings_changed",
    actorUid: actor.uid,
    actorEmail: actor.email ?? undefined,
    metadata: {
      before: settingsSnapshot(existing),
      after: settingsSnapshot(updated),
    },
  });

  return updated;
}
