"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  order?: number;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "focus",
    question: "What kind of software systems do you specialize in?",
    answer:
      "I specialize in high-throughput mobile applications and distributed backend architectures. My core focus centers on Flutter & Dart client development, Node.js microservices, low-latency socket communication (Socket.IO and raw TCP), and resilient local-first data caching.",
  },
  {
    id: "offline",
    question: "How do you achieve offline-first data reliability?",
    answer:
      "I implement local-first architectures where user interactions commit immediately to a local SQLite schema. A background synchronization manager monitors network connectivity, queues mutation payloads, and streams them over Socket.IO or REST endpoints with automatic deduplication upon reconnection.",
  },
  {
    id: "architecture",
    question: "What architecture patterns do you follow for production apps?",
    answer:
      "I adhere to Clean Architecture with strict layer boundaries between Domain (pure business logic), Data (repositories and data sources), and Presentation (UI). For state management, I utilize Riverpod to create immutable, testable, and reactive state flows.",
  },
  {
    id: "availability",
    question: "Are you available for full-time engineering roles or contracts?",
    answer:
      "Yes. I am actively open to full-time Software Engineering roles, high-impact backend/mobile developer positions, and selective freelance contracts. I am ready to contribute immediately to production software teams.",
  },
  {
    id: "source",
    question: "Can I review your source code and technical architecture?",
    answer:
      "All public project repositories are accessible on my GitHub (github.com/HimanshuJadav77). Each project contains comprehensive README documentation, architectural data-flow diagrams, and setup instructions.",
  },
];

interface FAQAccordionProps {
  faqs?: FAQItem[];
  className?: string;
}

export function FAQAccordion({ faqs = [], className }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>("focus");

  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className={cn("section section-offset bg-background relative overflow-hidden", className)}
      aria-labelledby="faq-heading"
    >
      <div className="container-narrow relative z-10 max-w-5xl mx-auto">
        {/* Section Header: Left Watermark Title (7-8% under card), Right Titles & Info (Bottom Aligned, Minimal Padding) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative mb-6 sm:mb-8">
          <div className="flex-1 relative z-0 translate-y-2 sm:translate-y-3 lg:translate-y-3.5 pt-2 sm:pt-3 pl-4 sm:pl-12">
            <span className="editorial-title-watermark text-4xl sm:text-6xl lg:text-7xl xl:text-8xl block">
              QUESTIONS
            </span>
          </div>

          <div className="flex-1 max-w-lg lg:self-end pb-2 sm:pb-2.5 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="eyebrow">FREQUENTLY ASKED</span>
              <div className="h-px w-12 bg-border" aria-hidden="true" />
            </div>
            <h2
              id="faq-heading"
              className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-foreground mb-2"
            >
              QUESTIONS &amp; ANSWERS
            </h2>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Common inquiries regarding technical specialization, system design principles, and availability.
            </p>
          </div>
        </div>

        {/* Tactile Accordion Cards */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-[32px] sm:rounded-[40px] p-5 sm:p-12 shadow-sm flex flex-col gap-3 sm:gap-4">
          {items.map((item, index) => {
            const itemId = item.id || `faq-${index}`;
            const isOpen = openId === itemId;

            return (
              <div
                key={itemId}
                className={cn(
                  "bg-card border rounded-2xl transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "border-primary/50 shadow-md ring-1 ring-primary/20"
                    : "border-border hover:border-border-hover shadow-xs"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(itemId)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <span className="font-display text-base sm:text-xl font-medium tracking-tight text-foreground pr-4">
                    {item.question}
                  </span>

                  <div
                    className={cn(
                      "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-colors shrink-0",
                      isOpen
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground hover:border-border-hover"
                    )}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
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
                      <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-border/50">
                        <p className="body-sm text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
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