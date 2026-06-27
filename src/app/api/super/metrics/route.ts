import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { getSuperPlatformMetricsServer } from "@/services/platform/super-metrics.service";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const metrics = await getSuperPlatformMetricsServer();
    return NextResponse.json(metrics);
  } catch (err) {
    console.error("[super/metrics]", err);
    return NextResponse.json(
      { error: "Falha ao carregar métricas" },
      { status: 500 },
    );
  }
}
