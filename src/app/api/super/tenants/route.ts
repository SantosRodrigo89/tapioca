import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { ListTenantsQuerySchema } from "@/lib/schemas/platform/list-tenants.schema";
import { CreateTenantWizardSchema } from "@/lib/schemas/platform/create-tenant-wizard.schema";
import { listTenantsPaginatedServer } from "@/services/platform/list-tenants.service";
import {
  CreateTenantError,
  createTenantWithInviteServer,
} from "@/services/platform/create-tenant-with-invite.service";

function resolveAppOrigin(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    new URL(request.url).origin
  );
}

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

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = CreateTenantWizardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const input = {
      ...parsed.data,
      adminPhone: parsed.data.adminPhone || undefined,
    };

    const result = await createTenantWithInviteServer(input, {
      createdByUid: sessionUser.uid,
      createdByEmail: sessionUser.email,
      appOrigin: resolveAppOrigin(request),
    });

    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (err) {
    if (err instanceof CreateTenantError) {
      const status = err.code === "SLUG_TAKEN" ? 409 : 400;
      return NextResponse.json({ error: err.message, code: err.code }, { status });
    }

    console.error("[super/tenants POST]", err);
    return NextResponse.json(
      { error: "Falha ao criar restaurante" },
      { status: 500 },
    );
  }
}
