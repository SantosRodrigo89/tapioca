import { z } from "zod";
import { FeatureIdSchema } from "./feature.schema";

export const UpdatePlanFeatureSchema = z.object({
  featureId: FeatureIdSchema,
  enabled: z.boolean(),
});

export const UpdateTenantFeatureSchema = z.object({
  featureId: FeatureIdSchema,
  enabled: z.boolean().nullable(),
});

export type UpdatePlanFeatureInput = z.infer<typeof UpdatePlanFeatureSchema>;
export type UpdateTenantFeatureInput = z.infer<typeof UpdateTenantFeatureSchema>;
