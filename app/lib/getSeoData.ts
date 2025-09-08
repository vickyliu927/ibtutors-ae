import { headers } from 'next/headers';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

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

    // Fetch WITHOUT CDN and WITHOUT local cache so SEO changes reflect immediately
    const freshClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: 'published',
      token: process.env.SANITY_API_TOKEN,
    });

    // Fallback: resolve clone by domain if header is still missing
    if (!targetCloneId) {
      const headersList = headers();
      const forwardedHost = headersList.get('x-forwarded-host');
      const host = (forwardedHost || headersList.get('host') || '').toLowerCase();
      const normalizedHost = host.split(',')[0].trim().split(':')[0].replace(/^www\./, '');
      if (normalizedHost) {
        const domainQuery = `*[_type == "clone" && isActive == true && ($hostname in metadata.domains || $wwwHostname in metadata.domains)][0]{
          "cloneId": cloneId.current
        }`;
        const domainResult = await freshClient.fetch<{ cloneId?: string | null }>(
          domainQuery,
          { hostname: normalizedHost, wwwHostname: `www.${normalizedHost}` },
          { next: { revalidate: 0 } }
        );
        if (domainResult?.cloneId) {
          targetCloneId = domainResult.cloneId;
          console.log(`[getSeoData] Resolved cloneId from domain '${normalizedHost}': ${targetCloneId}`);
        }
      }
    }

    const result = await freshClient.fetch<{
      cloneSpecific: (SeoData & { sourceInfo?: { source: string; cloneId: string } }) | null;
      baseline: (SeoData & { sourceInfo?: { source: string; cloneId: string } }) | null;
      default: (SeoData & { sourceInfo?: { source: string; cloneId: string } }) | null;
    }>(query, params, { next: { revalidate: 0 } });

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