import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import { revalidatePublicLanding } from "@/lib/cache/revalidate.server";

const BodySchema = z.object({
  tenantId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "tenantId é obrigatório" }, { status: 400 });
  }

  const { tenantId } = parsed.data;
  const sessionTenantId = sessionUser.tenantId as string | undefined;

  if (!isSuperAdmin(sessionUser) && sessionTenantId !== tenantId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) {
    return NextResponse.json({ error: "Restaurante não encontrado" }, { status: 404 });
  }

  try {
    revalidatePublicLanding(tenant.slug);
    return NextResponse.json({ ok: true, slug: tenant.slug });
  } catch (error) {
    console.error("[POST /api/revalidate/public]", error);
    return NextResponse.json(
      { error: "Falha ao invalidar cache" },
      { status: 500 },
    );
  }
}
