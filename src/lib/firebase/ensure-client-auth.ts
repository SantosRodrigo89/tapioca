import { getClientAuth } from "@/lib/firebase/client";

/**
 * Ensures Firebase Auth is ready for Firestore/Storage writes.
 * Custom claims (tenantId, role) must be present in the ID token for security rules.
 */
export async function ensureClientAuthForWrite(
  expectedTenantId?: string,
): Promise<void> {
  const auth = getClientAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "Sessão Firebase expirada. Saia e entre novamente para continuar editando.",
    );
  }

  const tokenResult = await user.getIdTokenResult(true);
  const role = tokenResult.claims.role as string | undefined;
  const tenantId = tokenResult.claims.tenantId as string | undefined;

  if (role === "super_admin") {
    return;
  }

  if (!tenantId) {
    throw new Error(
      "Permissões do usuário ainda não carregaram. Aguarde um instante e tente de novo.",
    );
  }

  if (expectedTenantId && tenantId !== expectedTenantId) {
    throw new Error("Você não tem permissão para editar este restaurante.");
  }
}
