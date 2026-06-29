import { NextResponse } from "next/server";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { captureServerEvent } from "@/lib/analytics/posthog-node-capture";
import { getSessionUser } from "@/lib/auth/session";
import { AcceptInviteSchema } from "@/lib/schemas/platform/accept-invite.schema";
import {
  InviteError,
  acceptInviteServer,
} from "@/services/platform/invite.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  try {
    const sessionUser = await getSessionUser();

    if (sessionUser) {
      const result = await acceptInviteServer(token, { sessionUser });
      void captureServerEvent(result.uid, ANALYTICS_EVENTS.INVITE_ACCEPTED, {
        tenant_id: result.tenantId,
      });
      return NextResponse.json({ ok: true, ...result });
    }

    const body = await request.json();
    const parsed = AcceptInviteSchema.safeParse(body);

    if (!parsed.success || !parsed.data.password) {
      return NextResponse.json(
        {
          error: parsed.success
            ? "Informe uma senha para criar sua conta."
            : "Dados inválidos",
          details: parsed.success ? undefined : parsed.error.flatten().fieldErrors,
          code: "PASSWORD_REQUIRED",
        },
        { status: 400 },
      );
    }

    const result = await acceptInviteServer(token, {
      password: parsed.data.password,
    });
    void captureServerEvent(result.uid, ANALYTICS_EVENTS.INVITE_ACCEPTED, {
      tenant_id: result.tenantId,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof InviteError) {
      const status =
        err.code === "NOT_FOUND"
          ? 404
          : err.code === "EMAIL_EXISTS" || err.code === "EMAIL_MISMATCH"
            ? 409
            : 400;
      return NextResponse.json({ error: err.message, code: err.code }, { status });
    }

    console.error("[invites/token accept]", err);
    return NextResponse.json({ error: "Falha ao aceitar convite" }, { status: 500 });
  }
}
