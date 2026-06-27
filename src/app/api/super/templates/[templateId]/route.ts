import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { getTemplateByIdServer } from "@/lib/repositories/server/platform/template.server";
import {
  UpdateTemplateFormSchema,
  UpdateTemplateParamsSchema,
} from "@/lib/schemas/platform/template.schema";
import {
  TemplateError,
  updateTemplateAdminServer,
} from "@/services/platform/template.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ templateId: string }> },
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { templateId } = await params;
  const idParsed = UpdateTemplateParamsSchema.safeParse({ templateId });
  if (!idParsed.success) {
    return NextResponse.json({ error: "Template inválido" }, { status: 400 });
  }

  const template = await getTemplateByIdServer(templateId);
  if (!template) {
    return NextResponse.json({ error: "Template não encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    ...template,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ templateId: string }> },
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { templateId } = await params;
  const idParsed = UpdateTemplateParamsSchema.safeParse({ templateId });
  if (!idParsed.success) {
    return NextResponse.json({ error: "Template inválido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = UpdateTemplateFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const template = await updateTemplateAdminServer(templateId, parsed.data);

    return NextResponse.json({
      ok: true,
      template: {
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        thumbnailUrl: template.thumbnailUrl,
        status: template.status,
        order: template.order,
        themePreset: template.themePreset,
      },
    });
  } catch (err) {
    if (err instanceof TemplateError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 404 });
    }

    console.error("[super/templates PATCH]", err);
    return NextResponse.json({ error: "Falha ao atualizar template" }, { status: 500 });
  }
}
