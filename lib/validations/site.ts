import { z } from 'zod';

export const telemetryItemSchema = z.object({
  label: z.string().min(1, 'Label is required').max(30, 'Label too long'),
  value: z.string().min(1, 'Value is required').max(50, 'Value too long'),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(100, 'Name too long'),
  tagline: z.string().min(1, 'Tagline is required').max(200, 'Tagline too long'),
  heroStatement: z.string().min(1, 'Hero statement is required').max(200, 'Statement too long'),
  telemetry: z.array(telemetryItemSchema).min(1, 'At least one telemetry item required'),
  maintenanceMode: z.boolean(),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;