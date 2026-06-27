import type { Metadata } from "next";
import { getPlatformSettingsServer } from "@/lib/repositories/server/platform/platform-settings.server";
import { SuperPageHeader } from "@/components/super/super-page-header";

export const metadata: Metadata = { title: "Configurações — Super Admin" };

export default async function SuperSettingsPage() {
  const settings = await getPlatformSettingsServer();

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Configurações"
        description="Configurações globais da plataforma Mesio."
      />

      <div className="rounded-lg border divide-y">
        {[
          ["Nome da Plataforma", settings.platformName],
          ["E-mail", settings.contactEmail],
          ["Domínio", settings.domain],
          ["Suporte", settings.supportUrl ?? "—"],
          ["Fuso horário", settings.timezone],
          ["Plano padrão", settings.defaultPlanId],
          ["Dias de trial", String(settings.trialDays)],
          ["Expiração de convite (dias)", String(settings.inviteExpiryDays)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Edição de configurações — próxima entrega.
      </p>
    </div>
  );
}
