import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { listInvitesServer } from "@/lib/repositories/server/platform/invite.server";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const invites = await listInvitesServer();
    return NextResponse.json({
      items: invites.map((invite) => ({
        ...invite,
        sentAt: invite.sentAt.toISOString(),
        expiresAt: invite.expiresAt.toISOString(),
        acceptedAt: invite.acceptedAt?.toISOString(),
        createdAt: invite.createdAt.toISOString(),
        updatedAt: invite.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[super/invites GET]", err);
    return NextResponse.json({ error: "Falha ao listar convites" }, { status: 500 });
  }
}
