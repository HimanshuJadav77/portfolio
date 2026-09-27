'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/helpers";
import type { Project, Skill } from "@/types";

interface CapabilityItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
}

const CAPABILITIES: CapabilityItem[] = [
  {
    id: "mobile",
    title: "MOBILE ENGINEERING",
    description:
      "Production-grade mobile applications engineered with Flutter & Dart. Clean Architecture with strict layer separation, local SQLite offline caching, and responsive reactive state management via Riverpod.",
    technologies: ["Flutter", "Dart", "Clean Architecture", "Riverpod", "SQLite"],
  },
  {
    id: "realtime",
    title: "REAL-TIME SYSTEMS",
    description:
      "Low-latency bidirectional data delivery and event streaming over Socket.IO and raw TCP sockets. Resilient presence tracking, automatic reconnect backoff, and local queue synchronization.",
    technologies: ["Socket.IO", "TCP Sockets", "WebSockets", "Node.js", "Event Bus"],
  },
  {
    id: "backend",
    title: "BACKEND SERVICES",
    description:
      "Modular backend services built with Node.js and Express. RESTful API design, JWT authentication, Firebase Admin SDK integration, and structured controller-service workflows.",
    technologies: ["Node.js", "Express.js", "REST APIs", "JWT Auth", "Firebase Admin"],
  },
  {
    id: "networking",
    title: "NETWORKING & PROTOCOLS",
    description:
      "High-throughput framed socket communication and local discovery mechanisms designed to saturate local network bandwidth without external cloud dependencies.",
    technologies: ["TCP", "Sockets", "Chunk Streaming", "Local Discovery"],
  },
  {
    id: "persistence",
    title: "CLOUD & DATA PERSISTENCE",
    description:
      "Resilient dual-layer data persistence combining local-first SQLite caching for instant offline reads with Cloud Firestore and relational databases for synchronized source of truth.",
    technologies: ["Firebase Firestore", "SQLite", "PostgreSQL", "MongoDB"],
  },
  {
    id: "architecture",
    title: "SOFTWARE ARCHITECTURE",
    description:
      "Strict separation of concerns across Domain, Data, and Presentation layers, enabling isolated unit testing, predictable refactoring, and maintainability across both mobile and web.",
    technologies: ["Clean Architecture", "State Machines", "Repository Pattern", "Riverpod"],
  },
];

interface ServicesAccordionProps {
  projects?: Project[];
  skills?: Skill[];
  className?: string;
}

export function ServicesAccordion({ projects = [], className }: ServicesAccordionProps) {
  const [openId, setOpenId] = useState<string | null>("mobile");

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const findRelatedProjects = (techs: string[]) => {
    if (!projects || projects.length === 0) return [];
    const techLower = techs.map((t) => t.toLowerCase());
    return projects.filter((p) =>
      p.technologies?.some((t) =>
        techLower.some((tl) => t.name.toLowerCase().includes(tl) || tl.includes(t.name.toLowerCase()))
      )
    );
  };

  return (
    <section
      id="capabilities"
      className={cn("section section-offset bg-background relative overflow-hidden py-16 sm:py-24", className)}
      aria-labelledby="capabilities-heading"
    >
      <div className="container-narrow relative z-10 max-w-5xl mx-auto">
        {/* Section Header: Left Watermark Title (7-8% under card), Right Titles & Info (Bottom Aligned, Minimal Padding) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative mb-6 sm:mb-8">
          <div className="flex-1 relative z-0 translate-y-2 sm:translate-y-3 lg:translate-y-3.5 pt-2 sm:pt-3 pl-4 sm:pl-12">
            <span className="editorial-title-watermark text-4xl sm:text-6xl lg:text-7xl xl:text-8xl block">
              SERVICES
            </span>
          </div>

          <div className="flex-1 max-w-lg lg:self-end pb-2 sm:pb-2.5 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="eyebrow">CAPABILITIES</span>
              <div className="h-px w-12 bg-border" aria-hidden="true" />
            </div>
            <h2
              id="capabilities-heading"
              className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-foreground mb-2"
            >
              ENGINEERING SERVICES
            </h2>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Architectural specializations backed by shipped systems and production-ready codebases.
            </p>
          </div>
        </div>

        {/* WHITE CONTAINER FOR ENTIRE ACCORDION */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-[32px] sm:rounded-[40px] p-5 sm:p-12 shadow-sm divide-y divide-border/60">
          {CAPABILITIES.map((item) => {
            const isOpen = openId === item.id;
            const related = findRelatedProjects(item.technologies);

            return (
              <div key={item.id} className="py-5 sm:py-6 first:pt-2 last:pb-2">
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between text-left cursor-pointer outline-none group"
                >
                  <span className="font-display text-xl sm:text-3xl font-black tracking-tight text-foreground uppercase group-hover:text-[#FF5E36] transition-colors">
                    {item.title}
                  </span>

                  <div
                    className={cn(
                      "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all shrink-0",
                      isOpen
                        ? "bg-foreground text-background border-foreground"
                        : "bg-muted/70 text-foreground border-border hover:border-foreground/30"
                    )}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <div className="pt-4 sm:pt-5 pb-2">
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mb-5">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {item.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-xs font-mono rounded-full bg-muted/70 text-foreground border border-border/60"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {related.length > 0 && (
                          <div className="flex items-center gap-2 pt-2">
                            <span className="text-xs font-mono text-muted-foreground uppercase">
                              Shipped In:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {related.map((p) => (
                                <Link
                                  key={p.id || p.slug}
                                  href={p.slug ? `/projects/${p.slug}` : "/projects"}
                                  className="inline-flex items-center gap-1 text-xs font-mono text-foreground font-semibold hover:text-[#FF5E36] transition-colors underline underline-offset-4"
                                >
                                  <span>{p.title}</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
