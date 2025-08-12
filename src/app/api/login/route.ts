
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function getEnv(key: string) {
  const v = (process as any)?.env?.[key];
  if (!v) throw new Error(`${key} is not set`);
  return v;
}

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
    const { idNumber, password, acceptedTerms } = await req.json();
    if (!idNumber || !password) {
      return new Response(JSON.stringify({ message: 'بيانات ناقصة' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    if (!acceptedTerms) {
      return new Response(JSON.stringify({ message: 'يجب الموافقة على الشروط والأحكام' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    // D1 binding is available as env.DB in Edge
    // @ts-ignore
    const db = (globalThis as any)?.process?.env?.DB || (globalThis as any)?.DB || (globalThis as any)?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ message: 'قاعدة البيانات غير متاحة' }), { status: 500, headers: { 'content-type': 'application/json' } });
    }

    const passHash = await sha256Base64(password);

    // Query user by id
    // D1 API in Edge Functions: env.DB.prepare(sql).bind(...).first()
    let user: any = null;
    try {
      // @ts-ignore
      const stmt = db.prepare('SELECT id, full_name, password_hash FROM users WHERE id = ?');
      // @ts-ignore
      user = await stmt.bind(idNumber).first();
    } catch (e) {
      // In case of API difference, try .all()
      try {
        // @ts-ignore
        const stmt2 = db.prepare('SELECT id, full_name, password_hash FROM users WHERE id = ?');
        // @ts-ignore
        const res = await stmt2.bind(idNumber).all();
        user = res?.results?.[0] || null;
      } catch {}
    }

    if (!user || user.password_hash !== passHash) {
      return new Response(JSON.stringify({ message: 'بيانات الدخول غير صحيحة' }), { status: 401, headers: { 'content-type': 'application/json' } });
    }

    const secret = getEnv('SESSION_SECRET');
    const token = await sha256Base64(`${user.id}:${Date.now()}:${secret}`);

    const headers = new Headers({ 'content-type': 'application/json' });
    headers.append('Set-Cookie', `app_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`);

    return new Response(JSON.stringify({ ok: true, user: { id: user.id, full_name: user.full_name } }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ message: 'خطأ في الخادم' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
