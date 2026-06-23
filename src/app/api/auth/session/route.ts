import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import {
  createSessionCookie,
  setSessionCookie,
  clearSessionCookie,
  getSessionUser,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body as { idToken?: string };

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "idToken é obrigatório" },
        { status: 400 },
      );
    }

    // Verify the ID token is recent (max 5 min) to prevent replay attacks
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    const isRecent = Date.now() / 1000 - decoded.iat < 5 * 60;
    if (!isRecent) {
      return NextResponse.json(
        { error: "Token expirado. Faça login novamente." },
        { status: 401 },
      );
    }

    const sessionCookie = await createSessionCookie(idToken);
    await setSessionCookie(sessionCookie);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[POST /api/auth/session]", error);
    return NextResponse.json(
      { error: "Falha ao criar sessão" },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  try {
    const user = await getSessionUser();
    if (user) {
      await adminAuth.revokeRefreshTokens(user.uid);
    }
    await clearSessionCookie();
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[DELETE /api/auth/session]", error);
    // Always clear cookie even on error
    await clearSessionCookie();
    return NextResponse.json({ status: "ok" });
  }
}
