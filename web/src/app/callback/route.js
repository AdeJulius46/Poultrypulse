// app/auth/callback/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
    const url = new URL("/register", request.url);
    return NextResponse.redirect(url);
}
