'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

interface IdentityProps {
  role?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  projectsCount?: number;
  skillsCount?: number;
  experienceCount?: number;
  className?: string;
}

export function Identity({
  avatarUrl = '/images/himanshu-profile.jpg',
  resumeUrl = 'https://drive.google.com/file/d/1iIDQiO3snQjOQZTe6gjWRhFa5d2fbLoI/view?usp=sharing',
  projectsCount = 3,
  skillsCount = 19,
  className,
}: IdentityProps) {
  return (
    <section
      id="about"
      className={cn('section section-offset bg-background relative overflow-hidden py-16 sm:py-24', className)}
      aria-labelledby="about-heading"
    >
      {/* Background outline watermark — bold crisp white */}
      <div className="container-narrow relative z-10 max-w-5xl mx-auto">
        {/* Section Header: Left Watermark Title (7-8% under card), Right Titles & Info (Bottom Aligned, Minimal Padding) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative mb-6 sm:mb-8">
          <div className="flex-1 relative z-0 translate-y-2 sm:translate-y-3 lg:translate-y-3.5 pt-2 sm:pt-3 pl-4 sm:pl-12">
            <span className="editorial-title-watermark text-4xl sm:text-6xl lg:text-7xl xl:text-8xl block">
              ABOUT
            </span>
          </div>

          <div className="flex-1 max-w-lg lg:self-end pb-2 sm:pb-2.5 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="eyebrow">ABOUT ME</span>
              <div className="h-px w-12 bg-border" aria-hidden="true" />
            </div>
            <h2
              id="about-heading"
              className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-foreground mb-2"
            >
              IDENTITY & BACKGROUND
            </h2>
            <p className="body-sm text-muted-foreground leading-relaxed">
              MCA graduate and Software Engineer crafting resilient architectures across mobile, sockets, and cloud.
            </p>
          </div>
        </div>

        {/* WHITE CONTAINER ENCLOSING IDENTITY & STATS */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-[32px] sm:rounded-[40px] p-5 sm:p-14 shadow-sm">
          {/* Centered Mission Statement */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <p className="font-display text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-foreground leading-snug">
              SOFTWARE ENGINEER CRAFTING HIGH-PERFORMANCE EXPERIENCES THROUGH MOBILE, DISTRIBUTED SOCKETS & CLOUD ARCHITECTURE.
            </p>
          </div>

          {/* Horizontal Axis with Center Circular Portrait & 4 Flanking Stats */}
          <div className="relative my-8 sm:my-12">
            {/* Horizontal Axis Line */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border/80 hidden sm:block" aria-hidden="true" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
              {/* Left Stats */}
              <div className="flex items-center gap-8 sm:gap-14 text-center sm:text-left">
                <div>
                  <span className="font-display text-4xl sm:text-5xl font-black text-foreground block tracking-tight">
                    {String(projectsCount).padStart(2, '0')}+
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block mt-1">
                    Systems Shipped
                  </span>
                </div>

                <div>
                  <span className="font-display text-4xl sm:text-5xl font-black text-foreground block tracking-tight">
                    {String(skillsCount).padStart(2, '0')}+
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block mt-1">
                    Core Technologies
                  </span>
                </div>
              </div>

              {/* Center Circular Portrait with Pill Badge */}
              <div className="relative flex flex-col items-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-card overflow-hidden shadow-xl bg-gradient-to-tr from-[#FF5E36] via-[#FF3366] to-[#C026D3] relative">
                  <Image
                    src={avatarUrl}
                    alt="Himanshu Jadav"
                    fill
                    sizes="128px"
                    className="object-cover object-top filter contrast-[1.08]"
                  />
                </div>

                <span className="mt-3 px-3 py-1 rounded-full bg-muted/60 border border-border/80 shadow-xs text-xs font-mono font-semibold text-foreground tracking-wide">
                  Himanshu Jadav
                </span>
              </div>

              {/* Right Stats */}
              <div className="flex items-center gap-8 sm:gap-14 text-center sm:text-right">
                <div>
                  <span className="font-display text-4xl sm:text-5xl font-black text-foreground block tracking-tight">
                    MCA
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block mt-1">
                    Atmiya University
                  </span>
                </div>

                <div>
                  <span className="font-display text-4xl sm:text-5xl font-black text-foreground block tracking-tight">
                    01+
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block mt-1">
                    Years Experience
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Single Authoritative Resume Download CTA */}
          <div className="mt-10 sm:mt-14 text-center">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background font-sans text-xs font-black uppercase tracking-wider hover:bg-[#FF5E36] shadow-sm transition-all"
            >
              <ArrowDown className="w-4 h-4" />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
