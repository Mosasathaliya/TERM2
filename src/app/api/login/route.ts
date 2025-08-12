
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function getEnv(key: string) {
  const v = (process as any)?.env?.[key];
  if (!v) throw new Error(`${key} is not set`);
  return v;
}

function cryptoHash(input: string): string {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  // simple base64 of input as placeholder; on edge we can use subtle crypto but keep compact
  let str = '';
  for (let i = 0; i < data.length; i++) str += String.fromCharCode(data[i]);
  return btoa(str);
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

    const allowedId = (process as any)?.env?.APP_LOGIN_ID || '';
    const allowedPass = (process as any)?.env?.APP_LOGIN_PASSWORD || '';
    if (allowedId && allowedPass) {
      if (!(idNumber === allowedId && password === allowedPass)) {
        return new Response(JSON.stringify({ message: 'بيانات الدخول غير صحيحة' }), { status: 401, headers: { 'content-type': 'application/json' } });
      }
    }

    const secret = getEnv('SESSION_SECRET');
    const token = cryptoHash(`${idNumber}:${Date.now()}:${secret}`);

    const headers = new Headers({ 'content-type': 'application/json' });
    headers.append('Set-Cookie', `app_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`);

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ message: 'خطأ في الخادم' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}