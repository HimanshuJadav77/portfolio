"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useScrollContext } from "@/components/scroll/ScrollProvider";
import { cn } from "@/lib/utils/helpers";

interface HeroProps {
  heroStatement?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  name?: string;
  role?: string;
  location?: string;
  avatarUrl?: string;
  className?: string;
}

export function Hero({
  heroStatement,
  name = "Himanshu Jadav",
  avatarUrl = "/images/himanshu-profile.jpg",
  className,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollProgress } = useScrollContext();
  const contentY = useTransform(scrollProgress, [0, 0.3], [0, -36]);
  const contentOpacity = useTransform(scrollProgress, [0, 0.6], [1, 0.45]);

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
      window.history.pushState(null, "", "#contact");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={cn(
        "relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-background pt-24 sm:pt-28 pb-12 sm:pb-16",
        className
      )}
      aria-label="Hero"
    >
      <motion.div
        className="relative z-10 w-full max-w-[1360px] px-5 sm:px-8 lg:px-12 mx-auto flex-1 flex flex-col justify-between"
        style={shouldReduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        {/* Top Center: Signature Arch with Portrait & Neon Purple Script */}
        <div className="flex justify-center items-center relative my-4 sm:my-8">
          {/* Background watermark placed EXACTLY behind the photo image */}
          <div
            className="hero-watermark-behind absolute top-[38%] left-0 right-0 w-full max-w-full text-center text-[14vw] sm:text-[13vw] lg:text-[12vw] leading-none select-none pointer-events-none z-0 whitespace-nowrap overflow-hidden"
            aria-hidden="true"
          >
            DEVELOPER
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10 w-64 sm:w-80 h-[340px] sm:h-[420px] rounded-t-full rounded-b-[46px] p-[2px] bg-gradient-to-b from-[#FF8A65] via-[#FF5E36] to-[#C026D3]/90 shadow-[0_25px_70px_-15px_rgba(255,94,54,0.35)] flex items-end justify-center"
          >
            {/* Inner Arch Container */}
            <div className="relative w-full h-full rounded-t-full rounded-b-[44px] bg-gradient-to-b from-[#FF7A45] via-[#FF3366] to-[#C026D3] overflow-hidden">
              {/* Top Arch Ambient Light Vignette */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-10" />

              {/* Profile Image inside the arch */}
              <div className="absolute inset-x-0 bottom-0 top-10 overflow-hidden">
                <Image
                  src={avatarUrl}
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 640px) 260px, 320px"
                  className="object-cover object-top filter contrast-[1.08] brightness-95"
                />
                {/* Soft gradient blend at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>
            </div>

            {/* Floating Black Badges on Arch edges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -left-2 sm:-left-6 top-20 sm:top-24 bg-zinc-950/95 text-white text-[10px] sm:text-[11px] font-mono tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20 shadow-xl -rotate-6 backdrop-blur-md z-20"
            >
              Flutter · Dart
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -right-2 sm:-right-6 top-14 sm:top-16 bg-zinc-950/95 text-white text-[10px] sm:text-[11px] font-mono tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20 shadow-xl rotate-6 backdrop-blur-md z-20"
            >
              Node.js · Sockets
            </motion.div>

            {/* Vibrant Luminous Purple Cursive Signature across the lower arch */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-8 sm:bottom-11 left-1/2 -translate-x-1/2 -rotate-3 z-30 select-none pointer-events-none w-max px-3 sm:px-4 py-1.5 sm:py-2"
            >
              <span className="signature-script text-3xl sm:text-5xl lg:text-6xl font-bold block whitespace-nowrap">
                {name}
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Split Layout: Left Headline (No Numbering) + Right Bio Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-end pt-6">
          {/* Bottom Left: Bold Condensed Headline */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
                SPECIALIZING IN
              </p>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-foreground leading-[0.92]">
                FLUTTER, NODE.JS & DISTRIBUTED SYSTEMS.
              </h1>
            </motion.div>
          </div>

          {/* Bottom Right: White Floating Card with Spinning Badge */}
          <div className="lg:col-span-5 flex justify-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full max-w-md bg-card text-card-foreground rounded-3xl p-5 sm:p-7 border border-border/80 shadow-md flex items-center justify-between gap-3 sm:gap-5 relative overflow-hidden"
            >
              <div className="flex-1 pr-1 sm:pr-2 min-w-0">
                <p className="text-xs sm:text-base font-normal text-muted-foreground leading-relaxed">
                  {heroStatement ||
                    "MCA graduate & Software Engineer crafting high-throughput systems, real-time socket delivery, and resilient offline-first architectures."}
                </p>
                <div className="mt-2.5 sm:mt-3 flex items-center gap-2 text-[11px] sm:text-xs font-mono text-foreground font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>AVAILABLE FOR ROLES</span>
                </div>
              </div>

              {/* Spinning Circular Badge */}
              <button
                onClick={scrollToContact}
                aria-label="Contact Himanshu Jadav"
                className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer group"
              >
                <svg
                  className="absolute inset-0 w-full h-full animate-spin-slow"
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9.5px] font-mono tracking-[0.16em] uppercase fill-current">
                    <textPath href="#circlePath" startOffset="0%">
                      • AVAILABLE FOR HIRE • LET'S TALK
                    </textPath>
                  </text>
                </svg>

                <ArrowUpRight className="w-5 h-5 text-current group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
