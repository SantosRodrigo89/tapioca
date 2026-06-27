import type { PlatformSettings } from "@/types/platform/platform-settings";
import type { PlanId } from "@/types/platform/plan";

export interface PlatformSettingsClient {
  platformName: string;
  logoUrl?: string;
  contactEmail: string;
  domain: string;
  supportUrl?: string;
  theme?: { primaryColor?: string };
  timezone: string;
  defaultPlanId: PlanId;
  trialDays: number;
  inviteExpiryDays: number;
  updatedAt: string;
}

export interface PlanOption {
  id: PlanId;
  name: string;
}

export function serializePlatformSettingsForClient(
  settings: PlatformSettings,
): PlatformSettingsClient {
  return {
    platformName: settings.platformName,
    logoUrl: settings.logoUrl,
    contactEmail: settings.contactEmail,
    domain: settings.domain,
    supportUrl: settings.supportUrl,
    theme: settings.theme,
    timezone: settings.timezone,
    defaultPlanId: settings.defaultPlanId as PlanId,
    trialDays: settings.trialDays,
    inviteExpiryDays: settings.inviteExpiryDays,
    updatedAt: settings.updatedAt.toISOString(),
  };
}

export const PLATFORM_TIMEZONES = [
  { value: "America/Sao_Paulo", label: "Brasília (America/Sao_Paulo)" },
  { value: "America/Manaus", label: "Manaus (America/Manaus)" },
  { value: "America/Belem", label: "Belém (America/Belem)" },
  { value: "America/Fortaleza", label: "Fortaleza (America/Fortaleza)" },
  { value: "America/Recife", label: "Recife (America/Recife)" },
  { value: "America/Cuiaba", label: "Cuiabá (America/Cuiaba)" },
  { value: "America/Porto_Velho", label: "Porto Velho (America/Porto_Velho)" },
  { value: "America/Rio_Branco", label: "Rio Branco (America/Rio_Branco)" },
  { value: "America/Noronha", label: "Fernando de Noronha (America/Noronha)" },
] as const;
