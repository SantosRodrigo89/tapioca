import { z } from "zod";

const RESERVED_SLUGS = [
  "auth",
  "dashboard",
  "catalog",
  "settings",
  "super",
  "api",
  "public",
  "admin",
  "_next",
];

export const TenantStatusSchema = z.enum([
  "trial",
  "active",
  "suspended",
  "cancelled",
]);

export const TenantSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  address: z.string().optional(),
  whatsapp: z.string().optional(),
  status: TenantStatusSchema,
  ownerUid: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateTenantSchema = z.object({
  restaurantName: z
    .string()
    .min(2, "Nome do restaurante deve ter pelo menos 2 caracteres")
    .max(100, "Nome do restaurante deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  address: z
    .string()
    .max(200, "Endereço deve ter no máximo 200 caracteres")
    .optional(),
  whatsapp: z
    .string()
    .regex(/^\d+$/, "WhatsApp deve conter apenas números")
    .optional()
    .or(z.literal("")),
});

export const UpdateTenantSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  address: z
    .string()
    .max(200, "Endereço deve ter no máximo 200 caracteres")
    .optional(),
  whatsapp: z
    .string()
    .regex(/^\d+$/, "WhatsApp deve conter apenas números")
    .optional()
    .or(z.literal("")),
});

export const SlugSchema = z
  .string()
  .min(3, "Slug deve ter pelo menos 3 caracteres")
  .max(50, "Slug deve ter no máximo 50 caracteres")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug deve conter apenas letras minúsculas, números e hífens",
  )
  .refine((slug) => !RESERVED_SLUGS.includes(slug), {
    message: "Este slug é reservado e não pode ser utilizado",
  });

export type TenantStatus = z.infer<typeof TenantStatusSchema>;
export type Tenant = z.infer<typeof TenantSchema>;
export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>;
