import { Timestamp } from 'firebase/firestore';

export type SkillCategory =
  | 'languages'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'realtime'
  | 'cloud'
  | 'devops'
  | 'tools'
  | 'mobile'
  | 'other';

export interface Skill {
  id?: string;
  name: string;
  category: SkillCategory;
  icon?: string;
  proficiency: number; // 1 to 5 or percentage
  relatedProjects: string[];
  featured?: boolean;
  order: number;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface SkillFormData {
  name: string;
  category: SkillCategory;
  icon?: string;
  proficiency: number;
  relatedProjects: string[];
  featured?: boolean;
  order: number;
}