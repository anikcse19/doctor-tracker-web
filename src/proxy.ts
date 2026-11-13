import { NextResponse, type NextRequest } from 'next/server';

export const SESSION_COOKIE = 'dt_session';

/**
 * Optimistic route protection: if there is no session cookie at all, redirect to /login
 * before rendering anything. This is a fast UX guard only — the Express API verifies the
 * JWT on every request and is the real security boundary (the secret never lives here).
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const loginUrl = new URL('/login', request.url);
  const next = request.nextUrl.pathname + request.nextUrl.search;
  if (next !== '/') loginUrl.searchParams.set('next', next);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/doctors/:path*', '/patients/:path*'],
};
