import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit, getClientIp, timingSafeCompare } from "@/lib/security";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jay@123";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    // Max 5 attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(`admin-auth:${clientIp}`, 5, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many failed admin authentication attempts. Locked out for ${rateCheck.resetInSec}s.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const password = typeof body?.password === "string" ? body.password : "";

    if (timingSafeCompare(password, ADMIN_PASSWORD)) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid admin password. Attempt recorded.", remainingAttempts: rateCheck.remaining },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: "Authentication system error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (session && session.value === "authenticated") {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
