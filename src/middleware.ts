import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { rateLimiter } from './utils/rateLimiter';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  // Apply rate-limiting
  if (!rateLimiter(clientIp)) {
    console.error(`Rate limit exceeded for IP: ${clientIp}`);
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const pathName = request.nextUrl.pathname;

  /**
   * Define public, protected, and restricted routes.
   */
  const publicRoutes = [
    '/auth/signin',
    '/auth/register',
    '/auth/request-reset-password',
    '/auth/reset-password',
    '/auth/verifyemail',
  ];

  const restrictedIfAuthenticatedRoutes = [
    '/auth/signin',
    '/auth/register',
    '/auth/request-reset-password',
    '/auth/reset-password',
    '/auth/verifyemail',
  ];

  // If user is not authenticated:
  if (!token) {
    if (!publicRoutes.includes(pathName)) {
      console.log('Unauthenticated user trying to access protected route.');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    return NextResponse.next(); // Allow public routes for unauthenticated users
  }

  // If user is authenticated:
  if (restrictedIfAuthenticatedRoutes.includes(pathName)) {
    console.log('Authenticated user trying to access a restricted route.');
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to a dashboard or other protected page
  }

  // Allow access to all other routes for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', // Match all admin routes
    '/auth/:path*',  // Match all auth routes
    '/dashboard',    // Match dashboard
    '/profile',      // Match profile
    '/new',       // Match the root route
    '/export'
  ],
};