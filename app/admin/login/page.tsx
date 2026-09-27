"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, AlertCircle, Loader2, Mail } from "lucide-react";
import { signInAdmin } from "@/lib/firebase/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [redirectTo] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("redirect") || "/admin";
    }
    return "/admin";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInAdmin(email, password);
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground mb-2">ADMIN</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-md border border-border bg-card flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary" aria-hidden="true" />
            </span>
            <h1 className="font-display text-2xl font-medium tracking-tight text-foreground">Admin Access</h1>
          </div>
          <p className="text-sm text-muted-foreground">Sign in to manage your portfolio</p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="border border-border rounded-lg bg-card p-6 sm:p-8 space-y-5"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-error/10 border border-error/30 rounded-lg text-error text-sm"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="label-field">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                autoComplete="email"
                className="input-field pl-10"
                placeholder="admin@himanshujadav.com"
                aria-describedby={error ? "error-message" : undefined}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="label-field">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                autoComplete="current-password"
                className="input-field pl-10 pr-10"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="btn-primary w-full py-3 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                SIGNING IN...
              </>
            ) : (
              "SIGN IN"
            )}
          </motion.button>

          <p className="text-xs text-center text-muted-foreground">
            Only authorized administrators can sign in here.
          </p>
        </motion.form>

        {/* Back to site */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <span className="font-mono text-xs">←</span>
            BACK TO PORTFOLIO
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
