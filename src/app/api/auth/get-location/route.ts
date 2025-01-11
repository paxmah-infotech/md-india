import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get client IP from request headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'Unknown';

    // Use a free IP geolocation API
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();

    if (data.status === 'success') {
      return NextResponse.json({
        location: `${data.city || ''}, ${data.regionName || ''}, ${data.country || ''}`.replace(/^, /, ''),
      });
    }

    return NextResponse.json({ location: 'Unknown Location' });
  } catch (error) {
    console.error('Error getting location:', error);
    return NextResponse.json({ location: 'Unknown Location' });
  }
}