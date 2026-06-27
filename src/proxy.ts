import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  resolveRateLimitRoute,
} from "@/lib/rate-limit";

const ADMIN_ROUTES = [
  "/dashboard",
  "/site",
  "/menu",
  "/catalog",
  "/settings",
];

const SUPER_ROUTES_PREFIX = "/super";

function applyRateLimitHeaders(
  response: NextResponse,
  result: NonNullable<Awaited<ReturnType<typeof checkRateLimit>>>,
): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(result.reset));
  return response;
}

async function handleRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const routeId = resolveRateLimitRoute(
    request.nextUrl.pathname,
    request.method,
  );
  if (!routeId) return null;

  const ip = getClientIp(request);
  const tokenSuffix =
    routeId === "invite-accept" || routeId === "invite-get"
      ? `:${request.nextUrl.pathname.split("/")[3] ?? ""}`
      : "";

  const result = await checkRateLimit(routeId, `${ip}${tokenSuffix}`);
  if (!result) return null;

  if (!result.success) {
    const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    const response = NextResponse.json(
      { error: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429 },
    );
    response.headers.set("Retry-After", String(retryAfter));
    return applyRateLimitHeaders(response, result);
  }

  return null;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const rateLimited = await handleRateLimit(request);
  if (rateLimited) return rateLimited;

  const { pathname } = request.nextUrl;

  const isSuperRoute =
    pathname === SUPER_ROUTES_PREFIX ||
    pathname.startsWith(`${SUPER_ROUTES_PREFIX}/`);
  const isAdminRoute =
    isSuperRoute ||
    ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("__session")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/auth/session",
    "/api/tenants",
    "/api/invites/:path*",
    "/dashboard/:path*",
    "/site/:path*",
    "/menu/:path*",
    "/catalog/:path*",
    "/settings/:path*",
    "/super",
    "/super/:path*",
  ],
};
