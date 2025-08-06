// Shared interface for both subject and curriculum hero data
export interface HeroData {
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

// Type alias for backward compatibility
export type SubjectHeroData = HeroData;
export type CurriculumHeroData = HeroData;