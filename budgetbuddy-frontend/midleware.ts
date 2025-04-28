import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('auth_token'); // Replace with your auth logic

  const protectedRoutes = ['/dashboard', '/savings', '/ai-assistant'];
  const currentPath = request.nextUrl.pathname;

  if (protectedRoutes.some((route) => currentPath.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/savings/:path*', '/community/:path*'],
};