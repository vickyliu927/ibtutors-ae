import { cachedFetch } from '@/sanity/lib/queryCache';
import { headers } from 'next/headers';

export interface SeoData {
  title: string;
  description: string;
}

export async function getSeoData(cloneId?: string | null): Promise<SeoData> {
  try {
    // If no cloneId provided, try to get it from middleware headers
    let targetCloneId = cloneId;
    if (!targetCloneId) {
      try {
        const headersList = headers();
        targetCloneId = headersList.get('x-clone-id');
      } catch (error) {
        console.log('[getSeoData] Could not access headers (client-side call)');
      }
    }

    // Build clone-aware query with 3-tier fallback
    const query = `{
      "cloneSpecific": *[_type == "seoSettings" && defined($cloneId) && cloneReference->cloneId.current == $cloneId][0] {
        title,
        description,
        "sourceInfo": {
          "source": "cloneSpecific",
          "cloneId": $cloneId
        }
      },
      "baseline": *[_type == "seoSettings" && cloneReference->baselineClone == true][0] {
        title,
        description,
        "sourceInfo": {
          "source": "baseline",
          "cloneId": cloneReference->cloneId.current
        }
      },
      "default": *[_type == "seoSettings" && !defined(cloneReference)][0] {
        title,
        description,
        "sourceInfo": {
          "source": "default",
          "cloneId": null
        }
      }
    }`;

    const params = { cloneId: targetCloneId };

    // Using cachedFetch with clone-aware cache key
    const cacheKey = `seoSettings-${targetCloneId || 'default'}`;
    const result = await cachedFetch<{
      cloneSpecific: (SeoData & { sourceInfo?: { source: string; cloneId: string } }) | null;
      baseline: (SeoData & { sourceInfo?: { source: string; cloneId: string } }) | null;
      default: (SeoData & { sourceInfo?: { source: string; cloneId: string } }) | null;
    }>(
      query,
      params,
      { next: { revalidate: 86400 } }, // 24 hours cache
      24 * 60 * 60 * 1000, // 24 hours TTL
      cacheKey
    );

    if (!result) {
      return getDefaultSeoData();
    }

    // Apply 3-tier fallback resolution
    const seoData = result.cloneSpecific || result.baseline || result.default;
    
    if (!seoData) {
      return getDefaultSeoData();
    }

    console.log(`[getSeoData] Resolved SEO data from: ${seoData.sourceInfo?.source || 'unknown'} for clone: ${targetCloneId || 'none'}`);
    
    return {
      title: seoData.title,
      description: seoData.description,
    };
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return getDefaultSeoData();
  }
}

/**
 * Get default SEO data as fallback
 */
function getDefaultSeoData(): SeoData {
  return {
    title: 'Dubai Tutors - Expert IB Teachers and Examiners',
    description: 'Learn from qualified IB teachers with proven success rates in Dubai, Abu Dhabi, and across the UAE.',
  };
} 