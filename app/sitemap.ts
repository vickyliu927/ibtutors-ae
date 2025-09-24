import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { headers } from 'next/headers';
import { getCurrentDomainFromHeaders, getCanonicalDomain, joinUrl, getCloneIdForCurrentDomain } from './lib/sitemapUtils';

// Set revalidation time to 1 hour
export const revalidate = 3600;

function getCanonicalBaseUrl(): string {
  try {
    const domain = getCurrentDomainFromHeaders();
    const canonicalHost = getCanonicalDomain(domain || '');
    const isLocal = canonicalHost.includes('localhost') || canonicalHost.includes('127.0.0.1') || canonicalHost.includes('.local');
    const protocol = isLocal ? 'http' : 'https';
    if (canonicalHost) return `${protocol}://${canonicalHost}`;
  } catch {}
  // Fallback to env or canonical default
  const fallback = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dubaitutors.ae';
  return fallback.replace(/\/+$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get canonical base URL and ensure no trailing slash
    const baseUrl = getCanonicalBaseUrl().replace(/\/+$/, '');
    
    // Resolve clone for current domain
    const cloneId = await getCloneIdForCurrentDomain();
    const isClone = !!cloneId;
    
    // Read page availability flags from the clone
    const flags = isClone ? await client.fetch(
      `*[_type == "clone" && cloneId.current == $cloneId][0]{
        "homepageOnly": homepageOnly == true,
        "subjectOnly": enableSubjectPagesOnly == true,
        "curriculumOnly": enableCurriculumPagesOnly == true
      }`,
      { cloneId }
    ) : { homepageOnly: false, subjectOnly: false, curriculumOnly: false };

    // Fetch subject and curriculum page slugs from Sanity
    // For clones that are not homepageOnly, include clone-specific OR baseline/global pages
    const subjectQuery = isClone ? `*[_type == "subjectPage" && ${flags.homepageOnly || flags.curriculumOnly ? 'false' : 'true'} && isActive == true && defined(slug.current) && slug.current != "gcse1" && (
      cloneReference->cloneId.current == $cloneId || 
      cloneReference->baselineClone == true || 
      !defined(cloneReference)
    )] | order(slug.current asc) {
      "slug": slug.current,
      _updatedAt,
      _id
    }` : `*[_type == "subjectPage" && isActive == true && defined(slug.current) && slug.current != "gcse1" && !defined(cloneReference)] | order(slug.current asc) {
      "slug": slug.current,
      _updatedAt,
      _id
    }`;
    
    const curriculumQuery = isClone ? `*[_type == "curriculumPage" && ${flags.homepageOnly || flags.subjectOnly ? 'false' : 'true'} && isActive == true && defined(slug.current) && slug.current != "gcse1" && (
      cloneReference->cloneId.current == $cloneId || 
      cloneReference->baselineClone == true || 
      !defined(cloneReference)
    )] | order(slug.current asc) {
      "slug": slug.current,
      _updatedAt,
      _id
    }` : `*[_type == "curriculumPage" && isActive == true && defined(slug.current) && slug.current != "gcse1" && !defined(cloneReference)] | order(slug.current asc) {
      "slug": slug.current,
      _updatedAt,
      _id
    }`;
    
    const [subjectPages, curriculumPages] = await Promise.all([
      client.fetch(subjectQuery, { cloneId }),
      client.fetch(curriculumQuery, { cloneId })
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
        url: joinUrl(baseUrl, page.slug),
        lastModified: new Date(page._updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    console.log(`Generated sitemap for ${baseUrl} with ${pages.length} pages (${subjectPages.length} subjects, ${curriculumPages.length} curricula, ${uniquePages.size} unique pages after deduplication)`);
    
    return pages;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to minimal sitemap if there's an error
    const baseUrl = getCanonicalBaseUrl().replace(/\/+$/, '');
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