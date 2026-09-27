import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./client";

export interface AdminUser {
  uid: string;
  email: string;
  isAdmin: boolean;
}

// Safely parse JSON from a fetch response, returning null if body is empty or invalid
async function safeJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    const text = await res.text();
    if (!text || !text.trim()) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function signInAdmin(email: string, password: string): Promise<AdminUser> {
  // 1. Try Firebase Authentication first if initialized on client
  if (auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, email }),
      });

      const data = await safeJson(res);
      if (!res.ok || !data) {
        throw new Error(
          (data?.error as string) ||
          `Server returned ${res.status}${res.statusText ? ' ' + res.statusText : ''}. Check that environment variables are configured on your hosting provider.`
        );
      }

      return data.user as AdminUser;
    } catch (firebaseErr: unknown) {
      const err = firebaseErr as { code?: string; message?: string };
      // If user is rejected by Firebase Auth explicitly:
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        throw new Error("Invalid email or password");
      }

      // If configuration is not yet active in console or offline, fallback to server check
      console.warn("Firebase Client Auth not ready, falling back to server credentials:", err.message);
    }
  }

  // 2. Direct server-side authentication check
  const res = await fetch("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await safeJson(res);
  if (!res.ok || !data) {
    throw new Error(
      (data?.error as string) ||
      `Server returned ${res.status}${res.statusText ? ' ' + res.statusText : ''}. Make sure ADMIN_EMAIL and ADMIN_PASSWORD environment variables are set on your hosting provider.`
    );
  }

  return data.user as AdminUser;
}

export async function signOutAdmin(): Promise<void> {
  if (auth) {
    try {
      await auth.signOut();
    } catch (e) {
      console.warn("Client signOut warning:", e);
    }
  }
  await fetch("/api/admin/auth/logout", { method: "POST" });
}

export function onAdminAuthChange(callback: (user: AdminUser | null) => void): () => void {
  let active = true;

  fetch("/api/admin/auth/me")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!active) return;
      if (data?.authenticated && data?.user) {
        callback(data.user);
      } else {
        callback(null);
      }
    })
    .catch(() => {
      if (active) callback(null);
    });

  return () => {
    active = false;
  };
}