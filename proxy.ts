// File: middleware.ts
// (Formerly proxy.ts - Renamed so Next.js actually runs it)

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  // Match all routes except static files, API routes (except specific ones if needed), and auth routes
  matcher: [
    '/((?!api/auth|api/seed|_next/static|_next/image|favicon.ico|public|signup|login).*)',
  ],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Get the token (more robust than getServerSession in middleware)
  // Secret is automatically read from NEXTAUTH_SECRET env var
  const token = await getToken({ req });

  // 2. Define public routes that don't require auth
  const publicRoutes = ['/', '/about']; 
  const isPublicRoute = publicRoutes.includes(pathname);

  // 3. Redirect to login if not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Role-Based Access Control (RBAC)
  if (token) {
    const userRole = token.role as string;

    // --- Recruiter Route Protection ---
    if (pathname.startsWith('/dashboard/recruiter') || pathname.startsWith('/recruiter')) {
      if (userRole !== 'RECRUITER' && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // --- Admin Route Protection ---
    if (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/admin')) {
      if (userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // --- Redirect logged-in users away from auth pages ---
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}