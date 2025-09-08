import { MetadataRoute } from 'next'
import { headers } from 'next/headers';
import { getCurrentDomainFromHeaders, getCanonicalDomain } from './lib/sitemapUtils'

function getCanonicalBaseUrl(): string {
  try {
    const domain = getCurrentDomainFromHeaders();
    const canonicalHost = getCanonicalDomain(domain || '');
    const isLocal = canonicalHost.includes('localhost') || canonicalHost.includes('127.0.0.1') || canonicalHost.includes('.local');
    const protocol = isLocal ? 'http' : 'https';
    if (canonicalHost) return `${protocol}://${canonicalHost}`;
  } catch {}
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dubaitutors.ae').replace(/\/+$/, '');
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCanonicalBaseUrl().replace(/\/+$/, '');
  
  console.log(`Generated robots.txt for domain: ${baseUrl}`);
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/*',
        '/studio/*',
        '/_next/*',
        '/admin/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 