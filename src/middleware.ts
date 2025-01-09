import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { rateLimiter } from './utils/rateLimiter';

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

    // Apply rate-limiting
    if (!rateLimiter(clientIp)) {
      console.error(`Rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const pathName = request.nextUrl.pathname;

    // Define routes
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

    // Handle API routes differently
    if (pathName.startsWith('/api/auth')) {
      return NextResponse.next();
    }

    // If user is not authenticated
    if (!token) {
      if (!publicRoutes.includes(pathName)) {
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('callbackUrl', request.url);
        return NextResponse.redirect(signInUrl);
      }
      return NextResponse.next();
    }

    // If user is authenticated
    if (restrictedIfAuthenticatedRoutes.includes(pathName)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/api/auth/:path*',
    '/api/user/:path*',
  ]
};
