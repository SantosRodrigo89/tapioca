import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { ListAuditLogsQuerySchema } from "@/lib/schemas/platform/list-audit-logs.schema";
import { listAuditLogsPaginatedServer } from "@/services/platform/list-audit-logs.service";

export async function GET(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = ListAuditLogsQuerySchema.safeParse({
    type: searchParams.get("type") || undefined,
    q: searchParams.get("q") || undefined,
    page: searchParams.get("page") || undefined,
    pageSize: searchParams.get("pageSize") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  try {
    const result = await listAuditLogsPaginatedServer(parsed.data);
    return NextResponse.json({
      ...result,
      items: result.items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[super/logs]", err);
    return NextResponse.json({ error: "Falha ao listar logs" }, { status: 500 });
  }
}
