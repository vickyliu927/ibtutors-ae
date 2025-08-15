import { MetadataRoute } from 'next'
import { getCurrentDomainFromHeaders, getCanonicalDomain } from '@/app/lib/sitemapUtils'

// Set revalidation time to 1 hour to match sitemap revalidation
export const revalidate = 3600;

// Add explicit content type to ensure proper rendering
export const contentType = 'text/plain';

export default function robots(): MetadataRoute.Robots {
  try {
    // Get current domain from headers (same logic as sitemap)
    const currentDomain = getCurrentDomainFromHeaders();
    
    let baseUrl: string;
    
    if (currentDomain) {
      // Convert to canonical domain format (with www prefix) to match sitemap
      const canonicalDomain = getCanonicalDomain(currentDomain);
      
      // Determine protocol (assume https for production domains)
      const protocol = canonicalDomain.includes('localhost') || canonicalDomain.includes('127.0.0.1') ? 'http' : 'https';
      baseUrl = `${protocol}://${canonicalDomain}`;
    } else {
      // Fallback to environment variable or default
      baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ibtutors-ae.vercel.app';
      // Remove trailing slash if present
      baseUrl = baseUrl.replace(/\/+$/, '');
    }
    
    console.log(`[Robots] Generated robots.txt for domain: ${currentDomain || 'fallback'}, canonical baseUrl: ${baseUrl}`);
    
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        // Add common SEO optimizations
        disallow: [
          '/api/*',
          '/studio/*',
          '/_next/*',
          '/admin/*',
          '/*.json$',
          '/drafts/*'
        ],
      },
      sitemap: `${baseUrl}/sitemap.xml`,
      // Optional: Add host directive for better SEO
      host: baseUrl,
    }
  } catch (error) {
    console.error('[Robots] Error generating robots.txt:', error);
    
    // Emergency fallback with canonical URL
    const fallbackUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ibtutors-ae.vercel.app';
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${fallbackUrl.replace(/\/+$/, '')}/sitemap.xml`,
    }
  }
} 