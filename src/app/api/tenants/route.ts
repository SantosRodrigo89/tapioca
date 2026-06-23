import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateSlug } from "@/lib/utils";
import { SlugSchema } from "@/lib/schemas/tenant.schema";

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

    // Validate uid by checking the user exists
    const userRecord = await adminAuth.getUser(uid).catch(() => null);
    if (!userRecord) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const slug = generateSlug(restaurantName);
    const slugValidation = SlugSchema.safeParse(slug);
    if (!slugValidation.success) {
      return NextResponse.json(
        { error: slugValidation.error.issues[0]?.message ?? "Slug inválido" },
        { status: 400 },
      );
    }

    // Check slug uniqueness
    const slugSnap = await adminDb.doc(`slugIndex/${slug}`).get();
    if (slugSnap.exists) {
      return NextResponse.json(
        { error: "Nome do restaurante já está em uso. Tente um nome diferente." },
        { status: 409 },
      );
    }

    // Use the Firebase Auth UID as the tenant document ID for simplicity
    const tenantId = uid;
    const now = FieldValue.serverTimestamp();

    const batch = adminDb.batch();

    batch.set(adminDb.doc(`tenants/${tenantId}`), {
      id: tenantId,
      slug,
      name: restaurantName,
      description: null,
      logoUrl: null,
      address: null,
      whatsapp: null,
      status: "trial",
      ownerUid: uid,
      createdAt: now,
      updatedAt: now,
    });

    batch.set(adminDb.doc(`slugIndex/${slug}`), {
      tenantId,
      createdAt: now,
    });

    await batch.commit();

    // Set custom claims
    await adminAuth.setCustomUserClaims(uid, {
      role: "tenant_admin",
      tenantId,
    });

    return NextResponse.json({ tenantId, slug }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/tenants]", error);
    return NextResponse.json(
      { error: "Falha ao criar restaurante" },
      { status: 500 },
    );
  }
}
