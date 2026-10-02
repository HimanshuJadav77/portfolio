"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X, Eye, Save, Plus, AlertCircle, Link2, ExternalLink, Sparkles, Image as ImageIcon, Trash2 } from "lucide-react";
import { cn, normalizeGoogleDriveImageUrl } from "@/lib/utils/helpers";
import { Project, Skill, ProjectFormData } from "@/types";
import { projectFormSchema } from "@/lib/validations/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Toaster } from "sonner";

interface AdminProjectFormProps {
  project?: Project;
  skills: Skill[];
  mode: "create" | "edit";
}

const categoryOptions = [
  { value: "MOBILE", label: "Mobile" },
  { value: "BACKEND", label: "Backend" },
  { value: "REAL-TIME", label: "Real-Time" },
  { value: "INFRASTRUCTURE", label: "Infrastructure" },
  { value: "BUSINESS SYSTEM", label: "Business System" },
  { value: "FULLSTACK", label: "Full Stack" },
  { value: "WEB", label: "Web" },
  { value: "OTHER", label: "Other" },
] as const;

const emptyGalleryItem = { url: "", alt: "", caption: "" };
const emptyTechnology = { name: "", icon: "" };
const emptyMetric = { label: "", value: "" };
const emptyChallenge = { title: "", description: "" };
const emptyResult = { title: "", description: "" };

const defaultFormData: ProjectFormData = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  category: "MOBILE",
  featured: false,
  published: false,
  order: 0,
  thumbnailUrl: "",
  heroImageUrl: "",
  gallery: [],
  technologies: [],
  metrics: [],
  problem: "",
  solution: "",
  architecture: "",
  challenges: [],
  results: [],
  githubUrl: "",
  liveUrl: "",
  seo: { title: "", description: "", ogImage: "" },
};

