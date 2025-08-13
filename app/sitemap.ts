import { MetadataRoute } from 'next';
import { 
  getCurrentDomainFromHeaders, 
  generateSitemapForDomain,
  getCloneIdForCurrentDomain 
} from '@/app/lib/sitemapUtils';

// Set revalidation time to 1 hour (instead of disabling static generation)
export const revalidate = 3600;

// Add explicit content type to ensure proper XML rendering
export const contentType = 'application/xml';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get current domain from headers
    const currentDomain = getCurrentDomainFromHeaders();
    
    if (!currentDomain) {
      // Fallback to default domain if we can't determine current domain
      const fallbackDomain = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '') || 'ibtutors-ae.vercel.app';
      console.log('No domain found in headers, using fallback:', fallbackDomain);
      return await generateSitemapForDomain(fallbackDomain);
    }

    // Generate sitemap for the current domain
    const cloneId = await getCloneIdForCurrentDomain();
    console.log(`Generating sitemap for domain: ${currentDomain}, clone: ${cloneId || 'global'}`);
    
    return await generateSitemapForDomain(currentDomain);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Emergency fallback - return minimal sitemap
    const fallbackDomain = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibtutors-ae.vercel.app';
    return [
      {
        url: fallbackDomain,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
      },
    ];
  }
} 