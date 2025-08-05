import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from 'next-sanity';

// ============================================================================
// SANITY CLIENT CONFIGURATION
// ============================================================================

// Use the same configuration as defined in sanity/env.ts
const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  apiVersion: '2024-03-20',
  useCdn: true, // Enable CDN for better performance in middleware
  token: process.env.SANITY_API_TOKEN, // Optional: for private datasets
  perspective: 'published',
});

// ============================================================================
// CACHING SYSTEM
// ============================================================================

interface DomainCacheEntry {
  cloneId: string | null;
  cloneName?: string;
  timestamp: number;
  isValid: boolean;
}

// In-memory cache for domain lookups
const domainCache = new Map<string, DomainCacheEntry>();

// Cache TTL constants
const VALID_DOMAIN_TTL = 10 * 60 * 1000; // 10 minutes for valid domains
const INVALID_DOMAIN_TTL = 2 * 60 * 1000; // 2 minutes for invalid domains
const MAX_CACHE_SIZE = 1000; // Prevent memory leaks

/**
 * Clean expired cache entries and manage cache size
 */
function cleanupCache(): void {
  const now = Date.now();
  
  // Remove expired entries using forEach to avoid iterator issues
  domainCache.forEach((entry, domain) => {
    const ttl = entry.isValid ? VALID_DOMAIN_TTL : INVALID_DOMAIN_TTL;
    if (now - entry.timestamp > ttl) {
      domainCache.delete(domain);
    }
  });
  
  // If cache is still too large, remove oldest entries
  if (domainCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(domainCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, domainCache.size - MAX_CACHE_SIZE);
    toRemove.forEach(([domain]) => domainCache.delete(domain));
  }
}

/**
 * Get cached domain lookup result
 */
function getCachedResult(hostname: string): DomainCacheEntry | null {
  const entry = domainCache.get(hostname);
  
  if (!entry) {
    return null;
  }
  
  const now = Date.now();
  const ttl = entry.isValid ? VALID_DOMAIN_TTL : INVALID_DOMAIN_TTL;
  
  if (now - entry.timestamp > ttl) {
    domainCache.delete(hostname);
    return null;
  }
  
  return entry;
}

/**
 * Cache domain lookup result
 */
function setCachedResult(hostname: string, cloneId: string | null, cloneName?: string): void {
  cleanupCache(); // Clean before adding new entry
  
  domainCache.set(hostname, {
    cloneId,
    cloneName,
    timestamp: Date.now(),
    isValid: cloneId !== null,
  });
}

// ============================================================================
// DOMAIN EXTRACTION AND VALIDATION
// ============================================================================

/**
 * Extract hostname from request, handling various edge cases
 */
function extractHostname(request: NextRequest): string {
  // Try x-forwarded-host first (for proxies/load balancers)
  const forwardedHost = request.headers.get('x-forwarded-host');
  if (forwardedHost) {
    return forwardedHost.split(',')[0].trim().toLowerCase();
  }
  
  // Try host header
  const host = request.headers.get('host');
  if (host) {
    return host.toLowerCase();
  }
  
  // Fallback to URL hostname
  return request.nextUrl.hostname.toLowerCase();
}

/**
 * Normalize hostname (remove www prefix, handle ports)
 */
function normalizeHostname(hostname: string): string {
  // Remove port number if present
  const withoutPort = hostname.split(':')[0];
  
  // Remove www prefix
  return withoutPort.replace(/^www\./, '');
}

/**
 * Check if domain should skip middleware processing
 */
function shouldSkipDomain(hostname: string): boolean {
  const skipPatterns = [
    // Development domains
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    // Vercel preview domains
    '.vercel.app',
    // Internal domains
    '.internal',
    '.local',
    // Testing domains
    '.test',
    '.example.com',
  ];
  
  return skipPatterns.some(pattern => 
    pattern.startsWith('.') ? hostname.endsWith(pattern) : hostname === pattern
  );
}

// ============================================================================
// SANITY DOMAIN LOOKUP
// ============================================================================

/**
 * Query Sanity for clone matching the domain
 */
