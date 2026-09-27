import { Timestamp } from 'firebase/firestore';

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface Profile {
  id?: string;
  name: string;
  role: string;
  bio: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  phone?: string;
  socialLinks: SocialLink[];
  updatedAt: Timestamp | Date;
}

export interface ProfileFormData {
  name: string;
  role: string;
  bio: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  socialLinks: SocialLink[];
}