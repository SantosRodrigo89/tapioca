import type { UserRole } from "@/types";

export function getPostLoginPath(
  role: UserRole | undefined,
  redirect?: string | null,
): string {
  if (role === "super_admin") {
    return "/super";
  }

  if (
    redirect &&
    redirect.startsWith("/") &&
    !redirect.startsWith("/auth") &&
    !redirect.startsWith("/super")
  ) {
    return redirect;
  }

  return "/dashboard";
}
