import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './client';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export interface UploadResult {
  url: string;
  path: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
  }
  return { valid: true };
}

export function generateStoragePath(type: 'thumbnail' | 'hero' | 'gallery' | 'architecture' | 'avatar', projectId: string, fileName: string): string {
  const timestamp = Date.now();
  const ext = fileName.split('.').pop() || '';
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `projects/${projectId}/${type}/${timestamp}_${cleanName}`;
}

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const storageRef = ref(storage!, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress: UploadProgress = {
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes: snapshot.totalBytes,
          progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        };
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url, path });
      }
    );
  });
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage!, path);
  await deleteObject(storageRef);
}

export async function uploadProjectImages(
  projectId: string,
  files: {
    thumbnail?: File;
    hero?: File;
    gallery?: File[];
    architecture?: File[];
  },
  onProgress?: (type: string, progress: UploadProgress) => void
): Promise<{
  thumbnailUrl?: string;
  heroImageUrl?: string;
  gallery: { url: string; alt: string; caption: string }[];
  architectureUrls: string[];
}> {
  const results = {
    thumbnailUrl: undefined as string | undefined,
    heroImageUrl: undefined as string | undefined,
    gallery: [] as { url: string; alt: string; caption: string }[],
    architectureUrls: [] as string[],
  };

  if (files.thumbnail) {
    const validation = validateFile(files.thumbnail);
    if (!validation.valid) throw new Error(validation.error);
    const path = generateStoragePath('thumbnail', projectId, files.thumbnail.name);
    const { url } = await uploadFile(files.thumbnail, path, (p) => onProgress?.('thumbnail', p));
    results.thumbnailUrl = url;
  }

  if (files.hero) {
    const validation = validateFile(files.hero);
    if (!validation.valid) throw new Error(validation.error);
    const path = generateStoragePath('hero', projectId, files.hero.name);
    const { url } = await uploadFile(files.hero, path, (p) => onProgress?.('hero', p));
    results.heroImageUrl = url;
  }

  if (files.gallery?.length) {
    for (let i = 0; i < files.gallery.length; i++) {
      const file = files.gallery[i];
      const validation = validateFile(file);
      if (!validation.valid) throw new Error(validation.error);
      const path = generateStoragePath('gallery', projectId, `${i}_${file.name}`);
      const { url } = await uploadFile(file, path, (p) => onProgress?.(`gallery_${i}`, p));
      results.gallery.push({ url, alt: file.name, caption: '' });
    }
  }

  if (files.architecture?.length) {
    for (let i = 0; i < files.architecture.length; i++) {
      const file = files.architecture[i];
      const validation = validateFile(file);
      if (!validation.valid) throw new Error(validation.error);
      const path = generateStoragePath('architecture', projectId, `${i}_${file.name}`);
      const { url } = await uploadFile(file, path, (p) => onProgress?.(`architecture_${i}`, p));
      results.architectureUrls.push(url);
    }
  }

  return results;
}