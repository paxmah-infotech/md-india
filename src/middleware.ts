import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    pathName.startsWith('/_next') ||
    pathName.startsWith('/assets') ||
    pathName.startsWith('/api/') ||
    pathName.includes('.') ||
    pathName === '/'
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/signin',
    '/auth/register',
    '/auth/request-reset-password',
    '/auth/reset-password',
    '/auth/verifyemail',
  ];

  // If the route is public, allow access
  if (publicRoutes.includes(pathName)) {
    return NextResponse.next();
  }

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Update matcher to only check specific routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/:path*',
    '/admin/:path*',
  ]
};
