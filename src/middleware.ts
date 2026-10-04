import { NextResponse, type NextRequest } from "next/server";
import { SESSION_HINT } from "@/lib/session";
const protectedPrefixes = ["/admin", "/recruiter", "/dashboard", "/attempt"];
export function middleware(request: NextRequest) { const path = request.nextUrl.pathname; const protectedRoute = protectedPrefixes.some((prefix) => path.startsWith(prefix)); const hasBackendCookie = Boolean(request.cookies.get("accessToken")); const hasSessionHint = Boolean(request.cookies.get(SESSION_HINT)); if (protectedRoute && !hasBackendCookie && !hasSessionHint) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, request.url)); return NextResponse.next(); }
export const config = { matcher: ["/admin/:path*", "/recruiter/:path*", "/dashboard/:path*", "/attempt/:path*"] };
