import { NextResponse } from "next/server";
import { getInvitePreviewByTokenServer } from "@/services/platform/invite.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  try {
    const preview = await getInvitePreviewByTokenServer(token);
    if (!preview) {
      return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      ...preview,
      expiresAt: preview.expiresAt.toISOString(),
    });
  } catch (err) {
    console.error("[invites/token GET]", err);
    return NextResponse.json({ error: "Falha ao carregar convite" }, { status: 500 });
  }
}
