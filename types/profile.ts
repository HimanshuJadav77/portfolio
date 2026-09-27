import { Timestamp } from 'firebase/firestore';

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface AvatarCropSettings {
  scale?: number;
  x?: number; // 0 to 100 percentage
  y?: number; // 0 to 100 percentage
  width?: number;
  height?: number;
  aspect?: string;
  fit?: 'cover' | 'contain';
}

export interface Profile {
  id?: string;
  name: string;
  role: string;
  bio: string;
  location: string;
  avatarUrl: string;
  avatarCrop?: AvatarCropSettings;
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
  avatarCrop?: AvatarCropSettings;
  resumeUrl: string;
  socialLinks: SocialLink[];
}