"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { Skill, SkillCategory } from "@/types/skill";
import { cn } from "@/lib/utils/helpers";

interface SkillsListProps {
  initialSkills: Skill[];
}

const CATEGORIES: { label: string; value: SkillCategory | "all" }[] = [
  { label: "ALL", value: "all" },
  { label: "LANGUAGES", value: "languages" },
  { label: "FRONTEND", value: "frontend" },
  { label: "BACKEND", value: "backend" },
  { label: "DATABASE", value: "database" },
  { label: "REAL-TIME", value: "realtime" },
  { label: "CLOUD", value: "cloud" },
  { label: "DEVOPS", value: "devops" },
  { label: "TOOLS", value: "tools" },
];

export function SkillsList({ initialSkills }: SkillsListProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "all">("all");
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state for Modal
  const [formData, setFormData] = useState({
    name: "",
    category: "languages" as SkillCategory,
    icon: "⚡",
    proficiency: 5,
    featured: true,
    order: 1,
  });

  const filteredSkills = skills.filter((s) => {
    const matchesCat = activeCategory === "all" || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      category: activeCategory === "all" ? "languages" : activeCategory,
      icon: "⚡",
      proficiency: 5,
      featured: true,
      order: skills.length + 1,
    });
    setEditingSkill(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || "⚡",
      proficiency: skill.proficiency || 5,
      featured: Boolean(skill.featured),
      order: skill.order || 1,
    });
    setEditingSkill(skill);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingId("saving");

    try {
      if (editingSkill && editingSkill.id) {
        // Update
        const res = await fetch(`/api/admin/skills/${editingSkill.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to update skill");
        const data = await res.json();
        setSkills((prev) =>
          prev.map((s) => (s.id === editingSkill.id ? { ...s, ...data.skill } : s))
        );
      } else {
        // Create
        const res = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to create skill");
        const data = await res.json();
        setSkills((prev) => [...prev, data.skill]);
      }
      setIsCreating(false);
      setEditingSkill(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setLoadingId(id);

    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete skill");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleFeatured = async (skill: Skill) => {
    if (!skill.id) return;
    const nextFeatured = !skill.featured;

    // Optimistic update
    setSkills((prev) =>
      prev.map((s) => (s.id === skill.id ? { ...s, featured: nextFeatured } : s))
    );

    try {
      await fetch(`/api/admin/skills/${skill.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: nextFeatured }),
      });
    } catch {
      // Revert
      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, featured: !nextFeatured } : s))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground mb-1.5">ADMIN / SKILLS</p>
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">Skills</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredSkills.length} of {skills.length} skills
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary self-start sm:self-auto h-10 text-sm min-h-[44px]"
          aria-label="Add new skill"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Skill
        </button>
      </div>

      {/* Controls */}
      <div className="border border-border rounded-lg bg-card">
        <div className="flex flex-col md:flex-row gap-3 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search skills by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 h-11"
              aria-label="Search skills"
            />
          </div>
        </div>

        {/* Category row */}
        <div className="flex gap-5 px-4 overflow-x-auto border-t border-border" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                role="tab"
                aria-selected={active}
                className={cn(
                  "relative shrink-0 font-mono text-[11px] tracking-widest py-3 transition-colors cursor-pointer outline-none min-h-[44px]",
                  "focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.label}
                <span className={cn("absolute bottom-1.5 left-0 h-px bg-primary transition-transform duration-200 origin-left w-full", active ? "scale-x-100" : "scale-x-0")} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills table */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <Search className="w-7 h-7 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">No skills found matching this criteria.</p>
          <button onClick={handleOpenCreate} className="btn-outline mt-4 h-10 text-sm min-h-[44px]">
            Add First Skill
          </button>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="hidden sm:grid grid-cols-[1fr_130px_80px_110px_110px] gap-4 px-5 py-2.5 border-b border-border bg-muted/40 font-mono text-[11px] tracking-widest text-muted-foreground" aria-hidden="true">
            <span>SKILL</span>
            <span>CATEGORY</span>
            <span>ORDER</span>
            <span>VISIBILITY</span>
            <span className="text-right">ACTIONS</span>
          </div>
          <ul className="divide-y divide-border">
            {filteredSkills.map((skill) => (
              <li key={skill.id} className="hover:bg-accent/40 transition-colors">
                <div className="flex items-center gap-3 px-4 sm:px-5 py-3">
                  <span className="text-lg shrink-0" aria-hidden="true">{skill.icon || "⚡"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{skill.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground sm:hidden mt-0.5">
                      {skill.category?.toUpperCase()} · ORDER {skill.order} · {skill.featured ? "VISIBLE" : "HIDDEN"}
                    </p>
                  </div>
                  <span className="hidden sm:block font-mono text-[11px] text-muted-foreground w-[130px] shrink-0 uppercase">
                    {skill.category}
                  </span>
                  <span className="hidden sm:block font-mono text-xs text-foreground w-[80px] shrink-0">
                    {skill.order}
                  </span>
                  <span className="hidden sm:block w-[110px] shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(skill)}
                      className={cn(
                        "font-mono text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer min-h-[32px]",
                        skill.featured
                          ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/5"
                          : "text-muted-foreground border-border bg-muted/40"
                      )}
                      title={skill.featured ? "Visible on site" : "Hidden from site"}
                      aria-label={`Toggle visibility for ${skill.name}`}
                      aria-pressed={skill.featured}
                    >
                      {skill.featured ? "Visible" : "Hidden"}
                    </button>
                  </span>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(skill)}
                      className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Edit ${skill.name}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => skill.id && handleDelete(skill.id, skill.name)}
                      disabled={loadingId === skill.id}
                      className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Delete ${skill.name}`}
                    >
                      {loadingId === skill.id ? (
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

      {/* Modal Dialog for Add / Edit Skill */}
      <AnimatePresence>
        {(isCreating || editingSkill) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="bg-card rounded-lg max-w-md w-full p-6 border border-border relative"
              role="dialog"
              aria-modal="true"
              aria-label={editingSkill ? `Edit ${editingSkill.name}` : "Add new skill"}
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/30 mb-6">
                <h2 className="font-display text-xl font-medium">
                  {editingSkill ? `Edit ${editingSkill.name}` : "New Skill"}
                </h2>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingSkill(null);
                  }}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="p-3 mb-4 rounded-lg bg-error/10 text-error text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label htmlFor="skill-name" className="label-field">Skill Name</label>
                  <input
                    id="skill-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Flutter, Rust, Kubernetes"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="skill-cat" className="label-field">Category</label>
                    <select
                      id="skill-cat"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillCategory })}
                      className="input-field bg-card"
                    >
                      <option value="languages">Languages</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="realtime">Real-Time</option>
                      <option value="cloud">Cloud</option>
                      <option value="devops">DevOps</option>
                      <option value="tools">Tools</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="skill-icon" className="label-field">Icon (Emoji/Glyph)</label>
                    <input
                      id="skill-icon"
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="e.g. 🦀, ⚡, 📱"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="skill-prof" className="label-field">Proficiency (1-5)</label>
                    <input
                      id="skill-prof"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.proficiency}
                      onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="skill-order" className="label-field">Order Index</label>
                    <input
                      id="skill-order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    id="skill-featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="skill-featured" className="text-sm font-medium cursor-pointer">
                    Featured (Display on homepage matrix)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingSkill(null);
                    }}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingId === "saving"}
                    className="btn-primary"
                  >
                    {loadingId === "saving" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Skill"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
