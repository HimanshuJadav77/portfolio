'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Cpu, Layers, Database, Server, Smartphone, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

interface ToolItem {
  name: string;
  category: 'MOBILE' | 'BACKEND' | 'DATABASE' | 'SYSTEMS';
  role: string;
  level: string;
}

const TOOLS_DATA: ToolItem[] = [
  { name: 'FLUTTER', category: 'MOBILE', role: 'Multiplatform Client Architecture', level: 'Production' },
  { name: 'DART', category: 'MOBILE', role: 'Type-Safe App Development', level: 'Core' },
  { name: 'RIVERPOD', category: 'MOBILE', role: 'Reactive Immutable State Flow', level: 'Architecture' },
  { name: 'NODE.JS', category: 'BACKEND', role: 'Asynchronous Event-Driven Runtime', level: 'Production' },
  { name: 'SOCKET.IO', category: 'BACKEND', role: 'Sub-50ms Bidirectional Streaming', level: 'Real-Time' },
  { name: 'EXPRESS.JS', category: 'BACKEND', role: 'Modular REST API Microservices', level: 'Backend' },
  { name: 'RAW TCP', category: 'SYSTEMS', role: '~50 MB/s Chunked Socket Buffers', level: 'Networking' },
  { name: 'SQLITE', category: 'DATABASE', role: 'Offline-First Local Schema Caching', level: 'Local-First' },
  { name: 'FIREBASE', category: 'DATABASE', role: 'Firestore, Auth & Storage Cloud', level: 'Cloud' },
  { name: 'POSTGRESQL', category: 'DATABASE', role: 'Relational Schemas & Indexing', level: 'Data' },
  { name: 'NEXT.JS', category: 'BACKEND', role: 'Modern Server-Side Rendered Web', level: 'Full-Stack' },
  { name: 'DOCKER', category: 'SYSTEMS', role: 'Consistent Microservice Containers', level: 'DevOps' },
];

const CATEGORIES = ['ALL', 'MOBILE', 'BACKEND', 'DATABASE', 'SYSTEMS'] as const;

export function TechToolsBar({ className }: { className?: string }) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredTools = activeCategory === 'ALL'
    ? TOOLS_DATA
    : TOOLS_DATA.filter((t) => t.category === activeCategory);

  return (
    <section id="tools" className={cn('section section-offset bg-background relative overflow-hidden py-16 sm:py-24', className)} aria-label="Tools">
      <div className="container-narrow max-w-5xl mx-auto relative z-10">
        {/* Section Header: Left Watermark Title (7-8% under card), Right Titles & Info (Bottom Aligned, Minimal Padding) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative mb-6 sm:mb-8">
          <div className="flex-1 relative z-0 translate-y-2 sm:translate-y-3 lg:translate-y-3.5 pt-2 sm:pt-3 pl-4 sm:pl-12">
            <span className="editorial-title-watermark text-4xl sm:text-6xl lg:text-7xl xl:text-8xl block">
              TOOLS
            </span>
          </div>

          <div className="flex-1 max-w-lg lg:self-end pb-2 sm:pb-2.5 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="eyebrow">TECH STACK</span>
              <div className="h-px w-12 bg-border" aria-hidden="true" />
            </div>
            <h2
              id="tools-heading"
              className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-foreground mb-2"
            >
              TOOLS & TECHNOLOGIES
            </h2>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Production toolset, runtimes, distributed protocols, and frameworks leveraged across deployed systems.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-[32px] sm:rounded-[40px] p-5 sm:p-12 border border-border/80 shadow-sm relative z-10">
          {/* Top Bar Header & Category Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-1">
                ENGINEERING MATRIX
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-foreground tracking-tight">
                ACTIVE PROTOCOLS & RUNTIMES
              </h3>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-2xl sm:rounded-full border border-border/60">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-3.5 py-1 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer',
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

          {/* Interactive Tools Grid Widget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-6">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-2xl bg-muted/30 border border-border/60 hover:border-foreground/30 hover:bg-card hover:shadow-sm transition-all group flex flex-col justify-between min-h-[96px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {tool.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-muted text-muted-foreground border border-border/60">
                      {tool.level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-border/40">
                    <p className="text-xs text-muted-foreground font-normal line-clamp-1">
                      {tool.role}
                    </p>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
