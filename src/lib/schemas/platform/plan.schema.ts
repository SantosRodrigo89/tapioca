import { z } from "zod";

export const PlanIdSchema = z.enum(["starter", "pro", "premium", "enterprise"]);

export const PlanStatusSchema = z.enum(["active", "inactive"]);

export const PlanSchema = z.object({
  id: PlanIdSchema,
  name: z.string().min(1),
  description: z.string(),
  priceCents: z.number().int().min(0),
  color: z.string().min(1),
  order: z.number().int().min(0),
  status: PlanStatusSchema,
  features: z.record(z.string(), z.boolean()),
});

export const UpdatePlanFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
  priceCents: z.number().int().min(0, "Preço inválido"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use uma cor hexadecimal válida (#RRGGBB)"),
  order: z.number().int().min(0, "Ordem inválida"),
  status: PlanStatusSchema,
});

export type UpdatePlanFormInput = z.infer<typeof UpdatePlanFormSchema>;

export const UpdatePlanParamsSchema = z.object({
  planId: PlanIdSchema,
});

export const UpdatePlanSchema = PlanSchema.partial().omit({ id: true });
