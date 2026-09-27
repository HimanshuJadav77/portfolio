import { Timestamp } from 'firebase/firestore';

export interface TelemetryItem {
  label: string;
  value: string;
}

export interface SiteSettings {
  id?: string;
  siteName: string;
  tagline: string;
  heroStatement: string;
  telemetry: TelemetryItem[];
  maintenanceMode: boolean;
  updatedAt: Timestamp | Date;
}

export interface SiteSettingsFormData {
  siteName: string;
  tagline: string;
  heroStatement: string;
  telemetry: TelemetryItem[];
  maintenanceMode: boolean;
}