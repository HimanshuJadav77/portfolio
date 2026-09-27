import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/firebase/auth-session";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, email, password } = body;

    // 1. Firebase Authentication: verify ID token from client
    if (idToken) {
      try {
        const adminAuth = getAdminAuth();
        if (adminAuth) {
          const decoded = await adminAuth.verifyIdToken(idToken);
          const userEmail = decoded.email || email || "admin@himanshujadav.com";

          const token = createSessionToken(userEmail);
          const response = NextResponse.json({
            success: true,
            user: {
              uid: decoded.uid,
              email: userEmail,
              isAdmin: true,
            },
          });

          response.cookies.set({
            name: "admin_session",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          });

          return response;
        }
      } catch (authError) {
        console.warn("Firebase ID token verification failed:", authError);
        return NextResponse.json(
          { error: "Invalid Firebase authentication token" },
          { status: 401 }
        );
      }
    }

    // 2. Direct email and password credentials verification
    const expectedEmail = process.env.ADMIN_EMAIL || "admin@himanshujadav.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "Admin@Portfolio2026!";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const isEmailValid = email.trim().toLowerCase() === expectedEmail.trim().toLowerCase();
    const isPasswordValid = password === expectedPassword;

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = createSessionToken(expectedEmail);
    const response = NextResponse.json({
      success: true,
      user: {
        uid: "admin",
        email: expectedEmail,
        isAdmin: true,
      },
    });

    response.cookies.set({
      name: "admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
