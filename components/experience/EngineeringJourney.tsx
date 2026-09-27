"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn, toDate } from "@/lib/utils/helpers";
import { Experience } from "@/types";

interface EngineeringJourneyProps {
  experience: Experience[];
  className?: string;
}

function formatRange(exp: Experience): string {
  const start = toDate(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const end = exp.current
    ? "Present"
    : exp.endDate
      ? toDate(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "—";
  return `${start} — ${end}`;
}

export function EngineeringJourney({ experience, className }: EngineeringJourneyProps) {
  const sortedExperience = [...experience].sort((a, b) => a.order - b.order);
  const [openId, setOpenId] = useState<string | null>(sortedExperience[0]?.id || sortedExperience[0]?.company || null);

  if (sortedExperience.length === 0) {
    return (
      <section id="journey" className={cn("section section-offset bg-background", className)} aria-labelledby="journey-heading">
        <div className="container-narrow">
          <p className="eyebrow mb-4">07 — JOURNEY</p>
          <h2 id="journey-heading" className="heading-2 font-light mb-4">Journey</h2>
          <p className="body text-muted-foreground">Experience will appear here once published.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="journey"
      className={cn("section section-offset bg-background relative overflow-hidden", className)}
      aria-labelledby="journey-heading"
    >
      {/* Background outline watermark */}
      <div
        className="watermark-heading absolute left-6 top-8 text-[15vw] leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        JOURNEY
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">07 — JOURNEY</span>
            <div className="h-px w-12 bg-border" aria-hidden="true" />
          </div>
          <h2 id="journey-heading" className="font-display text-3xl sm:text-4xl font-light tracking-tight text-foreground mb-4">
            Engineering Timeline
          </h2>
          <p className="body text-muted-foreground leading-relaxed">
            Progression across degrees, production applications, and freelance feature delivery.
          </p>
        </motion.div>

        <div className="relative max-w-4xl">
          {/* Progress line */}
          <motion.div
            className="absolute left-[5px] top-2 bottom-2 w-px bg-border"
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            style={{ originY: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          <ol className="relative">
            {sortedExperience.map((exp, index) => {
              const key = exp.id || exp.company;
              const isOpen = openId === key;
              return (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.3), ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative pl-8 pb-2"
                >
                  <span
                    className={cn(
                      "absolute left-0 top-8 w-[11px] h-[11px] rounded-full border bg-background transition-colors",
                      isOpen ? "border-primary" : "border-border-hover"
                    )}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : key)}
                    aria-expanded={isOpen}
                    className="w-full text-left py-5 border-b border-border outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm cursor-pointer group min-h-[44px]"
                  >
                    <span className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <span>
                        <span className="block font-mono text-[11px] tracking-widest text-muted-foreground mb-1">
                          {toDate(exp.startDate).getFullYear()}{exp.current ? " — PRESENT" : ""}
                        </span>
                        <span className={cn(
                          "block font-display text-lg sm:text-xl font-normal tracking-tight transition-transform duration-200",
                          isOpen ? "text-foreground translate-x-1" : "text-foreground/90 group-hover:translate-x-1 group-hover:text-foreground"
                        )}>
                          {exp.role} · {exp.company}
                        </span>
                      </span>
                      <span className="font-mono text-[11px] tracking-wide text-muted-foreground shrink-0">
                        {formatRange(exp)}
                      </span>
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-7 pt-1 max-w-2xl">
                      <p className="body-sm text-muted-foreground leading-relaxed mb-4">{exp.description}</p>
                      {exp.highlights.length > 0 && (
                        <ul className="space-y-1.5 mb-4" aria-label="Highlights">
                          {exp.highlights.map((h, hIndex) => (
                            <li key={hIndex} className="flex items-start gap-2.5 body-sm text-foreground/90">
                              <span className="text-primary mt-0.5" aria-hidden="true">→</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {exp.technologies.length > 0 && (
                        <p className="font-mono text-[11px] tracking-wide text-muted-foreground" aria-label="Technologies">
                          {exp.technologies.join(" · ")}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
