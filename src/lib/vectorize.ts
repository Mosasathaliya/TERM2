'use server';

import { runAi } from '@/lib/cloudflare-ai';
import { ensureEnv } from '@/lib/utils';
import { learningItems } from '@/lib/lessons';

type VectorRecord = {
  id: string;
  values: number[];
  metadata?: Record<string, any>;
};

const getAccount = () => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN;
  const index = process.env.VECTORIZE_INDEX || 'term2';
  return { accountId, apiToken, index };
};

async function embed(texts: string[]): Promise<number[][]> {
  // Cloudflare Workers AI embedding model (768 dims)
  const response = await runAi({
    model: '@cf/baai/bge-base-en-v1.5',
    inputs: {
      text: texts,
    },
  });
  const json = await response.json();
  // Returned format: { result: { data: [{ embedding: number[] }, ...] } } or similar
  const vectors: number[][] = (json.result?.data || json.result || [])
    .map((d: any) => d.embedding || d.vector || d.values)
    .filter(Boolean);
  return vectors;
}

export async function vectorizeUpsert(records: { id: string; text: string; metadata?: Record<string, any> }[]) {
  ensureEnv('CLOUDFLARE_API_TOKEN');
  const { accountId, apiToken, index } = getAccount();
  if (!accountId || !apiToken) throw new Error('Missing Cloudflare account or token');

  const vectors = await embed(records.map((r) => r.text));
  const payload: { vectors: VectorRecord[] } = {
    vectors: records.map((r, i) => ({ id: r.id, values: vectors[i], metadata: r.metadata })),
  };

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/indexes/${index}/upsert`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vectorize upsert failed: ${res.status} ${err}`);
  }
}

export async function vectorizeQuery(query: string, topK = 10) {
  ensureEnv('CLOUDFLARE_API_TOKEN');
  const { accountId, apiToken, index } = getAccount();
  if (!accountId || !apiToken) throw new Error('Missing Cloudflare account or token');

  const [qvec] = await embed([query]);
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/indexes/${index}/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vector: qvec, topK }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vectorize query failed: ${res.status} ${err}`);
  }
  const json = await res.json();
  return json.result?.matches || [];
}

export async function seedLearningItemsToVectorize() {
  const records = learningItems.map((item) => ({
    id: Buffer.from(item.title).toString('base64').slice(0, 64),
    text: `${item.title}\n${item.type === 'lesson' ? item.explanation : item.content}`,
    metadata: { title: item.title, type: item.type },
  }));
  await vectorizeUpsert(records);
}
