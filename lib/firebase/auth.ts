import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./client";

export interface AdminUser {
  uid: string;
  email: string;
  isAdmin: boolean;
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

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Session creation failed");
      }

      return data.user;
    } catch (firebaseErr: unknown) {
      const err = firebaseErr as { code?: string; message?: string };
      // If user is rejected by Firebase Auth explicitly:
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        throw new Error("Invalid email or password in Firebase Authentication");
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

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Authentication failed");
  }

  return data.user;
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