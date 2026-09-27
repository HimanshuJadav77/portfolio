"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User,
  Save,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Link2,
  ExternalLink,
  Crop,
  Sliders,
  Maximize2,
  RotateCcw,
  Upload,
  Sparkles,
  Eye,
} from "lucide-react";
import { Profile, SocialLink, AvatarCropSettings } from "@/types/profile";
import { normalizeGoogleDriveImageUrl, cn } from "@/lib/utils/helpers";

interface ProfileFormProps {
  initialProfile: Profile | null;
}

const PRESET_DIMENSIONS = [
  { label: "Hero Arch Shape", aspect: "4:5.2", width: 320, height: 420 },
  { label: "Square Avatar (1:1)", aspect: "1:1", width: 400, height: 400 },
  { label: "Portrait (3:4)", aspect: "3:4", width: 300, height: 400 },
  { label: "Custom Dimensions", aspect: "custom", width: 320, height: 420 },
] as const;

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: initialProfile?.name || "Himanshu Jadav",
    role: initialProfile?.role || "Software Engineer",
    bio: initialProfile?.bio || "I build software that connects people, devices, and systems.",
    location: initialProfile?.location || "Rajkot, India",
    avatarUrl: initialProfile?.avatarUrl || "/images/himanshu-profile.jpg",
    avatarCrop: initialProfile?.avatarCrop || {
      scale: 1.02,
      x: 50,
      y: 30,
      width: 320,
      height: 420,
      aspect: "4:5.2",
      fit: "cover" as const,
    },
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
  const [uploading, setUploading] = useState(false);
  const [previewTab, setPreviewTab] = useState<"arch" | "circle">("arch");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current URL is a Google Drive link
  const isDriveUrl = formData.avatarUrl.includes("drive.google.com");
  const normalizedPreviewUrl = normalizeGoogleDriveImageUrl(formData.avatarUrl);

  const handleAvatarUrlChange = (val: string) => {
    // If user pastes a Google Drive link, auto-convert it
    const normalized = normalizeGoogleDriveImageUrl(val);
    setFormData((prev) => ({
      ...prev,
      avatarUrl: normalized,
    }));
  };

  const updateCrop = (updates: Partial<AvatarCropSettings>) => {
    setFormData((prev) => ({
      ...prev,
      avatarCrop: {
        ...(prev.avatarCrop || { scale: 1.0, x: 50, y: 30, fit: "cover" }),
        ...updates,
      },
    }));
  };

  const handlePresetSelect = (preset: (typeof PRESET_DIMENSIONS)[number]) => {
    updateCrop({
      aspect: preset.aspect,
      width: preset.width,
      height: preset.height,
    });
  };

  const handleResetCrop = () => {
    updateCrop({
      scale: 1.02,
      x: 50,
      y: 30,
      width: 320,
      height: 420,
      aspect: "4:5.2",
      fit: "cover",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("field", "avatars");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Upload failed");
      }

      const { url } = await res.json();
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
    } catch (err) {
      // Fallback: Read as local data URL for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, avatarUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
      setError(err instanceof Error ? `Upload to storage failed, using preview: ${err.message}` : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

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

  const currentCrop = formData.avatarCrop || { scale: 1.02, x: 50, y: 30, fit: "cover" };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground mb-1.5">ADMIN / PROFILE</p>
        <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">Profile & Image Studio</h1>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm"
        >
          <Check className="w-5 h-5 shrink-0" />
          <span>Profile and Image Studio settings saved to Firestore successfully!</span>
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
        <div className="border border-border rounded-xl p-6 space-y-6 bg-card">
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

        {/* IMAGE STUDIO & CROP CONTROLS CARD */}
        <div className="border border-border rounded-xl p-6 space-y-6 bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <h2 className="font-display text-lg font-medium text-foreground flex items-center gap-2">
                <Crop className="w-5 h-5 text-primary" />
                Profile Image Studio: URL, Crop & Dimension Controls
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Supports Google Drive URLs, cloud links, crop zoom, alignment, and live Hero Arch shape preview.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetCrop}
              className="btn-outline self-start sm:self-auto text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Crop
            </button>
          </div>

          {/* Image Source Input */}
          <div className="space-y-4">
            <div>
              <label htmlFor="prof-avatar-url" className="label-field flex items-center justify-between">
                <span>Image URL or Google Drive Link</span>
                <span className="text-[11px] font-mono text-muted-foreground">Auto-converts Drive links to stream</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="prof-avatar-url"
                  type="text"
                  placeholder="https://drive.google.com/file/d/.../view or /images/profile.jpg"
                  value={formData.avatarUrl}
                  onChange={(e) => handleAvatarUrlChange(e.target.value)}
                  className="input-field font-mono text-xs"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn-outline shrink-0 text-xs px-3 py-2 flex items-center gap-1.5 cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>Upload File</span>
                </button>
              </div>

              {/* Google Drive conversion badge */}
              {formData.avatarUrl.includes("lh3.googleusercontent.com") && (
                <div className="mt-2 text-xs text-purple-400 flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Google Drive link detected and converted to high-speed CDN stream URL.</span>
                </div>
              )}
            </div>

            {/* Split layout: Controls (left) & Live Visual Preview (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              {/* Left Column: Crop & Dimension Adjustments */}
              <div className="lg:col-span-7 space-y-6">
                {/* Dimension Presets */}
                <div>
                  <label className="label-field block mb-2">Aspect Ratio & Shape Preset</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_DIMENSIONS.map((preset) => {
                      const isActive = currentCrop.aspect === preset.aspect;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handlePresetSelect(preset)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-mono border transition-all text-left flex flex-col justify-between h-16 cursor-pointer",
                            isActive
                              ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                              : "border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className="truncate">{preset.label}</span>
                          <span className="text-[10px] opacity-70">
                            {preset.width} × {preset.height}px
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explicit Dimensions (Width & Height) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="crop-width" className="label-field">Width (px)</label>
                    <input
                      id="crop-width"
                      type="number"
                      min={100}
                      max={1200}
                      value={currentCrop.width || 320}
                      onChange={(e) => updateCrop({ width: Number(e.target.value) })}
                      className="input-field font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="crop-height" className="label-field">Height (px)</label>
                    <input
                      id="crop-height"
                      type="number"
                      min={100}
                      max={1200}
                      value={currentCrop.height || 420}
                      onChange={(e) => updateCrop({ height: Number(e.target.value) })}
                      className="input-field font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Scale / Zoom Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="crop-scale" className="label-field !mb-0 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-primary" />
                      <span>Scale / Zoom Level</span>
                    </label>
                    <span className="font-mono text-primary font-bold">
                      {((currentCrop.scale || 1.0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    id="crop-scale"
                    type="range"
                    min={1.0}
                    max={2.5}
                    step={0.01}
                    value={currentCrop.scale || 1.0}
                    onChange={(e) => updateCrop({ scale: parseFloat(e.target.value) })}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                    <span>100% (Fit)</span>
                    <span>175%</span>
                    <span>250% (Max Zoom)</span>
                  </div>
                </div>

                {/* Positioning (X and Y offsets) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Horizontal Position */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="crop-x" className="label-field !mb-0">Horizontal Pan (X)</label>
                      <span className="font-mono text-muted-foreground">{currentCrop.x ?? 50}%</span>
                    </div>
                    <input
                      id="crop-x"
                      type="range"
                      min={0}
                      max={100}
                      value={currentCrop.x ?? 50}
                      onChange={(e) => updateCrop({ x: Number(e.target.value) })}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex gap-1 justify-between">
                      <button
                        type="button"
                        onClick={() => updateCrop({ x: 0 })}
                        className="text-[10px] px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground cursor-pointer"
                      >
                        Left (0%)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCrop({ x: 50 })}
                        className="text-[10px] px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground cursor-pointer"
                      >
                        Center (50%)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCrop({ x: 100 })}
                        className="text-[10px] px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground cursor-pointer"
                      >
                        Right (100%)
                      </button>
                    </div>
                  </div>

                  {/* Vertical Position */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="crop-y" className="label-field !mb-0">Vertical Pan (Y)</label>
                      <span className="font-mono text-muted-foreground">{currentCrop.y ?? 30}%</span>
                    </div>
                    <input
                      id="crop-y"
                      type="range"
                      min={0}
                      max={100}
                      value={currentCrop.y ?? 30}
                      onChange={(e) => updateCrop({ y: Number(e.target.value) })}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex gap-1 justify-between">
                      <button
                        type="button"
                        onClick={() => updateCrop({ y: 15 })}
                        className="text-[10px] px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground cursor-pointer"
                      >
                        Top (15%)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCrop({ y: 30 })}
                        className="text-[10px] px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground cursor-pointer"
                      >
                        Focus (30%)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCrop({ y: 50 })}
                        className="text-[10px] px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground cursor-pointer"
                      >
                        Center (50%)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Object Fit mode */}
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-mono text-muted-foreground">Object Fit:</span>
                  <div className="flex rounded-lg border border-border p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => updateCrop({ fit: "cover" })}
                      className={cn(
                        "px-3 py-1 rounded text-xs font-mono cursor-pointer transition-colors",
                        currentCrop.fit === "cover"
                          ? "bg-primary text-black font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Cover (Fill Shape)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCrop({ fit: "contain" })}
                      className={cn(
                        "px-3 py-1 rounded text-xs font-mono cursor-pointer transition-colors",
                        currentCrop.fit === "contain"
                          ? "bg-primary text-black font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Contain
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Shape Preview */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950/80 rounded-2xl border border-border/60 relative overflow-hidden">
                {/* Preview Mode Switcher */}
                <div className="flex items-center gap-2 mb-6 z-20">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("arch")}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-mono cursor-pointer transition-colors",
                      previewTab === "arch"
                        ? "bg-purple-600 text-white font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground bg-card/60"
                    )}
                  >
                    Hero Arch Shape
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("circle")}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-mono cursor-pointer transition-colors",
                      previewTab === "circle"
                        ? "bg-purple-600 text-white font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground bg-card/60"
                    )}
                  >
                    About Circular Badge
                  </button>
                </div>

                {/* PREVIEW CONTAINER 1: HERO ARCH SHAPE */}
                {previewTab === "arch" && (
                  <div className="relative flex flex-col items-center">
                    {/* Arch Wrapper with Neon Purple Rim and ZERO orange */}
                    <div className="relative w-52 h-[290px] rounded-t-full rounded-b-[38px] p-[2px] bg-gradient-to-b from-purple-500/60 via-fuchsia-500/35 to-purple-900/80 shadow-[0_20px_50px_-10px_rgba(168,85,247,0.35)] border border-purple-500/25 flex items-end justify-center">
                      {/* Inner Dark Arch Frame — Zero Orange */}
                      <div className="relative w-full h-full rounded-t-full rounded-b-[36px] bg-zinc-950 overflow-hidden">
                        {/* Live Cropped Image inside the arch shape */}
                        <div className="absolute inset-0 overflow-hidden rounded-t-full rounded-b-[36px]">
                          {normalizedPreviewUrl ? (
                            <Image
                              src={normalizedPreviewUrl}
                              alt="Crop Preview"
                              fill
                              unoptimized={normalizedPreviewUrl.startsWith("data:")}
                              className="object-cover transition-transform duration-150"
                              style={{
                                objectPosition: `${currentCrop.x ?? 50}% ${currentCrop.y ?? 30}%`,
                                transform: currentCrop.scale ? `scale(${currentCrop.scale})` : undefined,
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-mono">
                              No Image URL
                            </div>
                          )}
                          {/* Bottom dark gradient for signature contrast */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                        </div>
                      </div>

                      {/* Floating Mock Badge Left */}
                      <div className="absolute -left-3 top-14 bg-zinc-950/95 text-white text-[9px] font-mono px-2 py-0.5 rounded-full border border-white/20 shadow-md -rotate-6 z-20 pointer-events-none">
                        Flutter · Dart
                      </div>

                      {/* Floating Mock Badge Right */}
                      <div className="absolute -right-3 top-10 bg-zinc-950/95 text-white text-[9px] font-mono px-2 py-0.5 rounded-full border border-white/20 shadow-md rotate-6 z-20 pointer-events-none">
                        Node.js · Sockets
                      </div>

                      {/* Signature Script Overlay */}
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 -rotate-3 z-30 select-none pointer-events-none w-max px-2">
                        <span className="signature-script text-2xl font-bold block whitespace-nowrap">
                          {formData.name || "Himanshu Jadav"}
                        </span>
                      </div>
                    </div>

                    <span className="mt-4 text-[11px] font-mono text-muted-foreground">
                      Hero Arch Live Shape (Zero Orange · Exact Arch Curve)
                    </span>
                  </div>
                )}

                {/* PREVIEW CONTAINER 2: CIRCLE AVATAR */}
                {previewTab === "circle" && (
                  <div className="relative flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full border-4 border-card overflow-hidden shadow-2xl bg-gradient-to-tr from-purple-500/80 via-fuchsia-500/50 to-indigo-600/80 relative">
                      {normalizedPreviewUrl ? (
                        <Image
                          src={normalizedPreviewUrl}
                          alt="Crop Preview"
                          fill
                          unoptimized={normalizedPreviewUrl.startsWith("data:")}
                          className="object-cover transition-transform duration-150"
                          style={{
                            objectPosition: `${currentCrop.x ?? 50}% ${currentCrop.y ?? 30}%`,
                            transform: currentCrop.scale ? `scale(${currentCrop.scale})` : undefined,
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-mono">
                          No Image
                        </div>
                      )}
                    </div>
                    <span className="mt-4 px-3 py-1 rounded-full bg-muted/60 border border-border/80 text-xs font-mono font-semibold text-foreground">
                      {formData.name || "Himanshu Jadav"}
                    </span>
                    <span className="mt-2 text-[11px] font-mono text-muted-foreground">
                      Circular Badge Shape (About / Identity Section)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className="border border-border rounded-xl p-6 space-y-6 bg-card">
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
