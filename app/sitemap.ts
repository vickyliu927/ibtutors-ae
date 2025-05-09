import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

interface SubjectPage {
  slug: {
    current: string;
  };
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibtutors-ae.vercel.app';
  
  // Fetch all subject pages from Sanity
  const subjectPages = await client.fetch<SubjectPage[]>(`
    *[_type == "subjectPage"] {
      slug,
      _updatedAt
    }
  `);

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
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

  return [...staticRoutes, ...dynamicRoutes];
} 