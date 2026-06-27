"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  CREATE_TENANT_WIZARD_STEP1_FIELDS,
  CREATE_TENANT_WIZARD_STEP2_FIELDS,
  CreateTenantWizardSchema,
  type CreateTenantWizardInput,
} from "@/lib/schemas/platform/create-tenant-wizard.schema";
import { generateSlug } from "@/lib/utils";
import {
  formatPhoneInputValue,
  normalizePhoneInput,
} from "@/lib/utils/phone";
import { SuperPageHeader } from "@/components/super/super-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Plan } from "@/types/platform/plan";
import type { SiteTemplate } from "@/types/platform/template";
import {
  TEMPLATE_CATEGORY_LABELS,
  WIZARD_STEPS,
} from "./wizard-constants";

interface WizardPlanOption {
  id: Plan["id"];
  name: string;
}

interface WizardTemplateOption {
  id: string;
  name: string;
  category: SiteTemplate["category"];
}

interface CreateRestaurantWizardProps {
  plans: WizardPlanOption[];
  templates: WizardTemplateOption[];
  defaultPlanId: string;
}

interface CreateTenantResponse {
  ok: boolean;
  tenantId: string;
  slug: string;
  inviteId: string;
  inviteLink: string;
  expiresAt: string;
  error?: string;
  details?: Record<string, string[] | undefined>;
}

