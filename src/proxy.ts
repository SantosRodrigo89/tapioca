import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROUTES = ["/dashboard", "/catalog", "/settings", "/super"];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Firebase Auth session cookie verification happens in individual page/route handlers
  // using the Admin SDK, which cannot run in Edge proxy. This proxy handles redirect
  // logic only — actual auth verification is in server components.
  const sessionCookie = request.cookies.get("__session")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/catalog/:path*", "/settings/:path*", "/super/:path*"],
};
