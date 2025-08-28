import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 인증이 필요한 보호된 라우트들
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/meetings/create', '/community/create', '/me'];

// 인증된 사용자가 접근하면 안되는 라우트들 (로그인, 회원가입)
const AUTH_ROUTES = ['/auth/login', '/auth/signup'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('access_token');
  const isAuthenticated = !!token;

  // 보호된 라우트에 비인증 사용자가 접근하는 경우
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 인증된 사용자가 로그인/회원가입 페이지에 접근하는 경우
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const from = req.nextUrl.searchParams.get('from') || '/';
      const url = req.nextUrl.clone();
      url.pathname = from;
      url.searchParams.delete('from');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack-hmr (webpack hot reload)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - sitemap.xml, robots.txt (SEO files)
     */
    '/((?!api|_next|favicon.ico|public|sitemap.xml|robots.txt).*)',
  ],
};
