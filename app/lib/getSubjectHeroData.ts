import { client } from '@/sanity/lib/client';

export interface SubjectHeroData {
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

export async function getSubjectHeroData(subjectSlug?: string): Promise<SubjectHeroData | null> {
  try {
    let result: SubjectHeroData | null = null;

    if (subjectSlug) {
      // First, try to find subject-specific hero section
      result = await client.fetch<SubjectHeroData>(
        `*[_type == "subjectHeroSection" && !(_id in path("drafts.**")) && subjectPage->slug.current == $subjectSlug][0]{
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
        { subjectSlug },
        { next: { revalidate: 600 } } // Cache for 10 minutes
      );
    }

    // If no subject-specific hero found, try to get default/fallback hero
    if (!result) {
      result = await client.fetch<SubjectHeroData>(
        `*[_type == "subjectHeroSection" && !(_id in path("drafts.**")) && (isDefault == true || subjectPage == null)][0]{
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
      console.log(`Subject hero section not found for slug: ${subjectSlug || 'default'}`);
      return null;
    }

    return result;
  } catch (err) {
    console.error('Error fetching subject hero section:', err);
    return null;
  }
} 