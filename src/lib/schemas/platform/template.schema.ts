import { z } from "zod";
import { TemplateCategorySchema } from "@/lib/schemas/platform/create-tenant-wizard.schema";

export const TemplateStatusSchema = z.enum(["active", "inactive"]);

export const TemplateThemeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  primaryDarkColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const UpdateTemplateFormSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(500),
  category: TemplateCategorySchema,
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  status: TemplateStatusSchema,
  order: z.number().int().min(0),
  themePreset: TemplateThemeSchema,
});

export type UpdateTemplateFormInput = z.infer<typeof UpdateTemplateFormSchema>;

export const UpdateTemplateParamsSchema = z.object({
  templateId: z.string().min(1),
});
