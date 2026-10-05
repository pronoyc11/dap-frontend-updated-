import { NextResponse, type NextRequest } from "next/server";

const routeGroups = {
  admin: ["/admin"],
  recruiter: ["/recruiter"],
  candidate: ["/dashboard", "/attempt"],
} as const;
const authRoutes = ["/login", "/register"];
function matches(pathname: string, prefixes: readonly string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSession = Boolean(request.cookies.get("accessToken"));
  const isAuthRoute = authRoutes.includes(pathname);
  const isProtected =
    matches(pathname, routeGroups.admin) ||
    matches(pathname, routeGroups.recruiter) ||
    matches(pathname, routeGroups.candidate);
  if (isAuthRoute && hasSession) return NextResponse.redirect(new URL("/dashboard", request.url));
  if (isProtected && !hasSession)
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url),
    );
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin/:path*",
    "/recruiter/:path*",
    "/dashboard/:path*",
    "/attempt/:path*",
  ],
};
