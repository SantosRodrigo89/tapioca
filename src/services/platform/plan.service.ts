import type { Plan } from "@/types/platform/plan";
import type { UpdatePlanFormInput } from "@/lib/schemas/platform/plan.schema";
import {
  getPlanByIdServer,
  updatePlanServer,
} from "@/lib/repositories/server/platform/plan.server";
import { logAuditEvent } from "@/services/platform/audit.service";

export class PlanError extends Error {
  constructor(
    message: string,
    readonly code: "NOT_FOUND" | "INVALID_ID",
  ) {
    super(message);
    this.name = "PlanError";
  }
}

export async function updatePlanAdminServer(
  planId: string,
  input: UpdatePlanFormInput,
  actor: { uid: string; email?: string | null },
): Promise<Plan> {
  const existing = await getPlanByIdServer(planId);
  if (!existing) {
    throw new PlanError("Plano não encontrado.", "NOT_FOUND");
  }

  const updated = await updatePlanServer(planId, input);

  await logAuditEvent({
    type: "plan_changed",
    actorUid: actor.uid,
    actorEmail: actor.email ?? undefined,
    metadata: {
      planId,
      before: {
        name: existing.name,
        priceCents: existing.priceCents,
        status: existing.status,
      },
      after: {
        name: updated.name,
        priceCents: updated.priceCents,
        status: updated.status,
      },
    },
  });

  return updated;
}
