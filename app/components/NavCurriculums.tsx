import { client } from '@/sanity/lib/client';

interface CurriculumPageData {
  title: string;
  curriculum: string;
  slug: {
    current: string;
  };
  displayOrder: number;
}

// Hardcoded fallback data in case the query fails
const FALLBACK_CURRICULUM_PAGES: CurriculumPageData[] = [
  {
    title: 'A-Level Online Dubai A-Level Tutor',
    curriculum: 'A-Level',
    slug: { current: 'a-level' },
    displayOrder: 1
  },
  {
    title: 'IGCSE Online Dubai IGCSE Tutor',
    curriculum: 'IGCSE',
    slug: { current: 'igcse' },
    displayOrder: 2
  },
  {
    title: 'AP Online Dubai AP Tutor',
    curriculum: 'AP',
    slug: { current: 'ap' },
    displayOrder: 3
  },
  {
    title: 'GCSE Online Dubai GCSE Tutor',
    curriculum: 'GCSE',
    slug: { current: 'gcse' },
    displayOrder: 4
  },
  {
    title: 'IB Online Dubai IB Tutor',
    curriculum: 'IB',
    slug: { current: 'ib' },
    displayOrder: 5
  }
];

async function getCurriculumPages() {
  console.log('Fetching curriculum pages...');
  const query = `*[_type == "curriculumPage"] | order(displayOrder asc) {
    title,
    curriculum,
    slug,
    displayOrder
  }`;
  
  try {
    const result = await client.fetch<CurriculumPageData[]>(query);
    console.log('Curriculum pages fetch result:', result);
    
    // If the result is empty, use the hardcoded fallback
    if (!result || result.length === 0) {
      console.log('Using fallback curriculum data');
      return FALLBACK_CURRICULUM_PAGES;
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching curriculum pages in NavCurriculums:', error);
    console.log('Using fallback curriculum data after error');
    return FALLBACK_CURRICULUM_PAGES;
  }
}

export { getCurriculumPages, type CurriculumPageData }; 