import { cache } from 'react';
import { Project, Skill, Experience, Profile, SiteSettings } from '@/types';
import { getAdminDb, resetAdmin } from './admin';
import type { DocumentSnapshot, QueryDocumentSnapshot, Firestore } from 'firebase-admin/firestore';
import {
  FALLBACK_PROJECTS,
  FALLBACK_PROFILE,
  FALLBACK_SITE_SETTINGS,
  FALLBACK_SKILLS,
  FALLBACK_EXPERIENCE,
} from './fallback-data';

// Quota exhaustion cooldown to prevent hammering Firestore when the 50k free tier limit is reached
let quotaExhaustedUntil = 0;
let hasWarnedQuota = false;

// Recursively serialize Firestore timestamps to native Date objects for React Server Components
function serializeFirestoreData<T>(data: unknown): T {
  if (data === null || data === undefined) return data as T;
  
  if (typeof data === 'object' && 'toDate' in data && typeof (data as { toDate: () => unknown }).toDate === 'function') {
    return (data as { toDate: () => unknown }).toDate() as T;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => serializeFirestoreData(item)) as unknown as T;
  }
  
  if (typeof data === 'object' && (data.constructor === Object || !data.constructor)) {
    const serialized: Record<string, unknown> = {};
    const obj = data as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      serialized[key] = serializeFirestoreData(obj[key]);
    }
    return serialized as T;
  }
  
  return data as T;
}

function convertDoc<T>(doc: DocumentSnapshot | QueryDocumentSnapshot): T {
  const data = doc.data();
  const serialized = serializeFirestoreData<Record<string, unknown>>(data) || {};
  return {
    id: doc.id,
    ...serialized,
  } as T;
}

// Helper to execute query with automatic recovery on UNAUTHENTICATED or RESOURCE_EXHAUSTED
async function withRetry<T>(queryFn: (db: Firestore) => Promise<T>, fallback: T): Promise<T> {
  // If Firestore quota was recently exceeded, serve from fallback without network delay
  if (Date.now() < quotaExhaustedUntil) {
    return fallback;
  }

  const db = getAdminDb();
  if (!db) return fallback;

  try {
    return await queryFn(db);
  } catch (error: any) {
    const isQuotaError =
      error?.code === 8 ||
      error?.message?.includes('8 RESOURCE_EXHAUSTED') ||
      error?.message?.includes('RESOURCE_EXHAUSTED') ||
      error?.message?.includes('Quota exceeded');

    if (isQuotaError) {
      quotaExhaustedUntil = Date.now() + 5 * 60 * 1000; // 5-minute cooldown before retrying
      if (!hasWarnedQuota) {
        console.warn('⚠️ [Firestore] Free tier daily read quota exceeded (50k limit). Serving seamlessly from resilient snapshot.');
        hasWarnedQuota = true;
      }
      return fallback;
    }

    const isAuthError =
      error?.code === 16 ||
      error?.message?.includes('16 UNAUTHENTICATED') ||
      error?.message?.includes('UNAUTHENTICATED') ||
      error?.message?.includes('invalid authentication credentials');

    if (isAuthError) {
      console.warn('Firestore encountered UNAUTHENTICATED. Resetting admin instance and retrying with fresh credentials...');
      resetAdmin();
      const freshDb = getAdminDb();
      if (freshDb) {
        try {
          return await queryFn(freshDb);
        } catch (retryError) {
          console.error('Firestore retry failed:', retryError);
          return fallback;
        }
      }
    }

    console.error('Firestore query error:', error);
    return fallback;
  }
}

// ============================================
// PROJECTS
// ============================================

