"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Save, Plus, Trash2, Check, AlertCircle, Loader2, Link2, ExternalLink } from "lucide-react";
import { Profile, SocialLink } from "@/types/profile";

interface ProfileFormProps {
  initialProfile: Profile | null;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: initialProfile?.name || "Himanshu Jadav",
    role: initialProfile?.role || "Software Engineer",
    bio: initialProfile?.bio || "I build software that connects people, devices, and systems.",
    location: initialProfile?.location || "Rajkot, India",
    avatarUrl: initialProfile?.avatarUrl || "",
    resumeUrl: initialProfile?.resumeUrl || "/resume.pdf",
    socialLinks: initialProfile?.socialLinks || [
      { platform: "github", url: "https://github.com/himanshujadav" },
      { platform: "linkedin", url: "https://linkedin.com/in/himanshujadav" },
      { platform: "email", url: "mailto:himanshu@example.com" },
    ],
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
    setFormData((prev) => {
      const nextLinks = [...prev.socialLinks];
      nextLinks[index] = { ...nextLinks[index], [field]: value };
      return { ...prev, socialLinks: nextLinks };
    });
  };

  const handleAddSocial = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "twitter", url: "https://" }],
    }));
  };

  const handleRemoveSocial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground mb-1.5">ADMIN / PROFILE</p>
        <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">Profile</h1>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm"
        >
          <Check className="w-5 h-5 shrink-0" />
          <span>Profile changes saved to Firestore successfully!</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-3 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Details Card */}
        <div className="border border-border rounded-lg p-6 space-y-6 bg-card">
          <h2 className="font-display text-lg font-medium text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="prof-name" className="label-field">Full Name</label>
              <input
                id="prof-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="prof-role" className="label-field">Professional Title / Headline</label>
              <input
                id="prof-role"
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="prof-location" className="label-field">Location</label>
              <input
                id="prof-location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="prof-resume" className="label-field">Resume Document Link</label>
              <input
                id="prof-resume"
                type="text"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prof-bio" className="label-field">Primary Bio Statement</label>
            <textarea
              id="prof-bio"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="input-field py-3"
            />
          </div>
        </div>

        {/* Social Links Card */}
        <div className="border border-border rounded-lg p-6 space-y-6 bg-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-foreground flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Connected Social Links & Channels
            </h2>
            <button
              type="button"
              onClick={handleAddSocial}
              className="btn-outline px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD LINK
            </button>
          </div>

          <div className="space-y-4">
            {formData.socialLinks.map((link, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl bg-card border border-border/30"
              >
                <div className="sm:w-1/3">
                  <label htmlFor={`social-platform-${index}`} className="sr-only">Platform</label>
                  <input
                    id={`social-platform-${index}`}
                    type="text"
                    placeholder="Platform (e.g. github, linkedin, email)"
                    value={link.platform}
                    onChange={(e) => handleSocialChange(index, "platform", e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor={`social-url-${index}`} className="sr-only">URL</label>
                  <input
                    id={`social-url-${index}`}
                    type="text"
                    placeholder="https://... or mailto:..."
                    value={link.url}
                    onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                    className="input-field text-sm font-mono"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 shrink-0">
                  {link.url && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Test URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(index)}
                    className="p-2 rounded-lg hover:bg-error/10 text-muted-foreground hover:text-error transition-colors"
                    aria-label={`Remove ${link.platform} link`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary min-w-[160px] cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                SAVING...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                SAVE PROFILE
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
