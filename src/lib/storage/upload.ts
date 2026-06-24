import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getClientStorage } from "@/lib/firebase/client";
import { refreshAuthToken } from "@/hooks/use-auth";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return "Formato inválido. Use JPEG, PNG ou WebP.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "Imagem muito grande. Máximo 5 MB.";
  }
  return null;
}

function extensionFromMime(type: string): string {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

async function uploadImage(path: string, file: File): Promise<string> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  await refreshAuthToken();

  const storageRef = ref(getClientStorage(), path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

export async function uploadTenantLogo(
  tenantId: string,
  file: File,
): Promise<string> {
  const ext = extensionFromMime(file.type);
  return uploadImage(`tenants/${tenantId}/logo.${ext}`, file);
}

export async function uploadTenantBanner(
  tenantId: string,
  file: File,
): Promise<string> {
  const ext = extensionFromMime(file.type);
  return uploadImage(`tenants/${tenantId}/banner.${ext}`, file);
}

export async function uploadMenuItemImage(
  tenantId: string,
  itemId: string,
  file: File,
): Promise<string> {
  const ext = extensionFromMime(file.type);
  return uploadImage(`tenants/${tenantId}/items/${itemId}.${ext}`, file);
}
