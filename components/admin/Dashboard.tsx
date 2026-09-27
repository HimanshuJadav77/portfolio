"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Plus, FileText, Code, Briefcase, User, Settings, ChevronRight, ExternalLink, Pencil, AlertTriangle, Database } from "lucide-react";
import { cn, toDate } from "@/lib/utils/helpers";
import { Project, Skill, Experience, Profile } from "@/types";

interface AdminOverviewProps {
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  profile: Profile | null;
  isDbConnected?: boolean;
  missingVars?: string[];
}

const quickActions = [
  { label: "Projects", href: "/admin/projects", icon: FileText },
  { label: "Skills", href: "/admin/skills", icon: Code },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Profile", href: "/admin/profile", icon: User },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

function RowThumb({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const src = project.thumbnailUrl || project.heroImageUrl;
  if (!src || failed) {
    return (
      <span className="w-14 h-10 rounded border border-border bg-muted flex items-center justify-center font-mono text-[10px] text-muted-foreground shrink-0" aria-hidden="true">
        IMG
      </span>
    );
  }
  return (
    <span className="relative w-14 h-10 rounded border border-border bg-muted overflow-hidden shrink-0" aria-hidden="true">
      <Image src={src} alt="" fill sizes="56px" className="object-cover" onError={() => setFailed(true)} />
    </span>
  );
}

export function AdminOverview({ projects, skills, experience, profile, isDbConnected = true, missingVars = [] }: AdminOverviewProps) {
  const publishedCount = projects.filter((p) => p.published).length;
  const draftCount = projects.filter((p) => !p.published).length;
  const featuredCount = projects.filter((p) => p.featured).length;

  const metrics = [
    { label: "Projects", value: projects.length },
    { label: "Published", value: publishedCount },
    { label: "Drafts", value: draftCount },
    { label: "Featured", value: featuredCount },
  ];

  const recent = [...projects]
    .sort((a, b) => toDate(b.updatedAt).getTime() - toDate(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Database connection warning banner */}
      {!isDbConnected && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 backdrop-blur-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-amber-300">
                  Firebase Firestore Disconnected (Fallback Mode Active)
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Read Only
                </span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed max-w-3xl">
                The deployed application is missing Firebase Admin environment variables on your hosting provider. The dashboard is currently displaying static fallback data. To save projects, skills, or profile edits, add the missing environment variables to your hosting dashboard (e.g. Vercel Project Settings &gt; Environment Variables).
              </p>
              {missingVars && missingVars.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-amber-500/20 text-xs">
                  <span className="font-mono text-[11px] text-amber-300 font-semibold tracking-wider uppercase">
                    Missing Server Environment Variables:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {missingVars.map((v) => (
                      <span key={v} className="font-mono text-[11px] bg-amber-950/60 border border-amber-500/30 text-amber-200 px-2 py-0.5 rounded">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page title + primary action */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">ADMIN / OVERVIEW</p>
            <span className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px]",
              isDbConnected 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", isDbConnected ? "bg-emerald-400" : "bg-amber-400")} />
              {isDbConnected ? "Firestore Live" : "Fallback Mode"}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">Dashboard</h1>
        </div>
        <Link href="/admin/projects/new" className="btn-primary self-start sm:self-auto h-10 text-sm min-h-[44px]">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Create Project
        </Link>
      </div>

      {/* Compact metrics */}
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden" aria-label="Content metrics">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card px-5 py-4">
            <dt className="font-mono text-[11px] tracking-widest text-muted-foreground">{m.label.toUpperCase()}</dt>
            <dd className="font-display text-2xl font-medium text-foreground mt-0.5">{m.value}</dd>
          </div>
        ))}
      </dl>

      {/* Recent projects */}
      <section aria-labelledby="recent-projects-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="recent-projects-heading" className="font-display text-lg font-medium text-foreground">Recent Projects</h2>
          <Link href="/admin/projects" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 min-h-[44px]">
            VIEW ALL
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">No projects yet.</p>
            <Link href="/admin/projects/new" className="inline-flex items-center gap-1.5 text-sm font-mono text-primary hover:underline underline-offset-4 mt-3 min-h-[44px]">
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              CREATE YOUR FIRST PROJECT
            </Link>
          </div>
        ) : (
          <ul className="border border-border rounded-lg divide-y divide-border overflow-hidden bg-card">
            {recent.map((project) => (
              <li key={project.id}>
                <div className="flex items-center gap-4 px-4 sm:px-5 py-3.5 hover:bg-accent/50 transition-colors">
                  <RowThumb project={project} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{project.title}</p>
                    <p className="font-mono text-[11px] text-muted-foreground truncate mt-0.5">
                      {project.category?.toUpperCase()} · {project.slug}
                    </p>
                  </div>
                  <span className={cn(
                    "hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border shrink-0",
                    project.published
                      ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/5"
                      : "text-amber-500 border-amber-500/30 bg-amber-500/5"
                  )}>
                    {project.published ? "Published" : "Draft"}
                  </span>
                  {project.featured && (
                    <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border text-primary border-primary/30 bg-primary/5 shrink-0">
                      Featured
                    </span>
                  )}
                  <span className="hidden lg:block font-mono text-[11px] text-muted-foreground shrink-0">
                    {toDate(project.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Edit ${project.title}`}
                    >
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                    <a
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-md hidden sm:flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`View ${project.title} live`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="font-display text-lg font-medium text-foreground mb-3">Manage</h2>
          <ul className="border border-border rounded-lg divide-y divide-border overflow-hidden bg-card">
            {quickActions.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3.5 px-4 sm:px-5 py-3.5 hover:bg-accent/50 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset min-h-[44px]"
                >
                  <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" aria-hidden="true" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-foreground">{item.label}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Content summary */}
        <section aria-labelledby="content-summary-heading">
          <h2 id="content-summary-heading" className="font-display text-lg font-medium text-foreground mb-3">Summary</h2>
          <dl className="border border-border rounded-lg divide-y divide-border overflow-hidden bg-card">
            {[
              { label: "Skills", value: String(skills.length), href: "/admin/skills" },
              { label: "Experience entries", value: String(experience.length), href: "/admin/experience" },
              { label: "Social links", value: String(profile?.socialLinks.length || 0), href: "/admin/profile" },
              { label: "Resume", value: profile?.resumeUrl ? "Configured" : "Missing", href: "/admin/profile" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-4 sm:px-5 py-3.5">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd>
                  <Link href={row.href} className="font-mono text-xs text-foreground hover:text-primary transition-colors min-h-[44px] inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                    {row.value} →
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
