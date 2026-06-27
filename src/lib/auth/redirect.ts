import type { UserRole } from "@/types";
import { isSafeInternalRedirect } from "@/lib/auth/safe-redirect";

export function getPostLoginPath(
  role: UserRole | undefined,
  redirect?: string | null,
): string {
  if (role === "super_admin") {
    return "/super";
  }

  if (redirect && isSafeInternalRedirect(redirect)) {
    return redirect;
  }

  return "/dashboard";
}
