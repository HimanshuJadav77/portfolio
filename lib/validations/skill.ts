import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  category: z.enum(['frontend', 'backend', 'mobile', 'devops', 'other']),
  icon: z.string().optional(),
  proficiency: z.number().int().min(1).max(5),
  relatedProjects: z.array(z.string()),
  order: z.number().int().min(0),
});

export type SkillFormData = z.infer<typeof skillSchema>;