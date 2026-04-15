import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin route, not /admin/login
    if (pathname === "/admin" || (pathname.startsWith("/admin") && pathname !== "/admin/login")) {
        const authCookie = request.cookies.get("admin_auth");

        if (!authCookie || authCookie.value !== "authenticated") {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
