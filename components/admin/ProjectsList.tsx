"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, Eye, Star, ArrowUp, ArrowDown,
  X, Loader2, SlidersHorizontal
} from "lucide-react";
import { cn, toDate } from "@/lib/utils/helpers";
import { Project, Skill } from "@/types";

interface AdminProjectsListProps {
  projects: Project[];
  skills?: Skill[];
}

function ProjectThumb({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const src = project.thumbnailUrl || project.heroImageUrl;
  if (!src || failed) {
    return (
      <span className="w-16 h-11 rounded border border-border bg-muted flex items-center justify-center font-mono text-[10px] text-muted-foreground shrink-0" aria-hidden="true">
        IMG
      </span>
    );
  }
  return (
    <span className="relative w-16 h-11 rounded border border-border bg-muted overflow-hidden shrink-0" aria-hidden="true">
      <Image src={src} alt="" fill sizes="64px" className="object-cover" onError={() => setFailed(true)} />
    </span>
  );
}

export function AdminProjectsList({ projects: initialProjects }: AdminProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [quickEditProject, setQuickEditProject] = useState<Project | null>(null);
  const [savingQuick, setSavingQuick] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Quick Edit Form State
  const [quickForm, setQuickForm] = useState({
    title: "",
    category: "",
    shortDescription: "",
    order: 1,
    featured: false,
    published: true,
    liveUrl: "",
    githubUrl: "",
  });

  const categories = [
    "ALL",
    "MOBILE",
    "BACKEND",
    "REAL-TIME",
    "INFRASTRUCTURE",
    "BUSINESS SYSTEM",
    "FULLSTACK",
    "WEB",
    "OTHER",
  ];

  // Filter projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || (statusFilter === "published" ? project.published : !project.published);
      const matchesCategory =
        categoryFilter === "ALL" || project.category?.toUpperCase() === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleOpenQuickEdit = (project: Project) => {
    setQuickForm({
      title: project.title,
      category: project.category || "BACKEND",
      shortDescription: project.shortDescription || "",
      order: project.order || 1,
      featured: Boolean(project.featured),
      published: Boolean(project.published),
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
    });
    setQuickEditProject(project);
    setQuickError(null);
  };

  const handleSaveQuickEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEditProject || !quickEditProject.id) return;
    setSavingQuick(true);
    setQuickError(null);

    try {
      const res = await fetch(`/api/admin/projects/${quickEditProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: quickForm.title,
          category: quickForm.category.toUpperCase(),
          shortDescription: quickForm.shortDescription,
          order: Number(quickForm.order),
          featured: quickForm.featured,
          published: quickForm.published,
          liveUrl: quickForm.liveUrl,
          githubUrl: quickForm.githubUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to update project");
      const data = await res.json();

      setProjects((prev) =>
        prev
          .map((p) => (p.id === quickEditProject.id ? { ...p, ...data } : p))
          .sort((a, b) => (a.order || 0) - (b.order || 0))
      );

      setQuickEditProject(null);
    } catch (err) {
      setQuickError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingQuick(false);
    }
  };

  const handleDelete = async (projectId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setLoadingId(projectId);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch {
      alert("Failed to delete project");
    } finally {
      setLoadingId(null);
    }
  };

  const handleTogglePublish = async (project: Project) => {
    if (!project.id) return;
    const nextPublished = !project.published;

    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, published: nextPublished } : p))
    );

    try {
      await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextPublished }),
      });
    } catch {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: !nextPublished } : p))
      );
    }
  };

  const handleToggleFeature = async (project: Project) => {
    if (!project.id) return;
    const nextFeatured = !project.featured;

    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, featured: nextFeatured } : p))
    );

    try {
      await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: nextFeatured }),
      });
    } catch {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: !nextFeatured } : p))
      );
    }
  };

  const handleReorder = async (projectId: string, direction: "up" | "down") => {
    const index = projects.findIndex((p) => p.id === projectId);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const current = projects[index];
    const target = projects[targetIndex];

    const currentOrder = current.order || index + 1;
    const targetOrder = target.order || targetIndex + 1;

    // Swap in state
    const nextProjects = [...projects];
    nextProjects[index] = { ...current, order: targetOrder };
    nextProjects[targetIndex] = { ...target, order: currentOrder };
    setProjects(nextProjects.sort((a, b) => (a.order || 0) - (b.order || 0)));

    try {
      await Promise.all([
        fetch(`/api/admin/projects/${current.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: targetOrder }),
        }),
        fetch(`/api/admin/projects/${target.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentOrder }),
        }),
      ]);
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground mb-1.5">ADMIN / PROJECTS</p>
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredProjects.length} of {projects.length} projects
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary self-start sm:self-auto h-10 text-sm min-h-[44px]">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Create Project
        </Link>
      </div>

      {/* Controls */}
      <div className="border border-border rounded-lg bg-card">
        <div className="flex flex-col md:flex-row gap-3 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by title, slug, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 h-11"
              aria-label="Search projects"
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="project-status-filter" className="sr-only">Filter by publication status</label>
            <select
              id="project-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "published" | "draft")}
              className="input-field h-11 bg-card w-36 text-sm min-h-[44px]"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Category filter row */}
        <div className="flex gap-5 px-4 pb-1 overflow-x-auto border-t border-border" role="tablist" aria-label="Filter by category">
          {categories.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                role="tab"
                aria-selected={active}
                className={cn(
                  "relative shrink-0 font-mono text-[11px] tracking-widest py-3 transition-colors cursor-pointer outline-none min-h-[44px]",
                  "focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
                <span className={cn("absolute bottom-1.5 left-0 h-px bg-primary transition-transform duration-200 origin-left w-full", active ? "scale-x-100" : "scale-x-0")} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Content table / rows */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <Search className="w-7 h-7 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">No projects match the selected criteria.</p>
          <Link href="/admin/projects/new" className="btn-outline mt-4 inline-flex h-10 text-sm min-h-[44px]">
            Create New Project
          </Link>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          {/* Column headers (desktop) */}
          <div className="hidden md:grid grid-cols-[1fr_110px_90px_130px_150px] gap-4 px-5 py-2.5 border-b border-border bg-muted/40 font-mono text-[11px] tracking-widest text-muted-foreground" aria-hidden="true">
            <span>PROJECT</span>
            <span>STATUS</span>
            <span>ORDER</span>
            <span>UPDATED</span>
            <span className="text-right">ACTIONS</span>
          </div>
          <ul className="divide-y divide-border">
            {filteredProjects.map((project, index) => (
              <li key={project.id} className="hover:bg-accent/40 transition-colors">
                <div className="flex items-center gap-3.5 px-4 sm:px-5 py-3.5">
                  <ProjectThumb project={project} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-sm font-medium text-foreground truncate">{project.title}</p>
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(project)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-primary hover:underline underline-offset-2 cursor-pointer min-h-[24px]"
                        title={project.featured ? "Remove from featured" : "Mark as featured"}
                        aria-pressed={project.featured}
                      >
                        <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                        {project.featured ? "FEATURED" : "FEATURE"}
                      </button>
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground truncate mt-0.5">
                      {project.category?.toUpperCase()} · /{project.slug}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(project)}
                    className={cn(
                      "hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border transition-colors cursor-pointer min-h-[32px]",
                      project.published
                        ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/5"
                        : "text-amber-500 border-amber-500/30 bg-amber-500/5"
                    )}
                    title="Toggle published state"
                  >
                    {project.published ? "Published" : "Draft"}
                  </button>

                  <span className="hidden md:flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => project.id && handleReorder(project.id, "up")}
                      disabled={index === 0}
                      className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-25 transition-colors"
                      aria-label={`Move ${project.title} up`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="font-mono text-xs text-foreground w-6 text-center">{project.order || index + 1}</span>
                    <button
                      type="button"
                      onClick={() => project.id && handleReorder(project.id, "down")}
                      disabled={index === filteredProjects.length - 1}
                      className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-25 transition-colors"
                      aria-label={`Move ${project.title} down`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </span>

                  <span className="hidden lg:block font-mono text-[11px] text-muted-foreground w-[110px] shrink-0">
                    {toDate(project.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenQuickEdit(project)}
                      className="h-9 px-2.5 rounded-md text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      title="Quick edit"
                    >
                      QUICK
                    </button>
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      title="Full editor"
                      aria-label={`Edit ${project.title}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-md hidden sm:flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      title="View live case study"
                      aria-label={`View ${project.title} live`}
                    >
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => project.id && handleDelete(project.id, project.title)}
                      disabled={loadingId === project.id}
                      className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Delete ${project.title}`}
                    >
                      {loadingId === project.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Update Modal */}
      <AnimatePresence>
        {quickEditProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="bg-card rounded-lg max-w-xl w-full p-6 border border-border relative my-8"
              role="dialog"
              aria-modal="true"
              aria-label={`Quick update ${quickEditProject.title}`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
                <div>
                  <h2 className="font-display text-lg font-medium text-foreground">Quick Update</h2>
                  <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                    {quickEditProject.slug}
                  </p>
                </div>
                <button
                  onClick={() => setQuickEditProject(null)}
                  className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-accent text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {quickError && (
                <div className="px-4 py-3 mb-4 rounded-md bg-red-500/10 border border-red-500/30 text-red-500 text-sm" role="alert">
                  {quickError}
                </div>
              )}

              <form onSubmit={handleSaveQuickEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="q-title" className="label-field">Project Title</label>
                    <input
                      id="q-title"
                      type="text"
                      required
                      value={quickForm.title}
                      onChange={(e) => setQuickForm({ ...quickForm, title: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="q-category" className="label-field">Category</label>
                    <input
                      id="q-category"
                      type="text"
                      required
                      value={quickForm.category}
                      onChange={(e) => setQuickForm({ ...quickForm, category: e.target.value })}
                      placeholder="e.g. INFRASTRUCTURE, MOBILE"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="q-desc" className="label-field">Short Description</label>
                  <textarea
                    id="q-desc"
                    rows={2}
                    value={quickForm.shortDescription}
                    onChange={(e) => setQuickForm({ ...quickForm, shortDescription: e.target.value })}
                    className="input-field py-2"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="q-live" className="label-field">Live Demo URL</label>
                    <input
                      id="q-live"
                      type="url"
                      value={quickForm.liveUrl}
                      onChange={(e) => setQuickForm({ ...quickForm, liveUrl: e.target.value })}
                      placeholder="https://..."
                      className="input-field text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="q-github" className="label-field">GitHub Repo URL</label>
                    <input
                      id="q-github"
                      type="url"
                      value={quickForm.githubUrl}
                      onChange={(e) => setQuickForm({ ...quickForm, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="input-field text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="q-order" className="label-field">Display Order</label>
                    <input
                      id="q-order"
                      type="number"
                      value={quickForm.order}
                      onChange={(e) => setQuickForm({ ...quickForm, order: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      id="q-published"
                      type="checkbox"
                      checked={quickForm.published}
                      onChange={(e) => setQuickForm({ ...quickForm, published: e.target.checked })}
                      className="w-4 h-4 rounded border-border text-primary"
                    />
                    <label htmlFor="q-published" className="text-xs font-medium cursor-pointer">
                      Published
                    </label>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      id="q-featured"
                      type="checkbox"
                      checked={quickForm.featured}
                      onChange={(e) => setQuickForm({ ...quickForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-border text-primary"
                    />
                    <label htmlFor="q-featured" className="text-xs font-medium cursor-pointer">
                      Featured
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-border">
                  <Link
                    href={`/admin/projects/${quickEditProject.id}/edit`}
                    className="text-xs text-primary hover:underline underline-offset-4 flex items-center gap-1 min-h-[44px]"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                    Open full editor →
                  </Link>

                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setQuickEditProject(null)}
                      className="btn-ghost min-h-[44px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingQuick}
                      className="btn-primary min-h-[44px]"
                    >
                      {savingQuick ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
