import { MetadataRoute } from 'next';
import { cachedFetch } from '@/sanity/lib/queryCache';
import { headers } from 'next/headers';

export interface DomainCloneMapping {
  domain: string;
  cloneId: string;
  cloneName: string;
}

export interface SitemapPage {
  slug: {
    current: string;
  };
  _updatedAt: string;
  cloneReference?: {
    cloneId: {
      current: string;
    };
  };
}

// Helper to join base URL and path without double slashes
export function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

/**
 * Get all domain-to-clone mappings from Sanity
 */
export async function getAllDomainMappings(): Promise<DomainCloneMapping[]> {
  const clones = await cachedFetch<Array<{
    cloneId: { current: string };
    cloneName: string;
    metadata: { domains: string[] };
    isActive: boolean;
  }>>(
    `*[_type == "clone" && isActive == true] {
      cloneId,
      cloneName,
      "metadata": metadata,
      isActive
    }`,
    {},
    { next: { revalidate: 3600, tags: ['clone-mappings', 'sitemap-data'] } }
  );

  const mappings: DomainCloneMapping[] = [];
  
  clones.forEach(clone => {
    if (clone.metadata?.domains) {
      clone.metadata.domains.forEach(domain => {
        mappings.push({
          domain: domain.toLowerCase(),
          cloneId: clone.cloneId.current,
          cloneName: clone.cloneName
        });
      });
    }
  });

  return mappings;
}

/**
 * Get the current domain from headers
 */
export function getCurrentDomainFromHeaders(): string {
  try {
    const headersList = headers();
    const forwardedHost = headersList.get('x-forwarded-host');
    const host = headersList.get('host');
    const domain = (forwardedHost || host || '').toLowerCase();
    
    // Extract domain without port
    const cleanDomain = domain.split(',')[0].trim().split(':')[0];
    
    // Remove www prefix for consistency
    return cleanDomain.replace(/^www\./, '');
  } catch (error) {
    console.error('Error getting domain from headers:', error);
    return '';
  }
}

/**
 * Get clone ID for the current domain
 */
export async function getCloneIdForCurrentDomain(): Promise<string | null> {
  try {
    // First try middleware headers
    const headersList = headers();
    const cloneId = headersList.get('x-clone-id');
    if (cloneId) {
      return cloneId;
    }

    // Fallback to domain lookup
    const currentDomain = getCurrentDomainFromHeaders();
    if (!currentDomain) {
      return null;
    }

    const mappings = await getAllDomainMappings();
    const mapping = mappings.find(m => 
      m.domain === currentDomain || 
      m.domain === `www.${currentDomain}`
    );

    return mapping?.cloneId || null;
  } catch (error) {
    console.error('Error getting clone ID for current domain:', error);
    return null;
  }
}

/**
 * Get all pages for a specific clone
 */
export async function getPagesForClone(cloneId: string | null): Promise<{
  subjectPages: SitemapPage[];
  curriculumPages: SitemapPage[];
}> {
  let subjectQuery: string;
  let curriculumQuery: string;

  if (cloneId) {
    // Get clone-specific or global pages
    subjectQuery = `*[_type == "subjectPage" && isActive == true && slug.current != "gcse1" && (
      cloneReference->cloneId.current == $cloneId || 
      !defined(cloneReference)
    )] { slug, _updatedAt, cloneReference }`;
    
    curriculumQuery = `*[_type == "curriculumPage" && isActive == true && slug.current != "gcse1" && (
      cloneReference->cloneId.current == $cloneId || 
      !defined(cloneReference)
    )] { slug, _updatedAt, cloneReference }`;
  } else {
    // Get only global pages (no clone reference)
    subjectQuery = `*[_type == "subjectPage" && isActive == true && slug.current != "gcse1" && !defined(cloneReference)] { slug, _updatedAt }`;
    curriculumQuery = `*[_type == "curriculumPage" && isActive == true && slug.current != "gcse1" && !defined(cloneReference)] { slug, _updatedAt }`;
  }

  const [subjectPages, curriculumPages] = await Promise.all([
    cachedFetch<SitemapPage[]>(
      subjectQuery, 
      { cloneId },
      { next: { revalidate: 3600, tags: ['subject-pages', 'sitemap-data'] } }
    ),
    cachedFetch<SitemapPage[]>(
      curriculumQuery, 
      { cloneId },
      { next: { revalidate: 3600, tags: ['curriculum-pages', 'sitemap-data'] } }
    )
  ]);

  return {
    subjectPages: subjectPages || [],
    curriculumPages: curriculumPages || []
  };
}

