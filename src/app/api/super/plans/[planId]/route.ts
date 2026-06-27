import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { getPlanByIdServer } from "@/lib/repositories/server/platform/plan.server";
import {
  UpdatePlanFormSchema,
  UpdatePlanParamsSchema,
} from "@/lib/schemas/platform/plan.schema";
import { PlanError, updatePlanAdminServer } from "@/services/platform/plan.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ planId: string }> },
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { planId } = await params;
  const idParsed = UpdatePlanParamsSchema.safeParse({ planId });
  if (!idParsed.success) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  const plan = await getPlanByIdServer(planId);
  if (!plan) {
    return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    ...plan,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ planId: string }> },
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { planId } = await params;
  const idParsed = UpdatePlanParamsSchema.safeParse({ planId });
  if (!idParsed.success) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = UpdatePlanFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const plan = await updatePlanAdminServer(planId, parsed.data, {
      uid: sessionUser.uid,
      email: sessionUser.email,
    });

    return NextResponse.json({
      ok: true,
      plan: {
        ...plan,
        createdAt: plan.createdAt.toISOString(),
        updatedAt: plan.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    if (err instanceof PlanError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 404 });
    }

    console.error("[super/plans PATCH]", err);
    return NextResponse.json({ error: "Falha ao atualizar plano" }, { status: 500 });
  }
}
