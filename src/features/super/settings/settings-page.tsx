"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  UpdatePlatformSettingsFormSchema,
  type UpdatePlatformSettingsFormInput,
} from "@/lib/schemas/platform/platform-settings.schema";
import { SuperPageHeader } from "@/components/super/super-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PLATFORM_TIMEZONES,
  type PlanOption,
  type PlatformSettingsClient,
} from "@/features/super/settings/settings-types";

interface SettingsPageProps {
  initialSettings: PlatformSettingsClient;
  planOptions: PlanOption[];
}

export function SettingsPage({
  initialSettings,
  planOptions,
}: SettingsPageProps) {
  const [updatedAt, setUpdatedAt] = useState(initialSettings.updatedAt);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdatePlatformSettingsFormInput>({
    resolver: zodResolver(UpdatePlatformSettingsFormSchema),
    defaultValues: {
      platformName: initialSettings.platformName,
      logoUrl: initialSettings.logoUrl ?? "",
      contactEmail: initialSettings.contactEmail,
      domain: initialSettings.domain,
      supportUrl: initialSettings.supportUrl ?? "",
      theme: {
        primaryColor: initialSettings.theme?.primaryColor ?? "",
      },
      timezone: initialSettings.timezone,
      defaultPlanId: initialSettings.defaultPlanId,
      trialDays: initialSettings.trialDays,
      inviteExpiryDays: initialSettings.inviteExpiryDays,
    },
  });

  const primaryColor = watch("theme.primaryColor") ?? "";

  useEffect(() => {
    reset({
      platformName: initialSettings.platformName,
      logoUrl: initialSettings.logoUrl ?? "",
      contactEmail: initialSettings.contactEmail,
      domain: initialSettings.domain,
      supportUrl: initialSettings.supportUrl ?? "",
      theme: {
        primaryColor: initialSettings.theme?.primaryColor ?? "",
      },
      timezone: initialSettings.timezone,
      defaultPlanId: initialSettings.defaultPlanId,
      trialDays: initialSettings.trialDays,
      inviteExpiryDays: initialSettings.inviteExpiryDays,
    });
  }, [initialSettings, reset]);

  const onSubmit = async (data: UpdatePlatformSettingsFormInput) => {
    try {
      const res = await fetch("/api/super/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = (await res.json()) as {
        error?: string;
        details?: Record<string, string[] | undefined>;
        settings?: PlatformSettingsClient;
      };

      if (!res.ok) {
        const detail = body.details
          ? Object.values(body.details).flat()[0]
          : undefined;
        throw new Error(detail ?? body.error ?? "Falha ao salvar");
      }

      if (body.settings) {
        setUpdatedAt(body.settings.updatedAt);
        reset({
          platformName: body.settings.platformName,
          logoUrl: body.settings.logoUrl ?? "",
          contactEmail: body.settings.contactEmail,
          domain: body.settings.domain,
          supportUrl: body.settings.supportUrl ?? "",
          theme: {
            primaryColor: body.settings.theme?.primaryColor ?? "",
          },
          timezone: body.settings.timezone,
          defaultPlanId: body.settings.defaultPlanId,
          trialDays: body.settings.trialDays,
          inviteExpiryDays: body.settings.inviteExpiryDays,
        });
      }

      toast.success("Configurações salvas");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar configurações",
      );
    }
  };

  const updatedAtLabel = new Date(updatedAt).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <SuperPageHeader
        title="Configurações"
        description="Configurações globais da plataforma Mesio."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-4 rounded-lg border p-4">
          <div>
            <h2 className="text-sm font-semibold">Identidade</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Nome e aparência exibidos na plataforma.
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="platform-name">Nome da plataforma</Label>
            <Input id="platform-name" {...register("platformName")} />
            {errors.platformName && (
              <p className="text-xs text-destructive">
                {errors.platformName.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="logo-url">URL do logo (opcional)</Label>
            <Input
              id="logo-url"
              type="url"
              placeholder="https://..."
              {...register("logoUrl")}
            />
            {errors.logoUrl && (
              <p className="text-xs text-destructive">{errors.logoUrl.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="primary-color">Cor primária (opcional)</Label>
            <div className="flex items-center gap-3">
              <input
                id="primary-color-picker"
                type="color"
                value={primaryColor || "#2563eb"}
                onChange={(e) =>
                  setValue("theme.primaryColor", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className="h-10 w-14 cursor-pointer rounded border border-input bg-background p-1"
                aria-label="Selecionar cor primária"
              />
              <Input
                id="primary-color"
                placeholder="#2563eb"
                {...register("theme.primaryColor")}
                className="font-mono"
              />
            </div>
            {errors.theme?.primaryColor && (
              <p className="text-xs text-destructive">
                {errors.theme.primaryColor.message}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4 rounded-lg border p-4">
          <div>
            <h2 className="text-sm font-semibold">Contato e domínio</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Informações de suporte e domínio principal da plataforma.
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="contact-email">E-mail de contato</Label>
            <Input
              id="contact-email"
              type="email"
              {...register("contactEmail")}
            />
            {errors.contactEmail && (
              <p className="text-xs text-destructive">
                {errors.contactEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="domain">Domínio principal</Label>
            <Input id="domain" placeholder="mesio.app" {...register("domain")} />
            {errors.domain && (
              <p className="text-xs text-destructive">{errors.domain.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="support-url">URL de suporte (opcional)</Label>
            <Input
              id="support-url"
              type="url"
              placeholder="https://..."
              {...register("supportUrl")}
            />
            {errors.supportUrl && (
              <p className="text-xs text-destructive">
                {errors.supportUrl.message}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4 rounded-lg border p-4">
          <div>
            <h2 className="text-sm font-semibold">Operação SaaS</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Valores padrão para novos restaurantes e convites.
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="timezone">Fuso horário</Label>
            <select
              id="timezone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("timezone")}
            >
              {PLATFORM_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            {errors.timezone && (
              <p className="text-xs text-destructive">{errors.timezone.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="default-plan">Plano padrão</Label>
            <select
              id="default-plan"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("defaultPlanId")}
            >
              {planOptions.length === 0 ? (
                <option value={initialSettings.defaultPlanId}>
                  {initialSettings.defaultPlanId}
                </option>
              ) : (
                planOptions.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))
              )}
            </select>
            {errors.defaultPlanId && (
              <p className="text-xs text-destructive">
                {errors.defaultPlanId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="trial-days">Dias de trial</Label>
              <Input
                id="trial-days"
                type="number"
                min={0}
                {...register("trialDays", { valueAsNumber: true })}
              />
              {errors.trialDays && (
                <p className="text-xs text-destructive">
                  {errors.trialDays.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="invite-expiry">Expiração de convite (dias)</Label>
              <Input
                id="invite-expiry"
                type="number"
                min={1}
                {...register("inviteExpiryDays", { valueAsNumber: true })}
              />
              {errors.inviteExpiryDays && (
                <p className="text-xs text-destructive">
                  {errors.inviteExpiryDays.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Última atualização: {updatedAtLabel}
          </p>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Salvando…" : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
