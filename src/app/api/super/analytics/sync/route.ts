import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { revalidateSuperMetrics } from "@/lib/cache/revalidate.server";
import { syncAllTenantViewsMetrics } from "@/services/analytics.service";

export async function POST() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const result = await syncAllTenantViewsMetrics();
    await revalidateSuperMetrics();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[super/analytics/sync]", err);
    return NextResponse.json(
      { error: "Falha ao sincronizar analytics" },
      { status: 500 },
    );
  }
}
