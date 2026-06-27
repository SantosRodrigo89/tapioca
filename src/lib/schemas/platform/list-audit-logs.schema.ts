import { z } from "zod";

export const AuditEventTypeSchema = z.enum([
  "tenant_created",
  "invite_accepted",
  "login",
  "plan_changed",
  "settings_changed",
  "suspended",
  "reactivated",
]);

export const ListAuditLogsQuerySchema = z.object({
  type: z.union([AuditEventTypeSchema, z.literal("all")]).optional().default("all"),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(25),
});

export type ListAuditLogsQuery = z.infer<typeof ListAuditLogsQuerySchema>;
