import { z } from "zod";
import { AvailabilityScheduleSchema } from "./availability.schema";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number().int().nonnegative(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  active: z.boolean(),
  availability: AvailabilityScheduleSchema.optional(),
});

export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .optional(),
  active: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
  availability: AvailabilityScheduleSchema.optional(),
});

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
