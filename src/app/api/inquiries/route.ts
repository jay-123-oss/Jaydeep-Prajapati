import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { checkRateLimit, getClientIp, isValidEmail, sanitizeText } from "@/lib/security";

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting: Max 5 inquiries per 5 minutes per IP
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`inquiry:${clientIp}`, 5, 5 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Security rate limit exceeded. Please wait ${rateCheck.resetInSec} seconds before sending another transmission.`,
        },
        { status: 429 }
      );
    }

    // 2. Parse payload safely
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
    }

    const rawName = body?.name;
    const rawEmail = body?.email;
    const rawSubject = body?.subject;
    const rawMessage = body?.message;

    if (!rawName || !rawEmail || !rawMessage) {
      return NextResponse.json(
        { error: "Name, email and message are required fields" },
        { status: 400 }
      );
    }

    // 3. Email validation
    if (!isValidEmail(rawEmail)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      );
    }

    // 4. Sanitize and bound lengths to prevent XSS and DB bloat
    const name = sanitizeText(rawName, 100);
    const email = rawEmail.trim().slice(0, 120);
    const subject = sanitizeText(rawSubject || "General Portfolio Inquiry", 150);
    const message = sanitizeText(rawMessage, 3000);

    if (name.length < 2 || message.length < 5) {
      return NextResponse.json(
        { error: "Name or message too short to process" },
        { status: 400 }
      );
    }

    // 5. Parameterized SQL insert
    await initDb();
    const sql = getDb();

    await sql`
      INSERT INTO inquiries (name, email, subject, message, created_at)
      VALUES (${name}, ${email}, ${subject}, ${message}, NOW())
    `;

    return NextResponse.json({
      success: true,
      message: "Encrypted transmission safely dispatched and received.",
      remainingRequests: rateCheck.remaining,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Transmission failed due to an internal server error" },
      { status: 500 }
    );
  }
}
