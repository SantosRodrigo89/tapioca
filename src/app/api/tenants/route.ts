import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      error:
        "Cadastro público desativado. Novos restaurantes são criados via convite.",
      code: "SIGNUP_DISABLED",
    },
    { status: 403 },
  );
}
