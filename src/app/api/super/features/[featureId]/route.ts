import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { UpdateFeatureSchema } from "@/lib/schemas/platform/feature.schema";
import { FeatureIdSchema } from "@/lib/schemas/platform/feature.schema";
import {
  FeatureEntitlementError,
  updateGlobalFeatureServer,
} from "@/services/platform/feature-entitlements.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ featureId: string }> },
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { featureId } = await params;
  const idParsed = FeatureIdSchema.safeParse(featureId);
  if (!idParsed.success) {
    return NextResponse.json({ error: "Recurso inválido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = UpdateFeatureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    if (
      parsed.data.globalEnabled === undefined &&
      parsed.data.defaultEnabled === undefined
    ) {
      return NextResponse.json({ error: "Nenhuma alteração informada" }, { status: 400 });
    }

    const feature = await updateGlobalFeatureServer(idParsed.data, parsed.data);
    return NextResponse.json({ ok: true, feature });
  } catch (err) {
    if (err instanceof FeatureEntitlementError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 404 });
    }

    console.error("[super/features PATCH]", err);
    return NextResponse.json({ error: "Falha ao atualizar recurso" }, { status: 500 });
  }
}
