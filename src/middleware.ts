import { NextResponse, type NextRequest } from "next/server";
const protectedPrefixes = ["/admin", "/recruiter", "/dashboard", "/attempt"];
export function middleware(request: NextRequest) { const path = request.nextUrl.pathname; if (protectedPrefixes.some((prefix) => path.startsWith(prefix)) && !request.cookies.get("accessToken")) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, request.url)); return NextResponse.next(); }
export const config = { matcher: ["/admin/:path*", "/recruiter/:path*", "/dashboard/:path*", "/attempt/:path*"] };
