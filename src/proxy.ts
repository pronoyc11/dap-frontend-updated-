import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/admin", "/recruiter", "/dashboard", "/attempt"];
const authPaths = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedPrefixes.some((prefix) => path.startsWith(prefix));
  const isAuthPath = authPaths.includes(path);
  const hasAccessCookie = Boolean(request.cookies.get("accessToken"));

  if (isAuthPath && hasAccessCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !hasAccessCookie) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/recruiter/:path*", "/dashboard/:path*", "/attempt/:path*"],
};