export function CreateRestaurantWizard({
  plans,
  templates,
  defaultPlanId,
}: CreateRestaurantWizardProps) {
  const [step, setStep] = useState(1);
  const [slugTouched, setSlugTouched] = useState(false);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [result, setResult] = useState<CreateTenantResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const defaultTemplateId = templates[0]?.id ?? "restaurante";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTenantWizardInput>({
    resolver: zodResolver(CreateTenantWizardSchema),
    defaultValues: {
      planId: (defaultPlanId as CreateTenantWizardInput["planId"]) || "starter",
      templateId: defaultTemplateId,
      category: templates[0]?.category ?? "restaurante",
      adminPhone: "",
    },
  });

  const watchedName = watch("name");
  const watchedTemplateId = watch("templateId");
  const values = watch();

  useEffect(() => {
    if (!slugTouched && watchedName) {
      setValue("slug", generateSlug(watchedName), { shouldValidate: true });
    }
  }, [watchedName, slugTouched, setValue]);

  useEffect(() => {
    const template = templates.find((t) => t.id === watchedTemplateId);
    if (template) {
      setValue("category", template.category);
    }
  }, [watchedTemplateId, templates, setValue]);

  const goNext = async () => {
    const fields =
      step === 1
        ? [...CREATE_TENANT_WIZARD_STEP1_FIELDS]
        : [...CREATE_TENANT_WIZARD_STEP2_FIELDS];

    const valid = await trigger(fields);
    if (valid) setStep((current) => Math.min(current + 1, 3));
  };

  const onSubmit = async (data: CreateTenantWizardInput) => {
    try {
      const res = await fetch("/api/super/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          adminPhone: phoneDigits || undefined,
        }),
      });

      const body = (await res.json()) as CreateTenantResponse;

      if (!res.ok) {
        const firstFieldError = body.details
          ? Object.values(body.details).flat()[0]
          : undefined;
        throw new Error(firstFieldError ?? body.error ?? "Falha ao criar restaurante");
      }

      setResult(body);
      toast.success("Restaurante criado e convite gerado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar restaurante");
    }
  };

  const copyInviteLink = async () => {
    if (!result?.inviteLink) return;
    await navigator.clipboard.writeText(result.inviteLink);
    setCopied(true);
    toast.success("Link copiado");
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (result) {
    return (
      <div className="space-y-6">
        <SuperPageHeader
          title="Restaurante criado"
          description="O convite foi gerado. Compartilhe o link com o administrador."
        />

        <div className="rounded-lg border p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Restaurante</p>
            <p className="font-medium">{values.name}</p>
            <p className="text-sm font-mono text-muted-foreground">{result.slug}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Link do convite</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input readOnly value={result.inviteLink} className="font-mono text-xs" />
              <Button type="button" variant="outline" onClick={copyInviteLink}>
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copiar link
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Expira em{" "}
              {new Date(result.expiresAt).toLocaleDateString("pt-BR")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild>
              <Link href="/super/restaurants">Ver restaurantes</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/super/invites">Ver convites</Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setResult(null);
                setStep(1);
                setSlugTouched(false);
                setPhoneDigits("");
                reset({
                  name: "",
                  slug: "",
                  planId: (defaultPlanId as CreateTenantWizardInput["planId"]) || "starter",
                  templateId: defaultTemplateId,
                  category: templates[0]?.category ?? "restaurante",
                  adminName: "",
                  email: "",
                  adminPhone: "",
                });
              }}
            >
              Criar outro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Novo Restaurante"
        description="Cadastre um restaurante e envie convite ao administrador."
      />

      <ol className="flex gap-2">
        {WIZARD_STEPS.map(({ id, label }) => (
          <li
            key={id}
            className={`flex-1 rounded-lg border px-3 py-2 text-center text-xs font-medium ${
              step === id
                ? "border-primary bg-primary/5 text-primary"
                : step > id
                  ? "border-border text-foreground"
                  : "border-border text-muted-foreground"
            }`}
          >
            {id}. {label}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="rounded-lg border p-6 space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nome do restaurante</Label>
              <Input id="name" placeholder="Ex: Tapioca da Praia" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="tapioca-da-praia"
                {...register("slug", {
                  onChange: () => setSlugTouched(true),
                })}
              />
              {errors.slug && (
                <p className="text-xs text-destructive">{errors.slug.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="planId">Plano</Label>
                <select
                  id="planId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register("planId")}
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                {errors.planId && (
                  <p className="text-xs text-destructive">{errors.planId.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="templateId">Template</Label>
                <select
                  id="templateId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register("templateId")}
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                {errors.templateId && (
                  <p className="text-xs text-destructive">
                    {errors.templateId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("category")}
              >
                {Object.entries(TEMPLATE_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category.message}</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-lg border p-6 space-y-4">
            <div className="space-y-1">
              <Label htmlFor="adminName">Nome do administrador</Label>
              <Input
                id="adminName"
                placeholder="Ex: Maria Silva"
                {...register("adminName")}
              />
              {errors.adminName && (
                <p className="text-xs text-destructive">{errors.adminName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@restaurante.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="adminPhone">Telefone (opcional)</Label>
              <Input
                id="adminPhone"
                inputMode="numeric"
                placeholder="(11) 99999-9999"
                value={formatPhoneInputValue(phoneDigits)}
                onChange={(e) => {
                  const digits = normalizePhoneInput(e.target.value, 11);
                  setPhoneDigits(digits);
                  setValue("adminPhone", digits, { shouldValidate: true });
                }}
              />
              {errors.adminPhone && (
                <p className="text-xs text-destructive">
                  {errors.adminPhone.message}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-lg border p-6 space-y-4">
            <h2 className="font-semibold">Resumo</h2>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              {[
                ["Restaurante", values.name],
                ["Slug", values.slug],
                [
                  "Plano",
                  plans.find((p) => p.id === values.planId)?.name ?? values.planId,
                ],
                [
                  "Template",
                  templates.find((t) => t.id === values.templateId)?.name ??
                    values.templateId,
                ],
                [
                  "Categoria",
                  TEMPLATE_CATEGORY_LABELS[values.category] ?? values.category,
                ],
                ["Administrador", values.adminName],
                ["E-mail", values.email],
                ["Telefone", phoneDigits ? formatPhoneInputValue(phoneDigits) : "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium break-all">{value || "—"}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-muted-foreground">
              Ao confirmar, o restaurante será criado em trial e um convite
              pendente será gerado para o administrador.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-between">
          <Button type="button" variant="outline" asChild>
            <Link href="/super/restaurants">Cancelar</Link>
          </Button>

          <div className="flex gap-2">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((current) => current - 1)}
              >
                Voltar
              </Button>
            )}

            {step < 3 ? (
              <Button type="button" onClick={goNext}>
                Continuar
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando…" : "Criar restaurante e enviar convite"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
