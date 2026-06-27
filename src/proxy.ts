import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROUTES = [
  "/dashboard",
  "/site",
  "/menu",
  "/catalog",
  "/settings",
];

const SUPER_ROUTES_PREFIX = "/super";

export function proxy(request: NextRequest): NextResponse {
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
    "/dashboard/:path*",
    "/site/:path*",
    "/menu/:path*",
    "/catalog/:path*",
    "/settings/:path*",
    "/super",
    "/super/:path*",
  ],
};
