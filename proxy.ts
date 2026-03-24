import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

const PROTECTED_ROUTES = ['/lobby', '/slot', '/history', '/wallet'];
const AUTH_ROUTES = ['/login', '/register'];

export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient(req, res);

  const path = req.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((r) => path.startsWith(r));
  const isAuth = AUTH_ROUTES.some((r) => path.startsWith(r));

  // Session check is done via cookies synchronously in proxy context
  // Full auth validation happens in route handlers/server components
  const hasAuthCookie = req.cookies.getAll().some((c) => c.name.includes('auth-token'));

  if (isProtected && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuth && hasAuthCookie) {
    return NextResponse.redirect(new URL('/lobby', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
