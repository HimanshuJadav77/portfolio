import { Timestamp } from 'firebase/firestore';

export interface ProjectGalleryItem {
  url: string;
  alt: string;
  caption: string;
}

export interface ProjectTechnology {
  name: string;
  icon?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectChallenge {
  title: string;
  description: string;
}

export interface ProjectResult {
  title: string;
  description: string;
}

export interface ProjectSEO {
  title: string;
  description: string;
  ogImage?: string;
}

export interface Project {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  featured: boolean;
  published: boolean;
  order: number;
  thumbnailUrl: string;
  heroImageUrl: string;
  gallery: ProjectGalleryItem[];
  technologies: ProjectTechnology[];
  metrics: ProjectMetric[];
  problem: string;
  solution: string;
  architecture: string;
  challenges: ProjectChallenge[];
  results: ProjectResult[];
  githubUrl?: string;
  liveUrl?: string;
  seo: ProjectSEO;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface ProjectFormData {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  featured: boolean;
  published: boolean;
  order: number;
  thumbnailUrl: string;
  heroImageUrl: string;
  gallery: ProjectGalleryItem[];
  technologies: ProjectTechnology[];
  metrics: ProjectMetric[];
  problem: string;
  solution: string;
  architecture: string;
  challenges: ProjectChallenge[];
  results: ProjectResult[];
  githubUrl: string;
  liveUrl: string;
  seo: ProjectSEO;
}