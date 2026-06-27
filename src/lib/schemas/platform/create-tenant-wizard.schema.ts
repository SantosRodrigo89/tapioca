import { z } from "zod";
import { SlugSchema } from "@/lib/schemas/tenant.schema";
import { PlanIdSchema } from "./plan.schema";

export const TemplateCategorySchema = z.enum([
  "restaurante",
  "hamburgueria",
  "bar",
  "pizzaria",
  "cafeteria",
  "acai",
  "doceria",
]);

export const CreateTenantWizardStep1Schema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  slug: SlugSchema,
  planId: PlanIdSchema,
  templateId: z.string().min(1, "Selecione um template"),
  category: TemplateCategorySchema,
});

export const CreateTenantWizardStep2Schema = z.object({
  adminName: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.email("E-mail inválido"),
  adminPhone: z
    .string()
    .regex(/^\d{10,11}$/, "Telefone inválido")
    .optional()
    .or(z.literal("")),
});

export const CreateTenantWizardSchema = CreateTenantWizardStep1Schema.merge(
  CreateTenantWizardStep2Schema,
);

export type CreateTenantWizardInput = z.infer<typeof CreateTenantWizardSchema>;

export const CREATE_TENANT_WIZARD_STEP1_FIELDS = [
  "name",
  "slug",
  "planId",
  "templateId",
  "category",
] as const satisfies readonly (keyof CreateTenantWizardInput)[];

export const CREATE_TENANT_WIZARD_STEP2_FIELDS = [
  "adminName",
  "email",
  "adminPhone",
] as const satisfies readonly (keyof CreateTenantWizardInput)[];
