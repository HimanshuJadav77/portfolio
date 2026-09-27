'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';
import type { Project } from '@/types';

interface EditorialProjectsCatalogProps {
  projects: Project[];
  className?: string;
}

const FALLBACK_STYLES = [
  'from-[#FF5E36] via-[#FF3366] to-[#C026D3]',
  'from-[#8B5CF6] via-[#6366F1] to-[#3B82F6]',
  'from-[#F59E0B] via-[#EF4444] to-[#EC4899]',
  'from-[#10B981] via-[#059669] to-[#047857]',
  'from-[#3B82F6] via-[#1D4ED8] to-[#1E3A8A]',
];

const CATEGORIES = ['ALL', 'MOBILE', 'BACKEND', 'REAL-TIME', 'SYSTEMS'] as const;

export function EditorialProjectsCatalog({ projects = [], className }: EditorialProjectsCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filtered = activeCategory === 'ALL'
    ? projects
    : projects.filter((p) => {
        const cat = (p.category || '').toUpperCase();
        const techs = (p.technologies || []).map((t) => t.name.toUpperCase());
        return cat.includes(activeCategory) || techs.some((t) => t.includes(activeCategory));
      });

  return (
    <section className={cn('section section-offset bg-background relative overflow-hidden pt-28 sm:pt-32 pb-20', className)}>
      <div className="container-narrow relative z-10 max-w-6xl mx-auto">
        {/* Section Header: Left Watermark Title, Right Original Title & Category Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="flex-1 pt-2 sm:pt-3 pl-4 sm:pl-7">
            <span className="editorial-title-watermark text-4xl sm:text-6xl lg:text-7xl xl:text-8xl block">
              SYSTEMS
            </span>
          </div>

          <div className="flex-1 flex flex-col items-start lg:items-end gap-5">
            <div className="text-left lg:text-right">
              <div className="flex items-center lg:justify-end gap-3 mb-2.5">
                <span className="eyebrow">COMPLETE CATALOG</span>
                <div className="h-px w-12 bg-border" aria-hidden="true" />
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-foreground">
                ENGINEERED SYSTEMS
              </h1>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-card rounded-full border border-border/80 shadow-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer',
                    activeCategory === cat
                      ? 'bg-foreground text-background shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => {
              const hasImage = Boolean(project.heroImageUrl || project.thumbnailUrl);
              const imageUrl = project.heroImageUrl || project.thumbnailUrl;
              const gradient = FALLBACK_STYLES[idx % FALLBACK_STYLES.length];
              const primaryTech = project.technologies?.[0]?.name || project.category || 'System';
              const projectHref = project.slug ? `/projects/${project.slug}` : (project.githubUrl || '#');

              return (
                <motion.div
                  key={project.id || project.slug || idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                >
                  <Link
                    href={projectHref}
                    className="group block relative rounded-3xl overflow-hidden bg-card border border-border/80 shadow-md hover:shadow-xl transition-all duration-300 aspect-[16/11] sm:aspect-[16/10]"
                  >
                    {/* Artwork / Image */}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 transition-colors duration-300" />
                    </div>

                    {/* Category Tag */}
                    <div className="absolute top-4 sm:top-5 right-4 sm:right-5 z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-black/60 text-white border border-white/15 backdrop-blur-md">
                        {primaryTech}
                      </span>
                    </div>

                    {/* Bottom Bar */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 z-10 flex items-end justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-none mb-1.5 group-hover:text-[#FF5E36] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-300 line-clamp-1 font-normal">
                          {project.shortDescription || project.description}
                        </p>
                      </div>

                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center shrink-0 shadow-lg group-hover:bg-[#FF5E36] group-hover:scale-110 transition-all duration-200">
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
