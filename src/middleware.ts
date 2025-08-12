import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/((?!api/login|login|_next|favicon.ico|.*\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)',
  ],
};

export function middleware(req: NextRequest) {
  const session = req.cookies.get('app_session');
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
