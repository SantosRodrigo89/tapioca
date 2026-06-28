import { z } from "zod";

export const ComplementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
  enabled: z.boolean(),
  order: z.number().int().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateComplementSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(200, "Descrição deve ter no máximo 200 caracteres")
    .optional(),
  price: z
    .number({ error: "Preço inválido" })
    .int()
    .nonnegative("Preço não pode ser negativo"),
  enabled: z.boolean(),
});

export const UpdateComplementSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  description: z
    .string()
    .max(200, "Descrição deve ter no máximo 200 caracteres")
    .optional(),
  price: z
    .number({ error: "Preço inválido" })
    .int()
    .nonnegative("Preço não pode ser negativo")
    .optional(),
  enabled: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
  imageUrl: z.string().url().optional().nullable(),
});

export type Complement = z.infer<typeof ComplementSchema>;
export type CreateComplementInput = z.infer<typeof CreateComplementSchema>;
export type UpdateComplementInput = z.infer<typeof UpdateComplementSchema>;
