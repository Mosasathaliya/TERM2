import { NextRequest } from 'next/server';

export const runtime = 'edge';

async function sha256Base64(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('x-admin-secret');
    const expected = (process as any)?.env?.ADMIN_SEED_SECRET || '';
    if (!expected || auth !== expected) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
    }
    const { id, full_name, password } = await req.json();
    if (!id || !full_name || !password) {
      return new Response(JSON.stringify({ message: 'Missing fields' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    // @ts-ignore
    const db = (globalThis as any)?.process?.env?.DB || (globalThis as any)?.DB || (globalThis as any)?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ message: 'DB not available' }), { status: 500, headers: { 'content-type': 'application/json' } });
    }

    const password_hash = await sha256Base64(password);

    try {
      // @ts-ignore
      await db.prepare('INSERT INTO users (id, full_name, password_hash) VALUES (?, ?, ?)').bind(id, full_name, password_hash).run();
    } catch (e) {
      return new Response(JSON.stringify({ message: 'Insert failed' }), { status: 500, headers: { 'content-type': 'application/json' } });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}