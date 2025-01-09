import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { rateLimiter } from './utils/rateLimiter';

export async function middleware(request: NextRequest) {
  try {
    const pathName = request.nextUrl.pathname;

    // Skip middleware for static files and API routes
    if (
      pathName.startsWith('/_next') || // Skip Next.js static files
      pathName.startsWith('/assets') || // Skip assets
      pathName.startsWith('/api/auth') || // Skip auth API routes
      pathName.includes('.') // Skip files with extensions (images, etc.)
    ) {
      return NextResponse.next();
    }

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
    '/((?!_next/static|_next/image|favicon.ico|assets/).*)',
  ]
};
