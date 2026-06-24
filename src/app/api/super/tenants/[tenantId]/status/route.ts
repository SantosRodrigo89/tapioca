import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { UpdateTenantStatusSchema } from "@/lib/schemas/tenant.schema";
import {
  getTenantByIdServer,
  updateTenantStatusServer,
} from "@/lib/repositories/server/tenant.server";

interface RouteContext {
  params: Promise<{ tenantId: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const sessionUser = await getSessionUser();
  if (!isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { tenantId } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const parsed = UpdateTenantStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 },
    );
  }

  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant não encontrado" }, { status: 404 });
  }

  try {
    await updateTenantStatusServer(tenantId, parsed.data.status);
    return NextResponse.json({ ok: true, status: parsed.data.status });
  } catch (error) {
    console.error("[PATCH /api/super/tenants/status]", error);
    return NextResponse.json(
      { error: "Falha ao atualizar status" },
      { status: 500 },
    );
  }
}
