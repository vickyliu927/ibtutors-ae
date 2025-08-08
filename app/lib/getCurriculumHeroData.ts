import { cachedFetch } from '@/sanity/lib/queryCache';
import { type CurriculumHeroData } from './heroTypes';

export type { CurriculumHeroData };

export async function getCurriculumHeroData(curriculumSlug?: string, cloneId?: string | null): Promise<CurriculumHeroData | null> {
  try {
    // If no cloneId provided, try to get it from middleware headers
    let targetCloneId = cloneId;
    if (!targetCloneId) {
      try {
        // Dynamically import next/headers only on server-side
        const { headers } = await import('next/headers');
        const headersList = headers();
        targetCloneId = headersList.get('x-clone-id');
      } catch (error) {
        console.log('[getCurriculumHeroData] Could not access headers (client-side call)');
      }
    }

    if (!curriculumSlug) {
      console.log('[getCurriculumHeroData] No curriculum slug provided');
      return null;
    }

    // Build clone-aware query with 3-tier fallback
    const query = `{
      "cloneSpecific": *[_type == "curriculumHeroSection" && !(_id in path("drafts.**")) && curriculumPage->slug.current == $curriculumSlug && defined($cloneId) && cloneReference->cloneId.current == $cloneId][0]{
        rating {
          score,
          basedOnText,
          reviewCount
        },
        title {
          firstPart,
          secondPart
        },
        subtitle,
        "sourceInfo": {
          "source": "cloneSpecific",
          "cloneId": $cloneId
        }
      },
      "baseline": *[_type == "curriculumHeroSection" && !(_id in path("drafts.**")) && curriculumPage->slug.current == $curriculumSlug && cloneReference->baselineClone == true][0]{
        rating {
          score,
          basedOnText,
          reviewCount
        },
        title {
          firstPart,
          secondPart
        },
        subtitle,
        "sourceInfo": {
          "source": "baseline",
          "cloneId": cloneReference->cloneId.current
        }
      },
      "default": *[_type == "curriculumHeroSection" && !(_id in path("drafts.**")) && curriculumPage->slug.current == $curriculumSlug && !defined(cloneReference)][0]{
        rating {
          score,
          basedOnText,
          reviewCount
        },
        title {
          firstPart,
          secondPart
        },
        subtitle,
        "sourceInfo": {
          "source": "default",
          "cloneId": null
        }
      },
      "fallback": *[_type == "curriculumHeroSection" && !(_id in path("drafts.**")) && (isDefault == true || curriculumPage == null)][0]{
        rating {
          score,
          basedOnText,
          reviewCount
        },
        title {
          firstPart,
          secondPart
        },
        subtitle,
        "sourceInfo": {
          "source": "fallback",
          "cloneId": null
        }
      }
    }`;

    const params = { curriculumSlug, cloneId: targetCloneId };

    // Using cachedFetch with clone-aware caching
    const result = await cachedFetch<{
      cloneSpecific: (CurriculumHeroData & { sourceInfo?: { source: string; cloneId: string } }) | null;
      baseline: (CurriculumHeroData & { sourceInfo?: { source: string; cloneId: string } }) | null;
      default: (CurriculumHeroData & { sourceInfo?: { source: string; cloneId: string } }) | null;
      fallback: (CurriculumHeroData & { sourceInfo?: { source: string; cloneId: string } }) | null;
    }>(
      query,
      params,
      { next: { revalidate: 600 } }, // 10 minutes cache
      10 * 60 * 1000 // 10 minutes TTL
    );

    if (!result) {
      console.log(`[getCurriculumHeroData] No result from query for slug: ${curriculumSlug}`);
      return null;
    }

    // Apply 4-tier fallback resolution: cloneSpecific → baseline → default → fallback
    let heroData: CurriculumHeroData | null = null;
    let source = 'none';
    
    if (result.cloneSpecific) {
      heroData = result.cloneSpecific;
      source = 'cloneSpecific';
    } else if (result.baseline) {
      heroData = result.baseline;
      source = 'baseline';
    } else if (result.default) {
      heroData = result.default;
      source = 'default';
    } else if (result.fallback) {
      heroData = result.fallback;
      source = 'fallback';
    }

    if (!heroData) {
      console.log(`[getCurriculumHeroData] No curriculum hero found for slug: ${curriculumSlug}, clone: ${targetCloneId || 'none'}`);
      return null;
    }

    console.log(`[getCurriculumHeroData] Resolved curriculum hero from: ${source} for slug: ${curriculumSlug}, clone: ${targetCloneId || 'none'}`);
    
    // Clean up the data (remove sourceInfo)
    const { sourceInfo, ...cleanHeroData } = heroData as CurriculumHeroData & { sourceInfo?: any };
    return cleanHeroData;
    
  } catch (err) {
    console.error('Error fetching curriculum hero section:', err);
    return null;
  }
}