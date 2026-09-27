import { adminAuth } from "./admin";
import { verifySessionToken } from "./auth-session";
import { NextRequest } from "next/server";

export async function verifyAdminToken(token: string): Promise<{ uid: string; email: string; isAdmin: boolean } | null> {
  // First check HMAC-signed session token
  const session = verifySessionToken(token);
  if (session) {
    return {
      uid: session.uid,
      email: session.email,
      isAdmin: true,
    };
  }

  // Fallback to Firebase ID Token verification if applicable
  try {
    const decodedToken = await adminAuth!.verifyIdToken(token);
    if (!decodedToken.admin) return null;
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      isAdmin: true,
    };
  } catch {
    return null;
  }
}

export async function verifyAdminRequest(request: NextRequest): Promise<{ uid: string; email: string; isAdmin: boolean } | null> {
  // Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const user = await verifyAdminToken(token);
    if (user) return user;
  }

  // Check admin_session cookie
  const sessionCookie = request.cookies.get("admin_session")?.value;
  if (sessionCookie) {
    const session = verifySessionToken(sessionCookie);
    if (session) {
      return {
        uid: session.uid,
        email: session.email,
        isAdmin: true,
      };
    }
  }

  return null;
}

export async function setAdminClaim(uid: string): Promise<void> {
  try {
    await adminAuth!.setCustomUserClaims(uid, { admin: true });
  } catch (error) {
    console.warn("setAdminClaim warning:", error);
  }
}

export async function removeAdminClaim(uid: string): Promise<void> {
  try {
    await adminAuth!.setCustomUserClaims(uid, { admin: false });
  } catch (error) {
    console.warn("removeAdminClaim warning:", error);
  }
}