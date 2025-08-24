import { MetadataRoute } from 'next'
import { headers } from 'next/headers';

function getCurrentDomain(): string {
  try {
    const headersList = headers();
    const host = headersList.get('host');
    
    if (host) {
      // Determine protocol based on host
      const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
      return `${protocol}://${host}`;
    }
  } catch (error) {
    console.log('Could not get headers for robots.txt, using fallback');
  }
  
  // Fallback to environment variable
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://dubaitutors.ae';
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCurrentDomain().replace(/\/+$/, '');
  
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