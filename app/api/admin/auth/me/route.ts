import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/firebase/auth-session";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const session = verifySessionToken(sessionCookie);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      uid: session.uid,
      email: session.email,
      isAdmin: session.isAdmin,
    },
  });
}
