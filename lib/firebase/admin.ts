import { initializeApp, getApps, cert, deleteApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminAppInstance: App | undefined;
let adminDbInstance: Firestore | undefined;
let adminStorageInstance: Storage | undefined;
let adminAuthInstance: Auth | undefined;
let initError: Error | null = null;
let isInitialized = false;

// Dynamically extract and clean admin credentials at runtime (never top-level cached)
export function getAdminCredentials() {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (privateKey) {
    // Strip surrounding quotes if present
    privateKey = privateKey.replace(/^["']|["']$/g, '').trim();

    // Auto-detect and decode Base64 encoded private keys (common on Vercel/Netlify)
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      try {
        const decoded = Buffer.from(privateKey, 'base64').toString('utf8');
        if (decoded.includes('-----BEGIN PRIVATE KEY-----')) {
          privateKey = decoded;
        }
      } catch {
        // ignore base64 decode failure
      }
    }

    // Normalize escaped \n and Windows CRLF to standard LF
    privateKey = privateKey.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

// Check which admin environment variables are missing
export function getMissingAdminConfig(): string[] {
  const missing: string[] = [];
  const creds = getAdminCredentials();
  if (!creds.projectId) missing.push('FIREBASE_ADMIN_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID)');
  if (!creds.clientEmail) missing.push('FIREBASE_ADMIN_CLIENT_EMAIL');
  if (!creds.privateKey || !creds.privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    missing.push('FIREBASE_ADMIN_PRIVATE_KEY');
  }
  return missing;
}

// Detect if we're in a build environment without valid credentials
export function hasValidCredentials(): boolean {
  const creds = getAdminCredentials();
  return !!(
    creds.projectId &&
    creds.clientEmail &&
    creds.privateKey &&
    creds.privateKey !== 'demo' &&
    !creds.privateKey.includes('DEMO') &&
    creds.privateKey.includes('-----BEGIN PRIVATE KEY-----')
  );
}

// Reset admin instances to recover from stale or unauthenticated states
export function resetAdmin(): void {
  try {
    const apps = getApps();
    for (const app of apps) {
      try {
        deleteApp(app);
      } catch {
        // ignore individual delete failure
      }
    }
  } catch {
    // ignore
  }
  adminAppInstance = undefined;
  adminDbInstance = undefined;
  adminStorageInstance = undefined;
  adminAuthInstance = undefined;
  initError = null;
  isInitialized = false;
}

export function initializeAdmin(): void {
  if (typeof window !== 'undefined') return;

  if (isInitialized && adminAppInstance && adminDbInstance) return;

  if (!hasValidCredentials()) {
    // Do not lock isInitialized to true permanently so credentials can be picked up dynamically
    return;
  }

  const creds = getAdminCredentials();

  try {
    let app: App;
    const existingApps = getApps();
    if (!existingApps.length) {
      app = initializeApp({
        credential: cert({
          projectId: creds.projectId,
          clientEmail: creds.clientEmail,
          privateKey: creds.privateKey,
        }),
        storageBucket:
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
          `${creds.projectId}.firebasestorage.app`,
      });
    } else {
      app = existingApps[0];
    }
    adminAppInstance = app;
    adminDbInstance = getFirestore(app);
    adminStorageInstance = getStorage(app);
    adminAuthInstance = getAuth(app);
    isInitialized = true;
    initError = null;
  } catch (error) {
    initError = error as Error;
    isInitialized = false; // Allow retry on subsequent calls
    console.warn('Firebase Admin SDK initialization failed:', error);
  }
}

// Lazy initialization getters
export function getAdminDb(): Firestore | undefined {
  initializeAdmin();
  return adminDbInstance;
}

export function getAdminStorage(): Storage | undefined {
  initializeAdmin();
  return adminStorageInstance;
}

export function getAdminAuth(): Auth | undefined {
  initializeAdmin();
  return adminAuthInstance;
}

export function getAdminApp(): App | undefined {
  initializeAdmin();
  return adminAppInstance;
}

export function getInitError(): Error | null {
  initializeAdmin();
  return initError;
}

// Backward compatibility - these will trigger lazy init
export const adminDb = new Proxy({} as Firestore, {
  get(target, prop) {
    const db = getAdminDb();
    if (!db) throw new Error('Firebase Admin not initialized - missing valid credentials');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (db as any)[prop];
  }
});

export const adminStorage = new Proxy({} as Storage, {
  get(target, prop) {
    const storage = getAdminStorage();
    if (!storage) throw new Error('Firebase Admin not initialized - missing valid credentials');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (storage as any)[prop];
  }
});

export const adminAuth = new Proxy({} as Auth, {
  get(target, prop) {
    const auth = getAdminAuth();
    if (!auth) throw new Error('Firebase Admin not initialized - missing valid credentials');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (auth as any)[prop];
  }
});

export const adminApp = new Proxy({} as App, {
  get(target, prop) {
    const app = getAdminApp();
    if (!app) throw new Error('Firebase Admin not initialized - missing valid credentials');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (app as any)[prop];
  }
});

export default adminApp;