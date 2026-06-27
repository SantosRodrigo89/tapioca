import { z } from "zod";
import { PlanIdSchema } from "./plan.schema";

export const PlatformSettingsSchema = z.object({
  platformName: z.string().min(1),
  logoUrl: z.string().url().optional().or(z.literal("")),
  contactEmail: z.email(),
  domain: z.string().min(1),
  supportUrl: z.string().url().optional().or(z.literal("")),
  theme: z
    .object({
      primaryColor: z.string().optional(),
    })
    .optional(),
  timezone: z.string().min(1),
  defaultPlanId: PlanIdSchema,
  trialDays: z.number().int().min(0),
  inviteExpiryDays: z.number().int().min(1),
});

export const UpdatePlatformSettingsFormSchema = z.object({
  platformName: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(80, "Nome deve ter no máximo 80 caracteres"),
  logoUrl: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("")),
  contactEmail: z.email("E-mail inválido"),
  domain: z
    .string()
    .min(1, "Domínio é obrigatório")
    .max(253, "Domínio muito longo"),
  supportUrl: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("")),
  theme: z
    .object({
      primaryColor: z
        .string()
        .refine(
          (value) => value === "" || /^#[0-9a-fA-F]{6}$/.test(value),
          "Use uma cor hexadecimal válida (#RRGGBB)",
        )
        .optional(),
    })
    .optional(),
  timezone: z.string().min(1, "Fuso horário é obrigatório"),
  defaultPlanId: PlanIdSchema,
  trialDays: z.number().int().min(0, "Mínimo 0 dias"),
  inviteExpiryDays: z.number().int().min(1, "Mínimo 1 dia"),
});

export type UpdatePlatformSettingsFormInput = z.infer<
  typeof UpdatePlatformSettingsFormSchema
>;
