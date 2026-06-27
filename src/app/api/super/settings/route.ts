import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { getPlatformSettingsServer } from "@/lib/repositories/server/platform/platform-settings.server";
import { UpdatePlatformSettingsFormSchema } from "@/lib/schemas/platform/platform-settings.schema";
import { updatePlatformSettingsAdminServer } from "@/services/platform/platform-settings.service";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const settings = await getPlatformSettingsServer();

  return NextResponse.json({
    ...settings,
    updatedAt: settings.updatedAt.toISOString(),
  });
}

export async function PATCH(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = UpdatePlatformSettingsFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const settings = await updatePlatformSettingsAdminServer(parsed.data, {
      uid: sessionUser.uid,
      email: sessionUser.email,
    });

    return NextResponse.json({
      ok: true,
      settings: {
        ...settings,
        updatedAt: settings.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("[super/settings PATCH]", err);
    return NextResponse.json(
      { error: "Falha ao atualizar configurações" },
      { status: 500 },
    );
  }
}
