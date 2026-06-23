import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import type { UserRole } from "@/types";

/**
 * Internal-only route for setting custom claims after signup.
 * Called server-side only (not exposed directly to clients).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, role, tenantId } = body as {
      uid?: string;
      role?: UserRole;
      tenantId?: string;
    };

    if (!uid || !role) {
      return NextResponse.json(
        { error: "uid e role são obrigatórios" },
        { status: 400 },
      );
    }

    const claims: Record<string, string> = { role };
    if (tenantId) claims.tenantId = tenantId;

    await adminAuth.setCustomUserClaims(uid, claims);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[POST /api/auth/claims]", error);
    return NextResponse.json(
      { error: "Falha ao definir claims" },
      { status: 500 },
    );
  }
}
