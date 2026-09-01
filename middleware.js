import { NextResponse } from "next/server";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const expectedSession = process.env.ADMIN_SESSION_TOKEN;
  const currentSession = request.cookies.get("floowp_admin_session")?.value;

  if (!expectedSession || currentSession !== expectedSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