export const getPublishedProjects = cache(async (): Promise<Project[]> => {
  return withRetry(async (db) => {
    const snapshot = await db.collection('projects')
      .where('published', '==', true)
      .get();
    if (snapshot.empty) return FALLBACK_PROJECTS;
    return snapshot.docs
      .map(doc => convertDoc<Project>(doc))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, FALLBACK_PROJECTS);
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const fallback = FALLBACK_PROJECTS.filter(p => p.featured);
  return withRetry(async (db) => {
    const snapshot = await db.collection('projects')
      .where('featured', '==', true)
      .get();
    if (snapshot.empty) return fallback;
    return snapshot.docs
      .map(doc => convertDoc<Project>(doc))
      .filter(p => p.published)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, fallback);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const fallback = FALLBACK_PROJECTS.find(p => p.slug === slug) || null;
  return withRetry(async (db) => {
    const snapshot = await db.collection('projects')
      .where('slug', '==', slug)
      .where('published', '==', true)
      .limit(1)
      .get();
    if (snapshot.empty) return fallback;
    return convertDoc<Project>(snapshot.docs[0]);
  }, fallback);
});

export const getAllProjectsAdmin = cache(async (): Promise<Project[]> => {
  return withRetry(async (db) => {
    const snapshot = await db.collection('projects').get();
    if (snapshot.empty) return FALLBACK_PROJECTS;
    return snapshot.docs
      .map(doc => convertDoc<Project>(doc))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, FALLBACK_PROJECTS);
});

export const getProjectById = cache(async (id: string): Promise<Project | null> => {
  const fallback = FALLBACK_PROJECTS.find(p => p.id === id || p.slug === id) || null;
  return withRetry(async (db) => {
    const doc = await db.collection('projects').doc(id).get();
    if (doc.exists) return convertDoc<Project>(doc);
    const bySlug = await db.collection('projects').where('slug', '==', id).limit(1).get();
    if (!bySlug.empty) return convertDoc<Project>(bySlug.docs[0]);
    return fallback;
  }, fallback);
});

// ============================================
// SKILLS
// ============================================

export const getSkills = cache(async (): Promise<Skill[]> => {
  return withRetry(async (db) => {
    const snapshot = await db.collection('skills').get();
    if (snapshot.empty) return FALLBACK_SKILLS;
    return snapshot.docs
      .map(doc => convertDoc<Skill>(doc))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, FALLBACK_SKILLS);
});

export const getSkillsByCategory = cache(async (category: Skill['category']): Promise<Skill[]> => {
  const fallback = FALLBACK_SKILLS.filter(s => s.category === category);
  return withRetry(async (db) => {
    const snapshot = await db.collection('skills')
      .where('category', '==', category)
      .get();
    if (snapshot.empty) return fallback;
    return snapshot.docs
      .map(doc => convertDoc<Skill>(doc))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, fallback);
});

// ============================================
// EXPERIENCE
// ============================================

export const getExperience = cache(async (): Promise<Experience[]> => {
  return withRetry(async (db) => {
    const snapshot = await db.collection('experience').get();
    if (snapshot.empty) return FALLBACK_EXPERIENCE;
    return snapshot.docs
      .map(doc => convertDoc<Experience>(doc))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, FALLBACK_EXPERIENCE);
});

// ============================================
// PROFILE
// ============================================

export const getProfile = cache(async (): Promise<Profile | null> => {
  return withRetry(async (db) => {
    const doc = await db.collection('profile').doc('main').get();
    if (doc.exists) {
      return convertDoc<Profile>(doc);
    }
    const snapshot = await db.collection('profile').limit(1).get();
    if (!snapshot.empty) {
      return convertDoc<Profile>(snapshot.docs[0]);
    }
    return FALLBACK_PROFILE;
  }, FALLBACK_PROFILE);
});

// ============================================
// SITE SETTINGS
// ============================================

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  return withRetry(async (db) => {
    const doc = await db.collection('site_settings').doc('main').get();
    if (doc.exists) {
      return convertDoc<SiteSettings>(doc);
    }
    return FALLBACK_SITE_SETTINGS;
  }, FALLBACK_SITE_SETTINGS);
});