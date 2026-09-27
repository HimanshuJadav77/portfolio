"use server";

import { cookies } from "next/headers";

const ADMIN_ACCESS_TOKEN = process.env.ADMIN_ACCESS_TOKEN || "123456";


/**
 * Validates the admin access token and creates an HTTP-only session cookie.
 * 
 * This must be called via server action (POST route or form action).
 * 
 * @returns {string} The session cookie key
 */
export function validateAdminToken(token: string): void {
  if (token !== ADMIN_ACCESS_TOKEN) {
    throw new Error("Invalid access token");
  }

  const cookieStore = cookies();
  // @ts-ignore - dynamic cookie handling
  cookieStore.set("admin_session", "verified", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
  });
}

/**
 * Gets the current admin session status.
 * 
 * Returns 'verified' | 'invalid' | 'none'
 */
export function getAdminSession(): "verified" | "invalid" | "none" {
  const cookieStore = cookies();
  // @ts-ignore - dynamic cookie handling
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || !sessionCookie.value) {
    return "none";
  }

  if (sessionCookie.value === "verified") {
    return "verified";
  }

  return "invalid";
}

/**
 * Clears the admin session (logout).
 */
export function clearAdminSession(): void {
  const cookieStore = cookies();
  // @ts-ignore - dynamic cookie handling
  cookieStore.set("admin_session", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Authentication middleware check.
 * 
 * Returns null if authenticated, or a redirect path string if not.
 */
export function authMiddleware(): string | null {
  const session = getAdminSession();

  if (session === "verified") {
    return null; // authenticated
  }

  // Return login redirect path
  return "/admin/login";
}