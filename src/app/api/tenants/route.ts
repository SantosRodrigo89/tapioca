import { NextRequest, NextResponse } from "next/server";
import { generateSlug } from "@/lib/utils";
import { SlugSchema } from "@/lib/schemas/tenant.schema";
import {
  createSelfServiceTenantServer,
  SelfServiceTenantError,
} from "@/services/platform/create-self-service-tenant.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, restaurantName } = body as {
      uid?: string;
      restaurantName?: string;
    };

    if (!uid || !restaurantName) {
      return NextResponse.json(
        { error: "uid e restaurantName são obrigatórios" },
        { status: 400 },
      );
    }

    const slug = generateSlug(restaurantName);
    const slugValidation = SlugSchema.safeParse(slug);
    if (!slugValidation.success) {
      return NextResponse.json(
        { error: slugValidation.error.issues[0]?.message ?? "Slug inválido" },
        { status: 400 },
      );
    }

    const result = await createSelfServiceTenantServer({
      uid,
      restaurantName,
      slug,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof SelfServiceTenantError) {
      const status =
        error.code === "USER_NOT_FOUND"
          ? 404
          : error.code === "SLUG_TAKEN"
            ? 409
            : 400;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }

    console.error("[POST /api/tenants]", error);
    return NextResponse.json(
      { error: "Falha ao criar restaurante" },
      { status: 500 },
    );
  }
}
