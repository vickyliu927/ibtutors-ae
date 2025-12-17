import { client } from '@/sanity/lib/client';
import { type HeroData } from './heroTypes';

export type { HeroData as LocationHeroData };

/**
 * Strict clone-aware fetch for Location Hero data.
 * - If cloneId is provided: ONLY fetch clone-specific hero bound to the location slug. No fallback.
 * - If no cloneId (global site): ONLY fetch default hero bound to the location slug with no cloneReference. No fallback.
 */
export async function getLocationHeroData(locationSlug: string, cloneId?: string | null): Promise<HeroData | null> {
  try {
    if (!locationSlug || typeof locationSlug !== 'string') {
      return null;
    }

    let targetCloneId = cloneId || null;
    if (!targetCloneId) {
      try {
        const { headers } = await import('next/headers');
        const headersList = headers();
        targetCloneId = headersList.get('x-clone-id');
      } catch {
        // ignore - no headers in some contexts
      }
    }

    if (targetCloneId) {
      // Strict: clone-specific only
      const cloneQuery = `*[
        _type == "locationHeroSection" 
        && !(_id in path("drafts.**")) 
        && locationPage->slug.current == $slug 
        && cloneReference->cloneId.current == $cloneId
      ][0]{
        rating { score, basedOnText, reviewCount },
        title { firstPart, secondPart },
        subtitle
      }`;
      const result = await client.fetch<HeroData | null>(
        cloneQuery,
        { slug: locationSlug, cloneId: targetCloneId },
        { next: { revalidate: 300 } }
      );
      return result || null;
    }

    // Global site: default-only (no cloneReference)
    const defaultQuery = `*[
      _type == "locationHeroSection" 
      && !(_id in path("drafts.**")) 
      && locationPage->slug.current == $slug 
      && !defined(cloneReference)
    ][0]{
      rating { score, basedOnText, reviewCount },
      title { firstPart, secondPart },
      subtitle
    }`;
    const defaultResult = await client.fetch<HeroData | null>(
      defaultQuery,
      { slug: locationSlug },
      { next: { revalidate: 300 } }
    );
    return defaultResult || null;
  } catch (err) {
    console.error('[getLocationHeroData] Error:', err);
    return null;
  }
}

