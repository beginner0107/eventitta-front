import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard', '/me'];

export function middleware(req: NextRequest) {
  if (PROTECTED.some((p) => req.nextUrl.pathname.startsWith(p))) {
    const token = req.cookies.get('access_token');
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
