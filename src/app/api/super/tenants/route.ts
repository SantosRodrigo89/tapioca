import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { ListTenantsQuerySchema } from "@/lib/schemas/platform/list-tenants.schema";
import { listTenantsPaginatedServer } from "@/services/platform/list-tenants.service";

export async function GET(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = ListTenantsQuerySchema.safeParse({
    q: searchParams.get("q") || undefined,
    status: searchParams.get("status") || undefined,
    sort: searchParams.get("sort") || undefined,
    order: searchParams.get("order") || undefined,
    page: searchParams.get("page") || undefined,
    pageSize: searchParams.get("pageSize") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await listTenantsPaginatedServer(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[super/tenants]", err);
    return NextResponse.json(
      { error: "Falha ao listar restaurantes" },
      { status: 500 },
    );
  }
}
