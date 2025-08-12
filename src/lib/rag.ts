'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';

export interface StoredLessonRag {
  lesson_id: string;
  arabic_explanation: string;
  examples: Array<{ english: string; arabic: string; imagePrompt?: string }>;
  additional_notes_arabic?: string | null;
  common_mistakes_arabic?: string | null;
  updated_at: string;
}

export interface StoredExtraRag {
  id: string; // ai lesson id
  explanation: string; // Arabic with embedded English examples
  imageUrls: string[];
  updated_at: string;
}

// In-memory fallback for local dev without KV binding
const memoryStore = new Map<string, any>();

function getKv() {
  try {
    const env: any = getRequestContext().env;
    return env?.LESSON_RAG as KVNamespace | undefined;
  } catch {
    return undefined;
  }
}

export async function getLessonRag(lessonId: string): Promise<StoredLessonRag | null> {
  const kv = getKv();
  const key = `lesson:${lessonId}`;
  if (kv) {
    const json = await kv.get(key);
    return json ? (JSON.parse(json) as StoredLessonRag) : null;
  }
  return memoryStore.get(key) ?? null;
}

export async function putLessonRag(data: StoredLessonRag): Promise<void> {
  const kv = getKv();
  const key = `lesson:${data.lesson_id}`;
  const value = JSON.stringify(data);
  if (kv) {
    await kv.put(key, value, { expirationTtl: 60 * 60 * 24 * 365 });
    return;
  }
  memoryStore.set(key, data);
}

export async function getExtraRag(id: string): Promise<StoredExtraRag | null> {
  const kv = getKv();
  const key = `extra:${id}`;
  if (kv) {
    const json = await kv.get(key);
    return json ? (JSON.parse(json) as StoredExtraRag) : null;
  }
  return memoryStore.get(key) ?? null;
}

export async function putExtraRag(data: StoredExtraRag): Promise<void> {
  const kv = getKv();
  const key = `extra:${data.id}`;
  const value = JSON.stringify(data);
  if (kv) {
    await kv.put(key, value, { expirationTtl: 60 * 60 * 24 * 365 });
    return;
  }
  memoryStore.set(key, data);
}