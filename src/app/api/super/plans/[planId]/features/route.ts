import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { PlanIdSchema } from "@/lib/schemas/platform/plan.schema";
import { UpdatePlanFeatureSchema } from "@/lib/schemas/platform/feature-entitlements.schema";
import {
  FeatureEntitlementError,
  updatePlanFeatureServer,
} from "@/services/platform/feature-entitlements.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ planId: string }> },
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { planId } = await params;
  const idParsed = PlanIdSchema.safeParse(planId);
  if (!idParsed.success) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = UpdatePlanFeatureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const plan = await updatePlanFeatureServer(
      planId as typeof idParsed.data,
      parsed.data.featureId,
      parsed.data.enabled,
    );

    return NextResponse.json({
      ok: true,
      featureId: parsed.data.featureId,
      enabled: parsed.data.enabled,
      planFeatures: plan.features,
    });
  } catch (err) {
    if (err instanceof FeatureEntitlementError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 404 });
    }

    console.error("[super/plans/features PATCH]", err);
    return NextResponse.json({ error: "Falha ao atualizar recurso do plano" }, { status: 500 });
  }
}
