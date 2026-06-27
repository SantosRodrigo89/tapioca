import { z } from "zod";
import { PlanIdSchema } from "./plan.schema";

export const InviteStatusSchema = z.enum([
  "pending",
  "accepted",
  "expired",
  "cancelled",
]);

export const TenantInviteSchema = z.object({
  tenantId: z.string().min(1),
  tenantName: z.string().min(1),
  email: z.email(),
  adminName: z.string().min(1),
  adminPhone: z.string().optional(),
  planId: PlanIdSchema,
});
