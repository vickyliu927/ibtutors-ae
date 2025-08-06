import { client } from '@/sanity/lib/client';

export interface CurriculumHeroData {
  rating: {
    score: string;
    basedOnText: string;
    reviewCount: string;
  };
  title: {
    firstPart: string;
    secondPart: string;
  };
  subtitle: string;
}

export async function getCurriculumHeroData(curriculumSlug?: string): Promise<CurriculumHeroData | null> {
  try {
    let result: CurriculumHeroData | null = null;

    if (curriculumSlug) {
      // First, try to find curriculum-specific hero section
      result = await client.fetch<CurriculumHeroData>(
        `*[_type == "curriculumHeroSection" && !(_id in path("drafts.**")) && curriculumPage->slug.current == $curriculumSlug][0]{
          rating {
            score,
            basedOnText,
            reviewCount
          },
          title {
            firstPart,
            secondPart
          },
          subtitle
        }`,
        { curriculumSlug },
        { next: { revalidate: 600 } } // Cache for 10 minutes
      );
    }

    // If no curriculum-specific hero found, try to get default/fallback hero
    if (!result) {
      result = await client.fetch<CurriculumHeroData>(
        `*[_type == "curriculumHeroSection" && !(_id in path("drafts.**")) && (isDefault == true || curriculumPage == null)][0]{
          rating {
            score,
            basedOnText,
            reviewCount
          },
          title {
            firstPart,
            secondPart
          },
          subtitle
        }`,
        {},
        { next: { revalidate: 600 } } // Cache for 10 minutes
      );
    }

    if (!result) {
      console.log(`Curriculum hero section not found for slug: ${curriculumSlug || 'default'}`);
      return null;
    }

    return result;
  } catch (err) {
    console.error('Error fetching curriculum hero section:', err);
    return null;
  }
}