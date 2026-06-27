import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { UpdateTenantFeatureSchema } from "@/lib/schemas/platform/feature-entitlements.schema";
import {
  FeatureEntitlementError,
  updateTenantFeatureServer,
} from "@/services/platform/feature-entitlements.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { tenantId } = await params;

  try {
    const body = await request.json();
    const parsed = UpdateTenantFeatureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const result = await updateTenantFeatureServer(
      tenantId,
      parsed.data.featureId,
      parsed.data.enabled,
    );

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof FeatureEntitlementError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 404 });
    }

    console.error("[super/tenants/features PATCH]", err);
    return NextResponse.json(
      { error: "Falha ao atualizar recurso do restaurante" },
      { status: 500 },
    );
  }
}
