import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";
import type { Session } from "./lib/auth-types";

export async function middleware(request: NextRequest) {
    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        },
    );

    if (!session?.user) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
    if (isAdminPage && session.user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/admin/:path*", "/checkout"],
};
