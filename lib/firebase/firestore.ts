import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './client';
import { Project, Skill, Experience, Profile, SiteSettings } from '@/types';

const COLLECTIONS = {
  projects: 'projects',
  skills: 'skills',
  experience: 'experience',
  profile: 'profile',
  siteSettings: 'site_settings',
} as const;

function convertDoc<T>(doc: QueryDocumentSnapshot<DocumentData>): T {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
  } as T;
}

export async function getPublishedProjects(): Promise<Project[]> {
  const q = query(
    collection(db!, COLLECTIONS.projects),
    where('published', '==', true),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertDoc<Project>);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const q = query(
    collection(db!, COLLECTIONS.projects),
    where('published', '==', true),
    where('featured', '==', true),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertDoc<Project>);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const q = query(
    collection(db!, COLLECTIONS.projects),
    where('slug', '==', slug),
    where('published', '==', true),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return convertDoc<Project>(snapshot.docs[0]);
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  const q = query(
    collection(db!, COLLECTIONS.projects),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertDoc<Project>);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const docRef = doc(db!, COLLECTIONS.projects, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return convertDoc<Project>(snapshot);
}

export async function getSkills(): Promise<Skill[]> {
  const q = query(
    collection(db!, COLLECTIONS.skills),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertDoc<Skill>);
}

export async function getSkillsByCategory(category: Skill['category']): Promise<Skill[]> {
  const q = query(
    collection(db!, COLLECTIONS.skills),
    where('category', '==', category),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertDoc<Skill>);
}

export async function getExperience(): Promise<Experience[]> {
  const q = query(
    collection(db!, COLLECTIONS.experience),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertDoc<Experience>);
}

export async function getProfile(): Promise<Profile | null> {
  const q = query(
    collection(db!, COLLECTIONS.profile),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return convertDoc<Profile>(snapshot.docs[0]);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const q = query(
    collection(db!, COLLECTIONS.siteSettings),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return convertDoc<SiteSettings>(snapshot.docs[0]);
}