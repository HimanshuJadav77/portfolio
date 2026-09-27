"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X, Eye, Save, Plus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
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
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
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

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    try {
      const url = mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${project?.id}`;
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
                <CardTitle className="flex items-center gap-2">Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Thumbnail</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange("thumbnailUrl")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="Upload thumbnail"
                      />
                      <div className={cn(
                        "aspect-video rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer transition-colors hover:border-primary/50",
                        imagePreviews.thumbnailUrl && "border-transparent"
                      )}>
                        {imagePreviews.thumbnailUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imagePreviews.thumbnailUrl}
                              alt="Thumbnail preview"
                              className="object-cover rounded-lg w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 bg-background/80"
                              onClick={() => {
                                form.setValue("thumbnailUrl", "");
                                setImagePreviews(prev => { const n = { ...prev }; delete n.thumbnailUrl; return n; });
                              }}
                            >
                              <X className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
                            <span className="sr-only">Click to upload thumbnail</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="caption text-muted-foreground">Recommended: 800x450px</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Hero Image</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange("heroImageUrl")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="Upload hero image"
                      />
                      <div className={cn(
                        "aspect-video rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer transition-colors hover:border-primary/50",
                        imagePreviews.heroImageUrl && "border-transparent"
                      )}>
                        {imagePreviews.heroImageUrl ? (
                          <>
                            <img
                              src={imagePreviews.heroImageUrl}
                              alt="Hero preview"
                              className="object-cover rounded-lg w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 bg-background/80"
                              onClick={() => {
                                form.setValue("heroImageUrl", "");
                                setImagePreviews(prev => { const n = { ...prev }; delete n.heroImageUrl; return n; });
                              }}
                            >
                              <X className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
                            <span className="sr-only">Click to upload hero image</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="caption text-muted-foreground">Recommended: 1200x675px</p>
                  </div>
                </div>

                <Separator />

                {/* Gallery */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Gallery Images</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendGallery(emptyGalleryItem)}>
                      <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                      ADD IMAGE
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleGalleryFileChange(index)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label={`Upload gallery image ${index + 1}`}
                          />
                          <div className={cn(
                            "aspect-video rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer transition-colors hover:border-primary/50",
                            imagePreviews[`gallery_${index}`] && "border-transparent"
                          )}>
                            {imagePreviews[`gallery_${index}`] ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={imagePreviews[`gallery_${index}`]}
                                  alt={`Gallery ${index + 1}`}
                                  className="object-cover rounded-lg w-full h-full"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button type="button" variant="ghost" size="icon" onClick={() => {
                                    const gallery = form.getValues("gallery");
                                    gallery[index] = { ...gallery[index], url: "" };
                                    form.setValue("gallery", gallery);
                                    setImagePreviews(prev => { const n = { ...prev }; delete n[`gallery_${index}`]; return n; });
                                  }}>
                                    <X className="w-4 h-4 text-white" aria-hidden="true" />
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
                                <span className="sr-only">Click to upload</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 mt-2">
                          <Controller
                            name={`gallery.${index}.alt`}
                            control={form.control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Alt text" className="text-sm" />
                            )}
                          />
                          <Controller
                            name={`gallery.${index}.caption`}
                            control={form.control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Caption (optional)" className="text-sm" />
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-error hover:text-error hover:bg-error/10"
                            onClick={() => removeGallery(index)}
                          >
                            <X className="w-3 h-3 mr-1" aria-hidden="true" />
                            REMOVE
                          </Button>
                        </div>
                      </motion.div>
                    ))}
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
                        placeholder="https://example.com/og-image.png"
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