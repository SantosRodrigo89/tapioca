import { z } from "zod";
import { TenantStatusSchema } from "@/lib/schemas/tenant.schema";

export const TenantSortFieldSchema = z.enum([
  "name",
  "slug",
  "createdAt",
  "lastAccessAt",
]);

export const SortOrderSchema = z.enum(["asc", "desc"]);

export const ListTenantsQuerySchema = z.object({
  q: z.string().optional(),
  status: z
    .union([TenantStatusSchema, z.literal("all")])
    .optional()
    .default("all"),
  sort: TenantSortFieldSchema.optional().default("createdAt"),
  order: SortOrderSchema.optional().default("desc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type ListTenantsQuery = z.infer<typeof ListTenantsQuerySchema>;
