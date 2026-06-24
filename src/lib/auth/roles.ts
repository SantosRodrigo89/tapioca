import type { DecodedIdToken } from "firebase-admin/auth";

export function isSuperAdmin(user: DecodedIdToken | null | undefined): boolean {
  return user?.role === "super_admin";
}
