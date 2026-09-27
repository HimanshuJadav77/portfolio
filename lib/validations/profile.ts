import { z } from 'zod';

export const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Invalid URL'),
  icon: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  role: z.string().min(1, 'Role is required').max(100, 'Role too long'),
  bio: z.string().min(1, 'Bio is required').max(500, 'Bio too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
  resumeUrl: z.string().url('Invalid resume URL').optional().or(z.literal('')),
  socialLinks: z.array(socialLinkSchema),
});

export type ProfileFormData = z.infer<typeof profileSchema>;