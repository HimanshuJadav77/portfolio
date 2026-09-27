'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';
import type { Project } from '@/types';

interface LatestPortfolioProps {
  projects?: Project[];
  className?: string;
}

const FALLBACK_STYLES = [
  'from-orange-600 via-amber-600 to-rose-700',
  'from-violet-600 via-purple-700 to-indigo-800',
  'from-rose-600 via-pink-700 to-amber-700',
  'from-slate-800 via-zinc-900 to-stone-900',
];

export function LatestPortfolio({ projects = [], className }: LatestPortfolioProps) {
  const displayProjects = projects.slice(0, 4);

  return (
    <section
      id="projects"
      className={cn('section section-offset bg-background relative overflow-hidden', className)}
      aria-labelledby="portfolio-heading"
    >
      {/* Background outline watermark */}
      <div className="container-narrow relative z-10">
        {/* Section Header: Left Watermark Title (7-8% under card), Right Titles & Info (Bottom Aligned, Minimal Padding) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative mb-6 sm:mb-8">
          <div className="flex-1 relative z-0 translate-y-2 sm:translate-y-3 lg:translate-y-3.5 pt-2 sm:pt-3 pl-4 sm:pl-7">
            <span className="editorial-title-watermark text-4xl sm:text-6xl lg:text-7xl xl:text-8xl block">
              PORTFOLIO
            </span>
          </div>

          <div className="flex-1 max-w-lg lg:self-end pb-2 sm:pb-2.5 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="eyebrow">SELECTED WORK</span>
              <div className="h-px w-12 bg-border" aria-hidden="true" />
            </div>
            <h2
              id="portfolio-heading"
              className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-foreground mb-2"
            >
              LATEST PORTFOLIO
            </h2>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Production applications engineered with strict layer separation, socket streaming, and local-first databases.
            </p>
          </div>
        </div>

        {/* 2x2 Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
          {displayProjects.map((project, idx) => {
            const hasImage = Boolean(project.heroImageUrl || project.thumbnailUrl);
            const imageUrl = project.heroImageUrl || project.thumbnailUrl;
            const gradient = FALLBACK_STYLES[idx % FALLBACK_STYLES.length];
            const primaryTech = project.technologies?.[0]?.name || project.category || 'System';
            const projectHref = project.slug ? `/projects/${project.slug}` : (project.githubUrl || '#');

            return (
              <motion.div
                key={project.id || project.slug || idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Link
                  href={projectHref}
                  className="group block relative rounded-3xl overflow-hidden bg-card border border-border/80 shadow-md hover:shadow-xl transition-all duration-300 aspect-[16/11] sm:aspect-[16/10]"
                >
                  {/* Image or High-Contrast Gradient Artwork */}
                  <div className="absolute inset-0">
                    {hasImage ? (
                      <Image
                        src={imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center p-8', gradient)}>
                        <span className="font-display text-4xl sm:text-5xl font-black text-white/30 uppercase tracking-wider text-center select-none">
                          {project.title}
                        </span>
                      </div>
                    )}
                    {/* Dark gradient overlay for typography readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 transition-colors duration-300" />
                  </div>

                  {/* Top-Right Badge: Category */}
                  <div className="absolute top-4 sm:top-5 right-4 sm:right-5 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-black/60 text-white border border-white/15 backdrop-blur-md">
                      {primaryTech}
                    </span>
                  </div>

                  {/* Bottom Content Bar */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 z-10 flex items-end justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-none mb-1.5 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 line-clamp-1 font-normal">
                        {project.shortDescription || project.description}
                      </p>
                    </div>

                    {/* Circular Action Button */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center shrink-0 shadow-lg group-hover:bg-primary group-hover:scale-110 transition-all duration-200">
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button — points directly to /projects */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity shadow-md"
          >
            <span>VIEW ALL PROJECTS ({projects.length})</span>
            </Link>
        </div>
      </div>
    </section>
  );
}
