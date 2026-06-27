import { z } from "zod";

export const FeatureIdSchema = z.enum([
  "landing_page",
  "qr_code",
  "gallery",
  "products",
  "categories",
  "premium_themes",
  "orders",
  "analytics",
  "ai",
  "crm",
  "custom_domain",
  "marketing",
  "reservations",
]);

export const PlatformFeatureSchema = z.object({
  id: FeatureIdSchema,
  name: z.string().min(1),
  description: z.string(),
  category: z.enum(["core", "growth", "premium", "future"]),
  globalEnabled: z.boolean(),
  defaultEnabled: z.boolean(),
  order: z.number().int().min(0),
});

export const UpdateFeatureSchema = z.object({
  globalEnabled: z.boolean().optional(),
  defaultEnabled: z.boolean().optional(),
});
