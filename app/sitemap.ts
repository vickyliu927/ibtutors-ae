import { MetadataRoute } from 'next';
import { cachedFetch } from '@/sanity/lib/queryCache';

interface SubjectPage {
  slug: {
    current: string;
  };
  _updatedAt: string;
}

// Set revalidation time to 1 hour (instead of disabling static generation)
export const revalidate = 3600;

// Helper to join base URL and path without double slashes
function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

// Add explicit content type to ensure proper XML rendering
export const contentType = 'application/xml';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibtutors-ae.vercel.app';
  
  // Get current timestamp for homepage, to ensure it's always fresh
  const currentTimestamp = new Date().toISOString();
  
  // Fetch all subject pages from Sanity with caching (24 hour TTL for sitemap)
  const subjectPages = await cachedFetch<SubjectPage[]>(
    `*[_type == "subjectPage"] {
      slug,
      _updatedAt
    }`,
    {},
    { next: { revalidate: 86400 } }, // 24 hours cache
    24 * 60 * 60 * 1000 // 24 hours TTL
  );

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl.replace(/\/+$/, ''),
      lastModified: new Date(currentTimestamp),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
  ];

  // Dynamic routes for subject pages
  const dynamicRoutes = subjectPages.map((page) => {
    return {
      url: joinUrl(baseUrl, page.slug.current),
      lastModified: new Date(page._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
  });

  console.log(`Sitemap generated at ${currentTimestamp} with ${dynamicRoutes.length} subject pages`);
  
  return [...staticRoutes, ...dynamicRoutes];
} 