/**
 * Convert domain to canonical format with www prefix
 */
export function getCanonicalDomain(domain: string): string {
  // Remove any existing www prefix first
  const cleanDomain = domain.replace(/^www\./, '');
  
  // Skip adding www for localhost and IP addresses
  if (cleanDomain.includes('localhost') || cleanDomain.includes('127.0.0.1') || cleanDomain.includes('.local')) {
    return cleanDomain;
  }
  
  // Add www prefix for production domains to create canonical URLs
  return `www.${cleanDomain}`;
}

/**
 * Generate sitemap for a specific domain
 */
export async function generateSitemapForDomain(domain: string): Promise<MetadataRoute.Sitemap> {
  // Convert to canonical domain format (with www prefix)
  const canonicalDomain = getCanonicalDomain(domain);
  
  // Determine protocol (assume https for production domains)
  const protocol = canonicalDomain.includes('localhost') || canonicalDomain.includes('127.0.0.1') ? 'http' : 'https';
  const baseUrl = `${protocol}://${canonicalDomain}`;
  
  // Get clone ID for this domain (match both www and non-www versions)
  const mappings = await getAllDomainMappings();
  const cleanDomain = domain.replace(/^www\./, '').toLowerCase();
  const mapping = mappings.find(m => {
    const mappingDomain = m.domain.replace(/^www\./, '').toLowerCase();
    return mappingDomain === cleanDomain;
  });
  
  const cloneId = mapping?.cloneId || null;
  
  // Get pages for this clone
  const { subjectPages, curriculumPages } = await getPagesForClone(cloneId);
  
  // Get current timestamp for homepage
  const currentTimestamp = new Date().toISOString();
  
  // Static routes with enhanced metadata
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(currentTimestamp),
      changeFrequency: 'daily' as const,  // Homepage changes more frequently
      priority: 1.0,
    },
  ];

  // Create URLs for each subject page with enhanced metadata
  const subjectUrls: MetadataRoute.Sitemap = subjectPages.map((page) => ({
    url: joinUrl(baseUrl, page.slug.current),
    lastModified: new Date(page._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,  // Subject pages are important but less than homepage
  }));

  // Create URLs for each curriculum page with enhanced metadata
  const curriculumUrls: MetadataRoute.Sitemap = curriculumPages.map((page) => ({
    url: joinUrl(baseUrl, page.slug.current),
    lastModified: new Date(page._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,  // Curriculum pages same priority as subject pages
  }));

  console.log(`Generated sitemap for ${canonicalDomain} (clone: ${cloneId || 'global'}) with ${subjectUrls.length + curriculumUrls.length} pages`);
  
  return [...staticRoutes, ...subjectUrls, ...curriculumUrls];
}

/**
 * Generate sitemaps for all domains
 */
export async function generateAllSitemaps(): Promise<Record<string, MetadataRoute.Sitemap>> {
  const mappings = await getAllDomainMappings();
  const sitemaps: Record<string, MetadataRoute.Sitemap> = {};
  
  // Generate sitemap for each domain
  for (const mapping of mappings) {
    try {
      const sitemap = await generateSitemapForDomain(mapping.domain);
      sitemaps[mapping.domain] = sitemap;
    } catch (error) {
      console.error(`Error generating sitemap for ${mapping.domain}:`, error);
    }
  }
  
  return sitemaps;
}
