import { MetadataRoute } from 'next';
import { cachedFetch } from '@/sanity/lib/queryCache';

interface SubjectPage {
  slug: {
    current: string;
  };
  _updatedAt: string;
}

interface CurriculumPage {
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
  
  // Get all subject pages
  const subjectPages = await cachedFetch<SubjectPage[]>(
    '*[_type == "subjectPage"] { slug, _updatedAt }'
  );

  // Get all curriculum pages
  const curriculumPages = await cachedFetch<CurriculumPage[]>(
    '*[_type == "curriculumPage"] { slug, _updatedAt }'
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

  // Create URLs for each subject page
  const subjectUrls: MetadataRoute.Sitemap = subjectPages.map((page) => ({
    url: joinUrl(baseUrl, page.slug.current),
    lastModified: new Date(page._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Create URLs for each curriculum page
  const curriculumUrls: MetadataRoute.Sitemap = curriculumPages.map((page) => ({
    url: joinUrl(baseUrl, `curriculum/${page.slug.current}`),
    lastModified: new Date(page._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  console.log(`Sitemap generated at ${currentTimestamp} with ${subjectUrls.length + curriculumUrls.length} subject and curriculum pages`);
  
  return [...staticRoutes, ...subjectUrls, ...curriculumUrls];
} 