import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { getInviteByIdServer } from "@/lib/repositories/server/platform/invite.server";
import {
  InviteError,
  cancelInviteServer,
  resendInviteServer,
} from "@/services/platform/invite.service";

function resolveAppOrigin(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    new URL(request.url).origin
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ inviteId: string }> },
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { inviteId } = await params;
  const invite = await getInviteByIdServer(inviteId);

  if (!invite) {
    return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    ...invite,
    sentAt: invite.sentAt.toISOString(),
    expiresAt: invite.expiresAt.toISOString(),
    acceptedAt: invite.acceptedAt?.toISOString(),
    createdAt: invite.createdAt.toISOString(),
    updatedAt: invite.updatedAt.toISOString(),
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ inviteId: string }> },
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { inviteId } = await params;
  const body = (await request.json().catch(() => ({}))) as { action?: string };

  try {
    if (body.action === "resend") {
      const result = await resendInviteServer(inviteId, resolveAppOrigin(request));
      return NextResponse.json({
        ok: true,
        ...result,
        expiresAt: result.expiresAt.toISOString(),
      });
    }

    if (body.action === "cancel") {
      await cancelInviteServer(inviteId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (err) {
    if (err instanceof InviteError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 400 });
    }

    console.error("[super/invites POST]", err);
    return NextResponse.json({ error: "Falha ao processar convite" }, { status: 500 });
  }
}
