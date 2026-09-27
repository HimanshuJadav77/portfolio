import { z } from 'zod';

export const projectGalleryItemSchema = z.object({
  url: z.string().url('Invalid URL'),
  alt: z.string().min(1, 'Alt text is required'),
  caption: z.string().optional(),
});

export const projectTechnologySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.string().optional(),
});

export const projectMetricSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
});

export const projectChallengeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export const projectResultSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export const projectSEOSchema = z.object({
  title: z.string().min(1, 'SEO title is required').max(60, 'Title too long'),
  description: z.string().min(1, 'SEO description is required').max(160, 'Description too long'),
  ogImage: z.string().url('Invalid OG image URL').optional().or(z.literal('')),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  shortDescription: z.string().min(1, 'Short description is required').max(200, 'Too long'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  featured: z.boolean(),
  published: z.boolean(),
  order: z.number().int().min(0, 'Order must be non-negative'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),
  heroImageUrl: z.string().url('Invalid hero image URL').optional().or(z.literal('')),
  gallery: z.array(projectGalleryItemSchema),
  technologies: z.array(projectTechnologySchema),
  metrics: z.array(projectMetricSchema),
  problem: z.string().min(1, 'Problem is required'),
  solution: z.string().min(1, 'Solution is required'),
  architecture: z.string().min(1, 'Architecture is required'),
  challenges: z.array(projectChallengeSchema),
  results: z.array(projectResultSchema),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Invalid live URL').optional().or(z.literal('')),
  seo: projectSEOSchema,
});

// Form schema - more permissive for complex nested arrays
export const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  shortDescription: z.string().min(1, 'Short description is required').max(200, 'Too long'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  featured: z.boolean(),
  published: z.boolean(),
  order: z.number().int().min(0, 'Order must be non-negative'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),
  heroImageUrl: z.string().url('Invalid hero image URL').optional().or(z.literal('')),
  gallery: z.array(z.any()),
  technologies: z.array(z.any()),
  metrics: z.array(z.any()),
  problem: z.string().min(1, 'Problem is required'),
  solution: z.string().min(1, 'Solution is required'),
  architecture: z.string().min(1, 'Architecture is required'),
  challenges: z.array(z.any()),
  results: z.array(z.any()),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Invalid live URL').optional().or(z.literal('')),
  seo: projectSEOSchema,
});

export type ProjectFormData = z.infer<typeof projectSchema>;