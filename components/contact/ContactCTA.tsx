"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUpRight, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils/helpers";

interface ContactCTAProps {
  email?: string;
  phone?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  avatarUrl?: string;
  className?: string;
}

export function ContactCTA({
  email = "himanshujadav1877@gmail.com",
  phone = "9054158657",
  location = "Rajkot, Gujarat, India",
  githubUrl = "https://github.com/HimanshuJadav77",
  linkedinUrl = "https://linkedin.com/in/himanshu-jadav-17b56b2a1",
  resumeUrl = "https://drive.google.com/file/d/1iIDQiO3snQjOQZTe6gjWRhFa5d2fbLoI/view?usp=sharing",
  avatarUrl = "/images/himanshu-profile.jpg",
  className,
}: ContactCTAProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to deliver message. Please reach out via email directly.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section
      id="contact"
      className={cn("section section-offset bg-background relative overflow-hidden", className)}
      aria-labelledby="contact-heading"
    >
      {/* Background outline watermark */}
      <div className="container-narrow relative z-10 max-w-5xl mx-auto">
        {/* Section Header: Left Watermark Title (7-8% under card), Right Titles & Info (Bottom Aligned, Minimal Padding) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative mb-6 sm:mb-8">
          <div className="flex-1 relative z-0 translate-y-2 sm:translate-y-3 lg:translate-y-3.5 pt-2 sm:pt-3 pl-4 sm:pl-10">
            <span className="editorial-title-watermark text-4xl sm:text-6xl lg:text-7xl xl:text-8xl block">
              CONTACT
            </span>
          </div>

          <div className="flex-1 max-w-lg lg:self-end pb-2 sm:pb-2.5 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="eyebrow">GET IN TOUCH</span>
              <div className="h-px w-12 bg-border" aria-hidden="true" />
            </div>
            <h2
              id="contact-heading"
              className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-foreground mb-2"
            >
              LET'S BUILD TOGETHER
            </h2>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Available for software engineering roles, mobile architecture, distributed systems, and technical consulting.
            </p>
          </div>
        </div>

        {/* Split Contact Card */}
        <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left Warm Coral Column */}
          <div className="lg:col-span-5 p-5 sm:p-10 bg-gradient-to-b from-[#FF5E36] via-[#FF3366] to-[#C026D3] text-white flex flex-col justify-between relative overflow-hidden">
            {/* Cutout Portrait Container */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black/20 mb-8 border border-white/20 shadow-lg">
              <Image
                src={avatarUrl}
                alt="Himanshu Jadav"
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover object-top filter contrast-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for Hire
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-none mb-3">
                HIMANSHU JADAV
              </h3>
              <p className="text-white/80 text-xs sm:text-sm font-normal leading-relaxed mb-6">
                Software Engineer specializing in Flutter applications, Node.js services, and low-latency real-time systems.
              </p>

              {/* Direct channels */}
              <div className="space-y-3 font-mono text-xs text-white/90">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-white/70" />
                  <span>{email}</span>
                </a>

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-2.5 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 shrink-0 text-white/70" />
                    <span>+91 {phone}</span>
                  </a>
                )}

                <div className="flex items-center gap-2.5 text-white/80">
                  <MapPin className="w-4 h-4 shrink-0 text-white/70" />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-6 border-t border-white/20 flex items-center gap-3">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-5 sm:p-12 bg-card flex flex-col justify-center">
            <h2
              id="contact-heading"
              className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-foreground leading-none mb-3"
            >
              LET'S TALK
            </h2>
            <p className="body-sm text-muted-foreground mb-8">
              Have a high-throughput mobile app, real-time backend, or engineering opportunity? Send a message directly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Alex Rivera"
                  className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your system requirements, architecture, or project scope..."
                  className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-destructive text-xs font-mono p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {status === "success" && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Message delivered to Firestore! I will reply shortly.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 px-6 rounded-full bg-foreground text-background font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
              >
                {status === "submitting" ? (
                  <span>SENDING INQUIRY...</span>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
