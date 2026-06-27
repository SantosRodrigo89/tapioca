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

export const UpdatePlanSchema = PlanSchema.partial().omit({ id: true });
