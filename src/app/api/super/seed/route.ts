import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import {
  isPlatformSeededServer,
  seedPlatformServer,
} from "@/services/platform/seed-platform.service";

export async function POST() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const result = await seedPlatformServer();
    const seeded = await isPlatformSeededServer();
    return NextResponse.json({ ok: true, result, seeded });
  } catch (err) {
    console.error("[super/seed]", err);
    return NextResponse.json(
      { error: "Falha ao executar seed da plataforma" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const seeded = await isPlatformSeededServer();
  return NextResponse.json({ seeded });
}
