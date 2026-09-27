"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, Globe, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { cn, toDate } from "@/lib/utils/helpers";
import { Project } from "@/types";
import { TechnicalXRay } from "./TechnicalXRay";

interface CaseStudyProps {
  project: Project;
  nextProject?: Project | null;
}

export function CaseStudy({ project, nextProject }: CaseStudyProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const hasProblem = Boolean(project.problem?.trim());
  const hasApproach = Boolean(project.solution?.trim() || project.architecture?.trim());
  const hasEngineering = project.challenges && project.challenges.length > 0;
  const hasMetrics = project.metrics && project.metrics.length > 0;
  const hasResults = project.results && project.results.length > 0;

  const sectionConfig = [
    { id: "overview", label: "OVERVIEW" },
    ...(hasProblem ? [{ id: "problem", label: "THE CHALLENGE" }] : []),
    ...(hasApproach ? [{ id: "architecture", label: "ARCHITECTURE" }] : []),
    ...(hasEngineering ? [{ id: "engineering", label: "ENGINEERING" }] : []),
    ...(hasMetrics || hasResults ? [{ id: "metrics", label: "OUTCOMES" }] : []),
    { id: "stack", label: "STACK" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-25% 0px -55% 0px" }
    );

    sectionConfig.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionConfig]);

  const year = (() => {
    try {
      return toDate(project.createdAt).getFullYear();
    } catch {
      return null;
    }
  })();

  const meta = [
    { label: "CATEGORY", value: (project.category || "SYSTEM").toUpperCase() },
    { label: "PRIMARY STACK", value: project.technologies.slice(0, 3).map((t) => t.name).join(" · ") || "—" },
    { label: "STATUS", value: project.published ? "SHIPPED & VERIFIED" : "DRAFT" },
    ...(year ? [{ label: "TIMELINE", value: String(year) }] : []),
  ];

  const hasImage = Boolean(project.heroImageUrl || project.thumbnailUrl);
  const heroImage = project.heroImageUrl || project.thumbnailUrl;

  return (
    <article className="min-h-screen bg-background relative overflow-hidden pb-24" aria-labelledby="project-title">
      <div className="container-narrow relative z-10 max-w-5xl mx-auto pt-6 sm:pt-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full bg-card border border-border/80 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK TO SELECTED WORK</span>
          </Link>
        </div>

        {/* Title & Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">CASE STUDY & ARCHITECTURE</span>
            <div className="h-px w-12 bg-border" aria-hidden="true" />
          </div>

          <h1
            id="project-title"
            className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-foreground leading-[0.95] max-w-4xl"
          >
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mt-5 leading-relaxed">
            {project.shortDescription || project.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-xs"
              >
                <GithubIcon className="w-4 h-4" />
                <span>VIEW REPOSITORY</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border/80 text-foreground font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground/40 transition-colors shadow-xs"
              >
                <Globe className="w-4 h-4" />
                <span>LIVE SYSTEM</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Hero Visual Card */}
        {hasImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-card border border-border/80 shadow-xl mb-10 sm:mb-12"
          >
            <Image
              src={heroImage}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </motion.div>
        )}

        {/* Project Meta Bar */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-xs mb-12 sm:mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {meta.map((m) => (
              <div key={m.label}>
                <span className="font-mono text-[11px] font-bold tracking-widest text-muted-foreground block mb-1">
                  {m.label}
                </span>
                <span className="text-sm sm:text-base font-semibold text-foreground block">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Layout: Sidebar Navigation + Content Sections */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-[32px] sm:rounded-[40px] p-8 sm:p-14 shadow-sm grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Desktop Sticky Sub-Navigation */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="sticky top-28 space-y-1 bg-card border border-border/80 rounded-2xl p-3 shadow-xs" aria-label="Section navigation">
              {sectionConfig.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    "block px-3 py-2 rounded-lg font-mono text-xs font-semibold tracking-wider transition-colors",
                    activeSection === section.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Case Study Content */}
          <div className="lg:col-span-9 space-y-12 sm:space-y-16">
            {/* Overview / Description */}
            <section id="overview" className="scroll-mt-28">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                OVERVIEW
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-foreground mb-4">
                SYSTEM SUMMARY
              </h2>
              <div className="text-muted-foreground text-base sm:text-lg leading-relaxed space-y-4">
                <p>{project.description}</p>
              </div>
            </section>

            {/* Problem Statement */}
            {hasProblem && (
              <section id="problem" className="scroll-mt-28 pt-8 border-t border-border/80">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  THE CHALLENGE
                </span>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-foreground mb-4">
                  PROBLEM SOLVED
                </h2>
                <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xs">
                  <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
                    &ldquo;{project.problem}&rdquo;
                  </p>
                </div>
              </section>
            )}

            {/* Architecture / Solution */}
            {hasApproach && (
              <section id="architecture" className="scroll-mt-28 pt-8 border-t border-border/80">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  SYSTEM DESIGN
                </span>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-foreground mb-4">
                  HOW IT WAS BUILT
                </h2>
                {project.solution && (
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                    {project.solution}
                  </p>
                )}
                {project.architecture && (
                  <div className="mt-6">
                    <TechnicalXRay architecture={project.architecture} />
                  </div>
                )}
              </section>
            )}

            {/* Engineering Challenges */}
            {hasEngineering && (
              <section id="engineering" className="scroll-mt-28 pt-8 border-t border-border/80">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  ENGINEERING
                </span>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-foreground mb-6">
                  TECHNICAL CHALLENGES
                </h2>
                <div className="space-y-4">
                  {project.challenges.map((c, i) => (
                    <div key={i} className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs">
                      <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-foreground mb-2">
                        {c.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Metrics & Results */}
            {(hasMetrics || hasResults) && (
              <section id="metrics" className="scroll-mt-28 pt-8 border-t border-border/80">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  OUTCOMES
                </span>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-foreground mb-6">
                  MEASURED IMPACT
                </h2>

                {/* Metrics Numbers */}
                {hasMetrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {project.metrics.map((m, i) => (
                      <div key={i} className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs text-center">
                        <span className="font-display text-3xl sm:text-4xl font-black text-foreground block tracking-tight">
                          {m.value}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block mt-1">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Results List */}
                {hasResults && (
                  <div className="space-y-3">
                    {project.results.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/80">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm sm:text-base text-foreground">
                            {r.title}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            {r.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Tech Stack Chips */}
            <section id="stack" className="scroll-mt-28 pt-8 border-t border-border/80">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                TECHNOLOGY MATRIX
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-foreground mb-5">
                STACK & DEPENDENCIES
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {project.technologies.map((t) => (
                  <span
                    key={t.name}
                    className="px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider bg-card text-foreground border border-border/80 shadow-xs"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Next Project Recommendation Footer */}
        {nextProject && (
          <div className="mt-16 sm:mt-24 pt-10 border-t border-border/80">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-3">
              NEXT SYSTEM
            </span>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group block p-8 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                    {nextProject.category}
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-4xl uppercase text-foreground tracking-tight group-hover:text-[#FF5E36] transition-colors">
                    {nextProject.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xl line-clamp-1">
                    {nextProject.shortDescription}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
