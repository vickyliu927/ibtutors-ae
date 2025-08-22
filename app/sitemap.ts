import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// Set revalidation time to 1 hour
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get the base URL for the current domain
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dubaitutors.ae';
    
    // Fetch all subject and curriculum page slugs from Sanity
    const subjectQuery = `*[_type == "subjectPage" && defined(slug.current)] | order(slug.current asc) {
      "slug": slug.current,
      _updatedAt,
      _id
    }`;
    
    const curriculumQuery = `*[_type == "curriculumPage" && defined(slug.current)] | order(slug.current asc) {
      "slug": slug.current,
      _updatedAt,
      _id
    }`;
    
    const [subjectPages, curriculumPages] = await Promise.all([
      client.fetch(subjectQuery),
      client.fetch(curriculumQuery)
    ]);

    // Start with homepage
    const pages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];

    // Combine all pages and remove duplicates by slug
    const allPages = [...subjectPages, ...curriculumPages];
    const uniquePages = new Map();
    
    // Keep only the latest version of each slug
    allPages.forEach((page: any) => {
      const existingPage = uniquePages.get(page.slug);
      if (!existingPage || new Date(page._updatedAt) > new Date(existingPage._updatedAt)) {
        uniquePages.set(page.slug, page);
      }
    });

    // Add unique pages to sitemap
    uniquePages.forEach((page: any) => {
      pages.push({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page._updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    console.log(`Generated sitemap with ${pages.length} pages (${subjectPages.length} subjects, ${curriculumPages.length} curricula, ${uniquePages.size} unique pages after deduplication)`);
    
    return pages;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to minimal sitemap if there's an error
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dubaitutors.ae';
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
    ];
  }
} 