export function AdminProjectForm({ project, skills, mode }: AdminProjectFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (project?.thumbnailUrl) initial.thumbnailUrl = normalizeGoogleDriveImageUrl(project.thumbnailUrl);
    if (project?.heroImageUrl) initial.heroImageUrl = normalizeGoogleDriveImageUrl(project.heroImageUrl);
    if (project?.gallery) {
      project.gallery.forEach((g, idx) => {
        if (g?.url) initial[`gallery_${idx}`] = normalizeGoogleDriveImageUrl(g.url);
      });
    }
    return initial;
  });
  const [, setUploadProgress] = useState<Record<string, number>>({});

  const form = useForm<any>({
    resolver: zodResolver(projectFormSchema) as any,
    defaultValues: project ? {
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      description: project.description,
      category: project.category,
      featured: project.featured,
      published: project.published,
      order: project.order,
      thumbnailUrl: project.thumbnailUrl,
      heroImageUrl: project.heroImageUrl,
      gallery: project.gallery,
      technologies: project.technologies,
      metrics: project.metrics,
      problem: project.problem,
      solution: project.solution,
      architecture: project.architecture,
      challenges: project.challenges,
      results: project.results,
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      seo: project.seo,
    } : defaultFormData,
  });

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({ control: form.control, name: "gallery" });
  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({ control: form.control, name: "technologies" });
  const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({ control: form.control, name: "metrics" });
  const { fields: challengeFields, append: appendChallenge, remove: removeChallenge } = useFieldArray({ control: form.control, name: "challenges" });
  const { fields: resultFields, append: appendResult, remove: removeResult } = useFieldArray({ control: form.control, name: "results" });

  useEffect(() => {
    if (galleryFields.length === 0) appendGallery(emptyGalleryItem);
    if (techFields.length === 0) appendTech(emptyTechnology);
    if (metricFields.length === 0) appendMetric(emptyMetric);
    if (challengeFields.length === 0) appendChallenge(emptyChallenge);
    if (resultFields.length === 0) appendResult(emptyResult);
  }, [galleryFields.length, techFields.length, metricFields.length, challengeFields.length, resultFields.length, appendGallery, appendTech, appendMetric, appendChallenge, appendResult]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && !form.getValues("slug")) {
        const slug = value.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "");
        form.setValue("slug", slug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleImageUpload = async (fieldName: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", fieldName);

    setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      form.setValue(fieldName, data.url);
      setImagePreviews(prev => ({ ...prev, [fieldName]: data.url }));
      toast.success(`${fieldName} uploaded`);
    } catch {
      toast.error(`Failed to upload ${fieldName}`);
    } finally {
      setUploadProgress(prev => ({ ...prev, [fieldName]: 100 }));
      setTimeout(() => setUploadProgress(prev => ({ ...prev, [fieldName]: 0 })), 1000);
    }
  };

  const handleFileChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(fieldName, file);
  };

  const handleGalleryFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fieldName = `gallery_${index}`;
      handleImageUpload(fieldName, file).then(() => {
        const gallery = form.getValues("gallery");
        gallery[index] = { ...gallery[index], url: form.getValues(fieldName) || "" };
        form.setValue("gallery", gallery);
      });
    }
  };

  const watchedThumbnail = form.watch("thumbnailUrl") || "";
  const watchedHero = form.watch("heroImageUrl") || "";
  const watchedGallery = form.watch("gallery") || [];

  const handleThumbnailUrlChange = (val: string) => {
    const normalized = normalizeGoogleDriveImageUrl(val);
    form.setValue("thumbnailUrl", normalized, { shouldValidate: true, shouldDirty: true });
    setImagePreviews(prev => ({ ...prev, thumbnailUrl: normalized }));
  };

  const handleHeroUrlChange = (val: string) => {
    const normalized = normalizeGoogleDriveImageUrl(val);
    form.setValue("heroImageUrl", normalized, { shouldValidate: true, shouldDirty: true });
    setImagePreviews(prev => ({ ...prev, heroImageUrl: normalized }));
  };

  const handleGalleryUrlChange = (index: number, val: string) => {
    const normalized = normalizeGoogleDriveImageUrl(val);
    const gallery = [...(form.getValues("gallery") || [])];
    if (gallery[index]) {
      gallery[index] = { ...gallery[index], url: normalized };
      form.setValue("gallery", gallery, { shouldValidate: true, shouldDirty: true });
    }
    setImagePreviews(prev => ({ ...prev, [`gallery_${index}`]: normalized }));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    try {
      const targetId = project?.id || project?.slug;
      const url = mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${targetId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save project");
      }

      toast.success(mode === "create" ? "Project created" : "Project updated");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "GENERAL", icon: "📋" },
    { id: "content", label: "CONTENT", icon: "📝" },
    { id: "media", label: "MEDIA", icon: "🖼️" },
    { id: "technology", label: "TECHNOLOGY", icon: "⚙️" },
    { id: "metrics", label: "METRICS", icon: "📊" },
    { id: "architecture", label: "ARCHITECTURE", icon: "🏗️" },
    { id: "challenges", label: "CHALLENGES", icon: "🧩" },
    { id: "results", label: "RESULTS", icon: "🎯" },
    { id: "links", label: "LINKS", icon: "🔗" },
    { id: "seo", label: "SEO", icon: "🔍" },
    { id: "publishing", label: "PUBLISHING", icon: "🚀" },
  ];

  const { register, watch, setValue, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-5 border-b border-border"
      >
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground mb-1.5">PROJECTS / {mode.toUpperCase()}</p>
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">{mode === "create" ? "Create Project" : `Edit Project`}</h1>
        </div>
        <div className="flex gap-3">
          {mode === "edit" && project && (
            <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <Eye className="w-4 h-4" aria-hidden="true" />
              PREVIEW
            </a>
          )}
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            CANCEL
          </Button>
          <Button type="submit" form="project-form" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
                SAVING...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" aria-hidden="true" />
                {mode === "create" ? "Create" : "Save"}
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <form id="project-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="flex gap-5 overflow-x-auto border-b border-border rounded-none bg-transparent p-0 h-auto">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-[11px] font-mono tracking-widest px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground shrink-0">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* GENERAL TAB */}
          <TabsContent value="general" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="Project title"
                      className={cn(errors.title && "border-error")}
                    />
                    {errors.title && <p className="text-error text-sm">{(errors.title as { message?: string }).message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      {...register("slug")}
                      placeholder="project-slug"
                      className={cn(errors.slug && "border-error")}
                    />
                    {errors.slug && <p className="text-error text-sm">{(errors.slug as { message?: string }).message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    {...register("shortDescription")}
                    rows={2}
                    placeholder="Brief description for cards and listings"
                    className={cn(errors.shortDescription && "border-error")}
                  />
                  {errors.shortDescription && <p className="text-error text-sm">{(errors.shortDescription as { message?: string }).message}</p>}
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(v) => setValue("category", v)} defaultValue={watch("category")}>
                      <SelectTrigger id="category" className={cn(errors.category && "border-error")}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-error text-sm">{(errors.category as { message?: string }).message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      {...register("order", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <Label htmlFor="featured">Featured Project</Label>
                    <Switch
                      id="featured"
                      {...register("featured")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTENT TAB */}
          <TabsContent value="content" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>Full Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    rows={8}
                    placeholder="Full project description (markdown supported)"
                    className={cn(errors.description && "border-error")}
                  />
                  {errors.description && <p className="text-error text-sm">{(errors.description as { message?: string }).message}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MEDIA TAB */}
          <TabsContent value="media" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Project Images (URLs & Links)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Provide image links or Google Drive URLs for your project. Google Drive links are automatically converted to direct, high-speed CDN stream URLs.
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Thumbnail & Hero Image Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Thumbnail Image */}
                  <div className="space-y-3 p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="thumbnail-url" className="text-sm font-semibold flex items-center gap-1.5">
                        <Link2 className="w-4 h-4 text-primary" />
                        Thumbnail Image Link
                      </Label>
                      {watchedThumbnail && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Input
                        id="thumbnail-url"
                        type="url"
                        placeholder="https://drive.google.com/file/d/... or https://..."
                        value={watchedThumbnail}
                        onChange={(e) => handleThumbnailUrlChange(e.target.value)}
                        className="font-mono text-xs pr-8"
                      />
                      {watchedThumbnail && (
                        <button
                          type="button"
                          onClick={() => handleThumbnailUrlChange("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          title="Clear URL"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Google Drive auto-converted badge */}
                    {watchedThumbnail.includes("lh3.googleusercontent.com") && (
                      <div className="text-[11px] text-amber-500 flex items-center gap-1 font-mono">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>Google Drive link detected and converted to high-speed stream.</span>
                      </div>
                    )}

                    {/* Preview Area */}
                    <div className="relative aspect-video rounded-xl border-2 border-dashed border-border bg-muted/30 overflow-hidden flex items-center justify-center">
                      {watchedThumbnail ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={watchedThumbnail}
                            alt="Thumbnail preview"
                            className="object-cover w-full h-full rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/20">
                            <a
                              href={watchedThumbnail}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-white hover:text-primary transition-colors"
                              title="Open image in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleThumbnailUrlChange("")}
                              className="p-1 text-white hover:text-error transition-colors"
                              title="Remove thumbnail"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
                          <p className="text-xs font-medium">No Thumbnail Link</p>
                          <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                            Paste an image link above to view preview
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Recommended: 800x450px (16:9). Used on project cards and home page showcase.
                    </p>
                  </div>

                  {/* Hero Cover Image */}
                  <div className="space-y-3 p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hero-url" className="text-sm font-semibold flex items-center gap-1.5">
                        <Link2 className="w-4 h-4 text-primary" />
                        Hero Cover Image Link
                      </Label>
                      {watchedHero && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Input
                        id="hero-url"
                        type="url"
                        placeholder="https://drive.google.com/file/d/... or https://..."
                        value={watchedHero}
                        onChange={(e) => handleHeroUrlChange(e.target.value)}
                        className="font-mono text-xs pr-8"
                      />
                      {watchedHero && (
                        <button
                          type="button"
                          onClick={() => handleHeroUrlChange("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          title="Clear URL"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Google Drive auto-converted badge */}
                    {watchedHero.includes("lh3.googleusercontent.com") && (
                      <div className="text-[11px] text-amber-500 flex items-center gap-1 font-mono">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>Google Drive link detected and converted to high-speed stream.</span>
                      </div>
                    )}

                    {/* Preview Area */}
                    <div className="relative aspect-video rounded-xl border-2 border-dashed border-border bg-muted/30 overflow-hidden flex items-center justify-center">
                      {watchedHero ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={watchedHero}
                            alt="Hero preview"
                            className="object-cover w-full h-full rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/20">
                            <a
                              href={watchedHero}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-white hover:text-primary transition-colors"
                              title="Open image in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleHeroUrlChange("")}
                              className="p-1 text-white hover:text-error transition-colors"
                              title="Remove hero cover"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
                          <p className="text-xs font-medium">No Hero Cover Link</p>
                          <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                            Paste an image link above to view preview
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Recommended: 1200x675px (16:9). Displayed prominently at top of project case study.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Gallery Images */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Gallery Images
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Add screenshots, architectural diagrams, or UI mockups using direct image URLs or Google Drive links.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendGallery(emptyGalleryItem)}
                      className="border-primary/40 text-primary hover:bg-primary/10 gap-1.5"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                      ADD IMAGE LINK
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {galleryFields.map((field, index) => {
                      const itemUrl = watchedGallery?.[index]?.url || "";
                      return (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                              Image #{index + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-error hover:text-error hover:bg-error/10 h-7 px-2 text-xs"
                              onClick={() => removeGallery(index)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                              Remove
                            </Button>
                          </div>

                          {/* Image URL Input */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-mono text-muted-foreground">Image URL / Link</Label>
                            <div className="relative">
                              <Input
                                type="url"
                                placeholder="https://... or Google Drive link"
                                value={itemUrl}
                                onChange={(e) => handleGalleryUrlChange(index, e.target.value)}
                                className="font-mono text-xs pr-7"
                              />
                              {itemUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleGalleryUrlChange(index, "")}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  title="Clear URL"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            {itemUrl.includes("lh3.googleusercontent.com") && (
                              <div className="text-[10px] text-amber-500 flex items-center gap-1 font-mono">
                                <Sparkles className="w-3 h-3 shrink-0" />
                                <span>Converted from Drive</span>
                              </div>
                            )}
                          </div>

                          {/* Live Preview Container */}
                          <div className="relative aspect-video rounded-xl border border-border bg-muted/30 overflow-hidden flex items-center justify-center">
                            {itemUrl ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={itemUrl}
                                  alt={watchedGallery?.[index]?.alt || `Gallery ${index + 1}`}
                                  className="object-cover rounded-lg w-full h-full"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                                <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-md p-1 border border-white/20">
                                  <a
                                    href={itemUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-0.5 text-white hover:text-primary transition-colors"
                                    title="Open link"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </>
                            ) : (
                              <div className="text-center p-2 text-muted-foreground">
                                <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-40" />
                                <span className="text-[10px]">No image link</span>
                              </div>
                            )}
                          </div>

                          {/* Alt & Caption */}
                          <div className="space-y-2 pt-1">
                            <Controller
                              name={`gallery.${index}.alt`}
                              control={form.control}
                              render={({ field }) => (
                                <Input {...field} placeholder="Alt text (for accessibility)" className="text-xs" />
                              )}
                            />
                            <Controller
                              name={`gallery.${index}.caption`}
                              control={form.control}
                              render={({ field }) => (
                                <Input {...field} placeholder="Caption (optional)" className="text-xs" />
                              )}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TECHNOLOGY TAB */}
          <TabsContent value="technology" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Technologies
                  <Button type="button" variant="outline" size="sm" onClick={() => appendTech(emptyTechnology)}>
                    <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                    ADD
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {techFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3"
                    >
                      <Controller
                        name={`technologies.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Technology" />
                            </SelectTrigger>
                            <SelectContent>
                              {skills.map((skill) => (
                                <SelectItem key={skill.id} value={skill.name}>{skill.name}</SelectItem>
                              ))}
                              <SelectItem value="custom">Custom...</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Controller
                        name={`technologies.${index}.icon`}
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Icon (emoji or class)"
                            className="flex-1 text-sm"
                          />
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-error hover:text-error hover:bg-error/10"
                        onClick={() => removeTech(index)}
                        disabled={techFields.length <= 1}
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* METRICS TAB */}
          <TabsContent value="metrics" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Key Metrics
                  <Button type="button" variant="outline" size="sm" onClick={() => appendMetric(emptyMetric)}>
                    <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                    ADD
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metricFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3"
                    >
                      <Controller
                        name={`metrics.${index}.label`}
                        control={form.control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Label (e.g., Users, Downloads)" className="w-48 text-sm" />
                        )}
                      />
                      <Controller
                        name={`metrics.${index}.value`}
                        control={form.control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Value (e.g., 10K+, 99.9%)" className="w-48 text-sm" />
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-error hover:text-error hover:bg-error/10"
                        onClick={() => removeMetric(index)}
                        disabled={metricFields.length <= 1}
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ARCHITECTURE TAB */}
          <TabsContent value="architecture" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>System Architecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="architecture">Architecture Description *</Label>
                  <Textarea
                    id="architecture"
                    {...register("architecture")}
                    rows={15}
                    placeholder="Describe the system architecture. Use text-based diagrams like:
Flutter Client
↓
Device Discovery
↓
Connection Manager
↓
TCP Session
↓
Transfer Engine
↓
Storage"
                    className={cn("font-mono text-sm", errors.architecture && "border-error")}
                  />
                  {errors.architecture && <p className="text-error text-sm">{String(errors.architecture.message)}</p>}
                  <p className="caption text-muted-foreground">Use text-based diagrams with arrows (↓, →) to show data flow between components.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CHALLENGES TAB */}
          <TabsContent value="challenges" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Technical Challenges
                  <Button type="button" variant="outline" size="sm" onClick={() => appendChallenge(emptyChallenge)}>
                    <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                    ADD
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challengeFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-elevated p-4 space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">Challenge #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-error hover:text-error hover:bg-error/10"
                          onClick={() => removeChallenge(index)}
                          disabled={challengeFields.length <= 1}
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`challenge-title-${index}`}>Title *</Label>
                          <Controller
                            name={`challenges.${index}.title`}
                            control={form.control}
                            render={({ field }) => (
                              <Input id={`challenge-title-${index}`} {...field} placeholder="Challenge title" />
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`challenge-desc-${index}`}>Description *</Label>
                          <Controller
                            name={`challenges.${index}.description`}
                            control={form.control}
                            render={({ field }) => (
                              <Textarea id={`challenge-desc-${index}`} {...field} rows={3} placeholder="Describe the challenge and its complexity" />
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RESULTS TAB */}
          <TabsContent value="results" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Results & Solutions
                  <Button type="button" variant="outline" size="sm" onClick={() => appendResult(emptyResult)}>
                    <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                    ADD
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resultFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-elevated p-4 space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">Result #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-error hover:text-error hover:bg-error/10"
                          onClick={() => removeResult(index)}
                          disabled={resultFields.length <= 1}
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`result-title-${index}`}>Title *</Label>
                          <Controller
                            name={`results.${index}.title`}
                            control={form.control}
                            render={({ field }) => (
                              <Input id={`result-title-${index}`} {...field} placeholder="Result title" />
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`result-desc-${index}`}>Description *</Label>
                          <Controller
                            name={`results.${index}.description`}
                            control={form.control}
                            render={({ field }) => (
                              <Textarea id={`result-desc-${index}`} {...field} rows={3} placeholder="Describe the outcome and impact" />
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LINKS TAB */}
          <TabsContent value="links" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>External Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub Repository</Label>
                    <Input
                      id="githubUrl"
                      {...register("githubUrl")}
                      type="url"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liveUrl">Live Demo URL</Label>
                    <Input
                      id="liveUrl"
                      {...register("liveUrl")}
                      type="url"
                      placeholder="https://your-demo.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO TAB */}
          <TabsContent value="seo" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">SEO Title</Label>
                  <Controller
                    name="seo.title"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="seo-title"
                        {...field}
                        placeholder="Auto-generated from project title if empty"
                        maxLength={60}
                      />
                    )}
                  />
                  <p className="caption text-muted-foreground">Max 60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo-description">SEO Description</Label>
                  <Controller
                    name="seo.description"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        id="seo-description"
                        {...field}
                        rows={3}
                        placeholder="Auto-generated from short description if empty"
                        maxLength={160}
                      />
                    )}
                  />
                  <p className="caption text-muted-foreground">Max 160 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo-ogImage">Open Graph Image URL</Label>
                  <Controller
                    name="seo.ogImage"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="seo-ogImage"
                        {...field}
                        type="url"
                        placeholder="https://example.com/og-image.png or Google Drive link"
                        onChange={(e) => {
                          const normalized = normalizeGoogleDriveImageUrl(e.target.value);
                          field.onChange(normalized);
                        }}
                      />
                    )}
                  />
                  <p className="caption text-muted-foreground">Recommended: 1200x630px</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PUBLISHING TAB */}
          <TabsContent value="publishing" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <p className="font-medium">Published</p>
                      <p className="caption text-muted-foreground">Visible on public portfolio</p>
                    </div>
                    <Switch {...register("published")} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <p className="font-medium">Featured</p>
                      <p className="caption text-muted-foreground">Show on homepage featured section</p>
                    </div>
                    <Switch {...register("featured")} />
                  </div>
                </div>

                {mode === "edit" && project && (
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant="destructive" className="w-full">
                        <AlertCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                        DELETE PROJECT
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{project.title}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="flex justify-end gap-4">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
                              if (!response.ok) throw new Error("Failed to delete");
                              toast.success("Project deleted");
                              router.push("/admin/projects");
                              router.refresh();
                            } catch {
                              toast.error("Failed to delete project");
                            }
                          }}
                          className="bg-error hover:bg-error/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
      <Toaster position="top-right" />
    </div>
  );
}