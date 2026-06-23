"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { UpdateTenantSchema, type UpdateTenantInput } from "@/lib/schemas";
import { updateTenant } from "@/lib/repositories/tenant.repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Tenant } from "@/types";

interface SettingsClientProps {
  tenant: Tenant;
}

export function SettingsClient({ tenant }: SettingsClientProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/${tenant.slug}`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateTenantInput>({
    resolver: zodResolver(UpdateTenantSchema),
    defaultValues: {
      name: tenant.name,
      description: tenant.description ?? "",
      address: tenant.address ?? "",
      whatsapp: tenant.whatsapp ?? "",
    },
  });

  const onSubmit = async (data: UpdateTenantInput) => {
    try {
      await updateTenant(tenant.id, data);
      toast.success("Configurações salvas");
    } catch {
      toast.error("Erro ao salvar configurações");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie as informações do seu restaurante.
        </p>
      </div>

      {/* Restaurant info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Informações do restaurante</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nome do restaurante</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Uma breve descrição do seu restaurante…"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Endereço (opcional)</Label>
            <Input
              id="address"
              placeholder="Rua Exemplo, 123 — Bairro, Cidade/UF"
              {...register("address")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="5511999999999"
              {...register("whatsapp")}
            />
            {errors.whatsapp && (
              <p className="text-xs text-destructive">
                {errors.whatsapp.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Apenas números com DDI. Ex: 5511999999999
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Salvando…" : "Salvar alterações"}
          </Button>
        </form>
      </section>

      <Separator />

      {/* Public link */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Link do cardápio</h2>
        <div className="space-y-1">
          <Label>Slug (imutável)</Label>
          <p className="text-sm font-mono bg-muted rounded-md px-3 py-2">
            {tenant.slug}
          </p>
        </div>
        <div className="space-y-1">
          <Label>URL pública</Label>
          <div className="flex items-center gap-2">
            <Input value={publicUrl} readOnly className="font-mono text-xs" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="Copiar URL"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
