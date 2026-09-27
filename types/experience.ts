import { Timestamp } from 'firebase/firestore';

export type ExperienceType = 'full-time' | 'contract' | 'internship' | 'freelance';

export interface Experience {
  id?: string;
  company: string;
  role: string;
  location: string;
  type: ExperienceType;
  startDate: Timestamp | Date;
  endDate?: Timestamp | Date;
  current: boolean;
  description: string;
  technologies: string[];
  highlights: string[];
  order: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface ExperienceFormData {
  company: string;
  role: string;
  location: string;
  type: ExperienceType;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string;
  technologies: string;
  highlights: string;
  order: number;
}