async function findCloneByDomain(hostname: string): Promise<{ cloneId: string; cloneName: string } | null> {
  try {
    const normalizedHostname = normalizeHostname(hostname);
    
    console.log(`[Middleware] Querying Sanity for domain: ${normalizedHostname}`);
    
    const query = `*[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
      cloneId,
      cloneName,
      "domains": metadata.domains
    }`;
    
    const params = { hostname: normalizedHostname };
    
    // Set a timeout for the Sanity request
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('Sanity query timeout')), 3000); // 3 second timeout
    });
    
    const queryPromise = client.fetch(query, params);
    
    const result = await Promise.race([queryPromise, timeoutPromise]);
    
    if (result && result.cloneId?.current) {
      console.log(`[Middleware] Found clone: ${result.cloneName} (${result.cloneId.current}) for domain: ${normalizedHostname}`);
      return {
        cloneId: result.cloneId.current,
        cloneName: result.cloneName,
      };
    }
    
    console.log(`[Middleware] No clone found for domain: ${normalizedHostname}`);
    return null;
    
  } catch (error) {
    console.error(`[Middleware] Error querying Sanity for domain ${hostname}:`, error);
    return null;
  }
}

// ============================================================================
// MAIN MIDDLEWARE FUNCTION
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Extract hostname early for logging
  const hostname = extractHostname(request);
  
  // Log middleware execution for debugging
  console.log(`[Middleware] Processing ${request.method} ${pathname} for ${hostname}`);
  
  try {
    // Skip middleware for development domains
    if (shouldSkipDomain(hostname)) {
      console.log(`[Middleware] Skipping domain: ${hostname}`);
      return NextResponse.next();
    }
    
    // Handle specific routes that need special treatment
    if (pathname.endsWith('/sitemap.xml')) {
      const response = NextResponse.next();
      response.headers.set('Content-Type', 'application/xml; charset=utf-8');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      return response;
    }
    
    if (pathname.endsWith('/robots.txt')) {
      const response = NextResponse.next();
      response.headers.set('Content-Type', 'text/plain; charset=utf-8');
      return response;
    }
    
    // ========================================================================
    // DOMAIN-TO-CLONE RESOLUTION
    // ========================================================================
    
    const normalizedHostname = normalizeHostname(hostname);
    
    // Check cache first
    let cacheResult = getCachedResult(normalizedHostname);
    
    if (cacheResult) {
      console.log(`[Middleware] Cache hit for domain: ${normalizedHostname} -> ${cacheResult.cloneId || 'null'}`);
    } else {
      console.log(`[Middleware] Cache miss for domain: ${normalizedHostname}, querying Sanity...`);
      
      // Query Sanity for domain mapping
      const cloneResult = await findCloneByDomain(hostname);
      
      // Cache the result (whether found or not)
      setCachedResult(
        normalizedHostname,
        cloneResult?.cloneId || null,
        cloneResult?.cloneName
      );
      
      cacheResult = {
        cloneId: cloneResult?.cloneId || null,
        cloneName: cloneResult?.cloneName,
        timestamp: Date.now(),
        isValid: cloneResult !== null,
      };
    }
    
    // Create response with clone context
    const response = NextResponse.next();
    
    // Set clone headers if domain has a matching clone
    if (cacheResult.cloneId) {
      response.headers.set('x-clone-id', cacheResult.cloneId);
      response.headers.set('x-clone-name', cacheResult.cloneName || 'unknown');
      response.headers.set('x-clone-source', 'domain-mapping');
      
      console.log(`[Middleware] Set clone headers: ${cacheResult.cloneId} for domain: ${normalizedHostname}`);
    } else {
      // No clone found, remove any existing clone headers
      response.headers.delete('x-clone-id');
      response.headers.delete('x-clone-name');
      response.headers.delete('x-clone-source');
      
      console.log(`[Middleware] No clone mapping for domain: ${normalizedHostname}`);
    }
    
    // Add cache-busting headers to prevent browser caching issues
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // Add debugging headers in development
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('x-middleware-hostname', hostname);
      response.headers.set('x-middleware-normalized', normalizedHostname);
      response.headers.set('x-middleware-cache', cacheResult ? 'hit' : 'miss');
      response.headers.set('x-middleware-timestamp', new Date().toISOString());
    }
    
    // Set debug headers for troubleshooting
    response.headers.set('x-debug-middleware-executed', 'true');
    response.headers.set('x-debug-hostname', hostname);
    response.headers.set('x-debug-clone-result', cacheResult.cloneId || 'none');
    
    return response;
    
  } catch (error) {
    console.error(`[Middleware] Unexpected error processing ${hostname}${pathname}:`, error);
    
    // Return response without clone headers on error
    const response = NextResponse.next();
    response.headers.set('x-middleware-error', 'true');
    response.headers.set('x-debug-middleware-executed', 'error');
    
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('x-middleware-error-message', error instanceof Error ? error.message : 'Unknown error');
    }
    
    return response;
  }
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     * - studio (Sanity Studio routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}; 