import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

interface SubjectPage {
  slug: {
    current: string;
  };
  _updatedAt: string;
}

// Disable static generation and force sitemap to be dynamic
export const revalidate = 0;

// Add explicit content type to ensure proper XML rendering
export const contentType = 'application/xml';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibtutors-ae.vercel.app';
  
  // Get current timestamp for homepage, to ensure it's always fresh
  const currentTimestamp = new Date().toISOString();
  
  // Fetch all subject pages from Sanity, with cache override to ensure fresh data
  const subjectPages = await client.fetch<SubjectPage[]>(
    `*[_type == "subjectPage"] {
      slug,
      _updatedAt
    }`,
    {},
    { cache: 'no-store' } // Always fetch fresh data
  );

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(currentTimestamp),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(currentTimestamp),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Dynamic routes for subject pages
  const dynamicRoutes = subjectPages.map((page) => {
    return {
      url: `${baseUrl}/${page.slug.current}`,
      lastModified: new Date(page._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
  });

  console.log(`Sitemap generated at ${currentTimestamp} with ${dynamicRoutes.length} subject pages`);
  
  return [...staticRoutes, ...dynamicRoutes];
} 