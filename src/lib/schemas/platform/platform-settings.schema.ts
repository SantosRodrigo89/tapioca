import { z } from "zod";

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
  defaultPlanId: z.string().min(1),
  trialDays: z.number().int().min(0),
  inviteExpiryDays: z.number().int().min(1),
});
