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

export async function getSubjectHeroData(): Promise<SubjectHeroData | null> {
  try {
    const result = await client.fetch<SubjectHeroData>(
      `*[_type == "subjectHeroSection" && !(_id in path("drafts.**"))][0]{
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

    if (!result) {
      console.log('Subject hero section not found in CMS');
      return null;
    }

    return result;
  } catch (err) {
    console.error('Error fetching subject hero section:', err);
    return null;
  }
} 