import type { Metadata } from "next";
import { getPlatformSettingsServer } from "@/lib/repositories/server/platform/platform-settings.server";
import { listPlansServer } from "@/lib/repositories/server/platform/plan.server";
import { SettingsPage } from "@/features/super/settings/settings-page";
import { serializePlatformSettingsForClient } from "@/features/super/settings/settings-types";

export const metadata: Metadata = { title: "Configurações — Super Admin" };

export default async function SuperSettingsPage() {
  const [settings, plans] = await Promise.all([
    getPlatformSettingsServer(),
    listPlansServer(),
  ]);

  return (
    <SettingsPage
      initialSettings={serializePlatformSettingsForClient(settings)}
      planOptions={plans.map((plan) => ({ id: plan.id, name: plan.name }))}
    />
  );
}
