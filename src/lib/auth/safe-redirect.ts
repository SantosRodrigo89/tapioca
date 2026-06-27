const ALLOWED_REDIRECT_PREFIXES = [
  "/dashboard",
  "/site",
  "/menu",
  "/settings",
] as const;

/**
 * Validates post-login redirect targets. Only same-origin relative paths
 * under known admin routes (or invite accept) are allowed.
 */
export function isSafeInternalRedirect(path: string): boolean {
  if (!path || !path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("\\")) return false;
  if (path.includes("\0")) return false;

  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    return false;
  }

  if (decoded.startsWith("//") || decoded.includes("\\")) return false;

  const pathname = decoded.split("?")[0]?.split("#")[0] ?? decoded;

  if (pathname.startsWith("/auth") && !pathname.startsWith("/auth/invite/")) {
    return false;
  }

  if (pathname.startsWith("/super")) return false;

  if (pathname.startsWith("/auth/invite/")) return true;

  return ALLOWED_REDIRECT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
