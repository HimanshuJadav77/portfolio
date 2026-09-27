"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type { Project } from "@/types";

interface TechStackProps {
  skills?: Array<{ id?: string; name: string; category?: string; featured?: boolean; relatedProjects?: string[] }>;
  projects?: Project[];
  className?: string;
}

const CATEGORY_ORDER = ["LANGUAGES", "FRONTEND", "BACKEND", "DATA", "MOBILE", "REAL-TIME", "CLOUD", "DEVOPS", "TOOLS", "OTHER"];

export function TechStack({ skills, projects, className }: TechStackProps) {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  // Group Firestore skill records by category — no hardcoded lists
  const techMatrix: Record<string, Array<{ name: string; relatedProjects?: string[] }>> =
    skills && skills.length > 0
      ? skills.reduce<Record<string, Array<{ name: string; relatedProjects?: string[] }>>>((acc, s) => {
          const cat = (s.category || 'other').toUpperCase();
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push({ name: s.name, relatedProjects: s.relatedProjects });
          return acc;
        }, {})
      : {};

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => techMatrix[c]),
    ...Object.keys(techMatrix).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  const hasSkills = orderedCategories.length > 0;

  const relatedFor = (techName: string, relatedIds?: string[]): Project[] => {
    if (!projects || projects.length === 0) return [];
    if (relatedIds && relatedIds.length > 0) {
      const byId = projects.filter((p) => p.id && relatedIds.includes(p.id));
      if (byId.length > 0) return byId.slice(0, 3);
    }
    // Fallback: match by technology name against project technologies
    const needle = techName.toLowerCase();
    return projects
      .filter((p) =>
        (p.technologies || []).some((t) => {
          const n = t.name.toLowerCase();
          return n.includes(needle) || needle.includes(n);
        })
      )
      .slice(0, 3);
  };

  const activeRelated = activeTech
    ? (() => {
        for (const cat of orderedCategories) {
          const found = techMatrix[cat].find((t) => t.name === activeTech);
          if (found) return relatedFor(found.name, found.relatedProjects);
        }
        return [];
      })()
    : [];

  return (
    <section
      id="technology"
      className={cn("section section-offset bg-background relative overflow-hidden", className)}
      aria-labelledby="tech-stack-heading"
    >
      {/* Background outline watermark */}
      <div
        className="watermark-heading absolute right-6 top-8 text-[15vw] leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        TECH
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-4xl mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">06 — TECHNOLOGY</span>
            <div className="h-px w-12 bg-border" aria-hidden="true" />
          </div>
          <h2 id="tech-stack-heading" className="font-display text-3xl sm:text-4xl font-light tracking-tight text-foreground mb-4">
            What I Use
          </h2>
          <p className="body text-muted-foreground max-w-2xl leading-relaxed">
            Live technology inventory. Select any tool to inspect associated shipped projects.
          </p>
        </motion.div>

        {!hasSkills ? (
          <p className="body text-muted-foreground">Skills will appear here once published.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {orderedCategories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.3), ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <p className="caption text-muted-foreground mb-4 pb-3 border-b border-border">
                  {category}
                </p>
                <ul className="space-y-1" role="list" aria-label={`${category} technologies`}>
                  {techMatrix[category].map((tech) => {
                    const isActive = activeTech === tech.name;
                    return (
                      <li key={tech.name} role="listitem">
                        <button
                          type="button"
                          onClick={() => setActiveTech(isActive ? null : tech.name)}
                          onMouseEnter={() => setActiveTech(tech.name)}
                          onMouseLeave={() => setActiveTech((prev) => (prev === tech.name ? null : prev))}
                          aria-expanded={isActive}
                          className={cn(
                            "font-display text-lg sm:text-xl font-light tracking-tight transition-all duration-150 outline-none rounded-sm min-h-[44px] text-left cursor-pointer",
                            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            isActive ? "text-primary translate-x-1" : "text-foreground/80 hover:text-foreground hover:translate-x-1"
                          )}
                        >
                          {tech.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>
        )}

        {/* Related work readout — real Firestore relations */}
        {activeTech && (
          <div className="mt-10 border-t border-border pt-6" aria-live="polite">
            <p className="font-mono text-[11px] tracking-widest text-muted-foreground mb-3">
              {activeTech.toUpperCase()} — SHIPS IN
            </p>
            {activeRelated.length > 0 ? (
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {activeRelated.map((p) => (
                  <li key={p.id || p.slug}>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors min-h-[44px]"
                    >
                      {p.title}
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="body-sm text-muted-foreground">No linked projects in the current records.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
