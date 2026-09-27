'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/helpers';
import type { Project } from '@/types';

interface CaseStudiesRowsProps {
  projects?: Project[];
  className?: string;
}

const DEFAULT_STORIES = [
  {
    quote: "Engineered raw TCP socket streaming with chunk-based memory buffers, saturating local LAN bandwidth at ~50 MB/s with zero cloud dependency.",
    client: "FAST SHARE",
    role: "Flutter · Dart · TCP Sockets",
    slug: "fastshare",
    avatarBg: "from-[#FF5E36] to-[#FF3366]",
    initials: "FS"
  },
  {
    quote: "Achieved sub-50ms bidirectional messaging delivery via Socket.IO cluster, backed by local SQLite queues to guarantee zero packet loss across disconnects.",
    client: "QUICKMESSENGER",
    role: "Node.js · Socket.IO · SQLite",
    slug: "quickmessenger",
    avatarBg: "from-[#8B5CF6] to-[#C026D3]",
    initials: "QM"
  },
  {
    quote: "Unified enterprise inventory, lot tracking, and stock audit workflows with local-first SQLite schema caching and real-time backend synchronization.",
    client: "BHAGWATI JEWELLERY SYSTEM",
    role: "Flutter Web · SQLite · REST APIs",
    slug: "bhagwati-jewellery-system",
    avatarBg: "from-[#F59E0B] to-[#EF4444]",
    initials: "BJ"
  }
];

export function CaseStudiesRows({ projects = [], className }: CaseStudiesRowsProps) {
  const stories = DEFAULT_STORIES.map(item => {
    const matched = projects.find(p => p.slug === item.slug || p.id === item.slug);
    if (!matched) return item;
    return {
      ...item,
      client: matched.title.toUpperCase(),
      quote: matched.problem || matched.shortDescription || item.quote,
      role: matched.technologies?.map(t => t.name).slice(0, 3).join(' · ') || item.role,
    };
  });

  return (
    <section
      id="case-studies"
      className={cn('section section-offset bg-background relative overflow-hidden py-16 sm:py-24', className)}
      aria-label="Case Studies"
    >
      {/* Background outline watermark — bold crisp white */}
      <div className="container-narrow relative z-10 max-w-5xl mx-auto">
        {/* Section Header: Left Watermark Title (7-8% under card), Right Titles & Info (Bottom Aligned, Minimal Padding) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative mb-6 sm:mb-8">
          <div className="flex-1 relative z-0 translate-y-2 sm:translate-y-3 lg:translate-y-3.5 pt-2 sm:pt-3 pl-4 sm:pl-12">
            <span className="editorial-title-watermark text-4xl sm:text-6xl lg:text-7xl xl:text-8xl block">
              OUTCOMES
            </span>
          </div>

          <div className="flex-1 max-w-lg lg:self-end pb-2 sm:pb-2.5 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="eyebrow">PROVEN RESULTS</span>
              <div className="h-px w-12 bg-border" aria-hidden="true" />
            </div>
            <h2
              id="outcomes-heading"
              className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-foreground mb-2"
            >
              ARCHITECTURAL OUTCOMES
            </h2>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Production benchmarks and latency optimizations verified through shipped system deployments.
            </p>
          </div>
        </div>

        {/* WHITE CONTAINER ENCLOSING CASE STUDIES */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-[32px] sm:rounded-[40px] p-5 sm:p-14 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-5 mb-6">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest font-bold">
              ARCHITECTURAL OUTCOMES
            </span>
            <span className="font-mono text-xs text-[#FF5E36] font-bold">VERIFIED PRODUCTION METRICS</span>
          </div>

          <div className="divide-y divide-border/80">
            {stories.map((story, idx) => (
              <motion.div
                key={story.client}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link
                  href={`/projects/${story.slug}`}
                  className="py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group cursor-pointer block"
                >
                  <div className="flex-1 pr-0 sm:pr-8">
                    <p className="text-base sm:text-lg text-foreground/90 font-normal leading-relaxed mb-4 group-hover:text-[#FF5E36] transition-colors">
                      &ldquo;{story.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-foreground group-hover:text-[#FF5E36] transition-colors">
                        {story.client}
                      </span>
                      <span className="text-muted-foreground font-mono text-xs">/</span>
                      <span className="text-muted-foreground font-mono text-xs uppercase tracking-wide">
                        {story.role}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    <div className={cn(
                      "w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr flex items-center justify-center text-white font-display font-black text-xl shadow-md border-2 border-white group-hover:scale-105 group-hover:shadow-lg transition-all",
                      story.avatarBg
                    )}>
                      {story.initials}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
