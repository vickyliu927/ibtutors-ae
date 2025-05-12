import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Specifically handle sitemap.xml
  if (pathname.endsWith('/sitemap.xml')) {
    // Clone the response
    const response = NextResponse.next();
    
    // Add XML content type header
    response.headers.set('Content-Type', 'application/xml; charset=utf-8');
    
    // Disable any middleware that might inject styles
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    return response;
  }
  
  return NextResponse.next();
}

// Only run middleware on sitemap and robots routes
export const config = {
  matcher: ['/sitemap.xml', '/robots.txt'],
}; 