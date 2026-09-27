import { z } from 'zod';

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required').max(100, 'Company name too long'),
  role: z.string().min(1, 'Role is required').max(100, 'Role name too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  type: z.enum(['full-time', 'contract', 'internship', 'freelance']),
  startDate: z.date({ message: 'Start date is required' }),
  endDate: z.date().nullable().optional(),
  current: z.boolean(),
  description: z.string().min(1, 'Description is required'),
  technologies: z.string().min(1, 'At least one technology is required'),
  highlights: z.string().min(1, 'At least one highlight is required'),
  order: z.number().int().min(0),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;