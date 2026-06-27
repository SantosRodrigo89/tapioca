import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { UpdateTenantStatusSchema } from "@/lib/schemas/tenant.schema";
import {
  getTenantByIdServer,
  updateTenantStatusServer,
} from "@/lib/repositories/server/tenant.server";
import { logAuditEvent } from "@/services/platform/audit.service";

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
    const previousStatus = tenant.status;
    const newStatus = parsed.data.status;

    await updateTenantStatusServer(tenantId, newStatus);

    if (newStatus === "suspended" && previousStatus !== "suspended") {
      await logAuditEvent({
        type: "suspended",
        actorUid: sessionUser!.uid,
        actorEmail: sessionUser!.email ?? undefined,
        tenantId,
        tenantName: tenant.name,
        metadata: { previousStatus, newStatus },
      });
    } else if (
      newStatus === "active" &&
      (previousStatus === "suspended" || previousStatus === "cancelled")
    ) {
      await logAuditEvent({
        type: "reactivated",
        actorUid: sessionUser!.uid,
        actorEmail: sessionUser!.email ?? undefined,
        tenantId,
        tenantName: tenant.name,
        metadata: { previousStatus, newStatus },
      });
    }

    return NextResponse.json({ ok: true, status: newStatus });
  } catch (error) {
    console.error("[PATCH /api/super/tenants/status]", error);
    return NextResponse.json(
      { error: "Falha ao atualizar status" },
      { status: 500 },
    );
  }
}
