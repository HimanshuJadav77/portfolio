"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Briefcase, X, Loader2 } from "lucide-react";
import { Experience, ExperienceType } from "@/types/experience";
import { toDate } from "@/lib/utils/helpers";

interface ExperienceListProps {
  initialExperience: Experience[];
}

export function ExperienceList({ initialExperience }: ExperienceListProps) {
  const [experience, setExperience] = useState<Experience[]>(initialExperience);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "Remote",
    type: "full-time" as ExperienceType,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
    current: true,
    description: "",
    technologies: "",
    highlights: "",
    order: 1,
  });

  const handleOpenCreate = () => {
    setFormData({
      company: "",
      role: "",
      location: "Remote",
      type: "full-time",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      current: true,
      description: "",
      technologies: "",
      highlights: "",
      order: experience.length + 1,
    });
    setEditingExp(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    const startStr = exp.startDate ? toDate(exp.startDate).toISOString().slice(0, 10) : "";
    const endStr = exp.endDate ? toDate(exp.endDate).toISOString().slice(0, 10) : "";

    setFormData({
      company: exp.company,
      role: exp.role,
      location: exp.location || "Remote",
      type: exp.type || "full-time",
      startDate: startStr,
      endDate: endStr,
      current: Boolean(exp.current),
      description: exp.description || "",
      technologies: exp.technologies?.join(", ") || "",
      highlights: exp.highlights?.join("\n") || "",
      order: exp.order || 1,
    });
    setEditingExp(exp);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingId("saving");

    try {
      if (editingExp && editingExp.id) {
        // Update
        const res = await fetch(`/api/admin/experience/${editingExp.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to update experience");
        const data = await res.json();
        setExperience((prev) =>
          prev.map((item) => (item.id === editingExp.id ? { ...item, ...data.experience } : item))
        );
      } else {
        // Create
        const res = await fetch("/api/admin/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to create experience");
        const data = await res.json();
        setExperience((prev) => [...prev, data.experience]);
      }
      setIsCreating(false);
      setEditingExp(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, company: string) => {
    if (!confirm(`Are you sure you want to delete experience at "${company}"?`)) return;
    setLoadingId(id);

    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setExperience((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Failed to delete experience");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground mb-1.5">ADMIN / EXPERIENCE</p>
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">Experience</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {experience.length} {experience.length === 1 ? "position" : "positions"}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary self-start sm:self-auto h-10 text-sm min-h-[44px]"
          aria-label="Add new experience"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Position
        </button>
      </div>

      {/* Timeline list */}
      {experience.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <Briefcase className="w-7 h-7 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">No experience records found.</p>
          <button onClick={handleOpenCreate} className="btn-outline mt-4 h-10 text-sm min-h-[44px]">
            Add First Position
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />
          <ol className="relative space-y-0">
            {experience.map((exp) => (
              <li key={exp.id} className="relative pl-8 pb-2">
                <span className="absolute left-0 top-8 w-[11px] h-[11px] rounded-full bg-background border border-primary" aria-hidden="true" />
                <div className="py-5 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {exp.role} <span className="text-muted-foreground font-normal">@ {exp.company}</span>
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground mt-1">
                        {exp.startDate ? toDate(exp.startDate).getFullYear() : "—"}
                        {" — "}
                        {exp.current ? "PRESENT" : exp.endDate ? toDate(exp.endDate).getFullYear() : "—"}
                        {" · "}{exp.location}
                        {" · "}{exp.type?.toUpperCase()}
                        {exp.current && <span className="text-emerald-500"> · CURRENT</span>}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl line-clamp-2">{exp.description}</p>
                      )}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <p className="font-mono text-[11px] text-muted-foreground mt-2">
                          {exp.technologies.slice(0, 5).join(" · ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(exp)}
                        className="h-9 px-3 rounded-md text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={`Edit ${exp.role} at ${exp.company}`}
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        onClick={() => exp.id && handleDelete(exp.id, exp.company)}
                        disabled={loadingId === exp.id}
                        className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={`Delete ${exp.role} at ${exp.company}`}
                      >
                        {loadingId === exp.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Modal Dialog for Add / Edit Experience */}
      <AnimatePresence>
        {(isCreating || editingExp) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="bg-card rounded-lg max-w-2xl w-full p-6 border border-border relative my-8"
              role="dialog"
              aria-modal="true"
              aria-label={editingExp ? `Edit experience at ${editingExp.company}` : "New experience"}
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/30 mb-6">
                  <h2 className="font-display text-xl font-medium">
                    {editingExp ? `Edit Experience` : "New Experience"}
                  </h2>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingExp(null);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="exp-company" className="label-field">Company Name</label>
                    <input
                      id="exp-company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Acme Corp"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="exp-role" className="label-field">Role / Title</label>
                    <input
                      id="exp-role"
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="exp-location" className="label-field">Location</label>
                    <input
                      id="exp-location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Remote / Rajkot, India"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="exp-type" className="label-field">Employment Type</label>
                    <select
                      id="exp-type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ExperienceType })}
                      className="input-field bg-card"
                    >
                      <option value="full-time">Full-Time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="exp-start" className="label-field">Start Date</label>
                    <input
                      id="exp-start"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="exp-end" className="label-field">End Date</label>
                    <input
                      id="exp-end"
                      type="date"
                      disabled={formData.current}
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="input-field disabled:opacity-40"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="exp-current"
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="exp-current" className="text-sm font-medium cursor-pointer">
                    I currently work in this role
                  </label>
                </div>

                <div>
                  <label htmlFor="exp-desc" className="label-field">Role Overview</label>
                  <textarea
                    id="exp-desc"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Summary of responsibilities and systems engineered..."
                    className="input-field py-2"
                  />
                </div>

                <div>
                  <label htmlFor="exp-highlights" className="label-field">
                    Key Highlights (One per line)
                  </label>
                  <textarea
                    id="exp-highlights"
                    rows={3}
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    placeholder="• Designed scalable messaging protocol&#10;• Reduced latency by 40%&#10;• Mentored 4 engineers"
                    className="input-field py-2"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="exp-tech" className="label-field">Technologies (comma-separated)</label>
                    <input
                      id="exp-tech"
                      type="text"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="e.g. Flutter, Go, Docker, WebSockets"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="exp-order" className="label-field">Display Order</label>
                    <input
                      id="exp-order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border/30">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingExp(null);
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
                      "Save Position"
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
