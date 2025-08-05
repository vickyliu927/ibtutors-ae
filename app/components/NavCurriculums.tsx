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

async function getCurriculumPages(cloneId?: string | null) {
  console.log(`[NavCurriculums] Fetching curriculum pages for clone: ${cloneId || 'global'}`);
  
  // If no clone ID provided, fall back to global query for compatibility
  if (!cloneId || cloneId === 'global' || cloneId === 'none') {
    const query = `*[_type == "curriculumPage" && !defined(cloneReference)] | order(displayOrder asc) {
      title,
      curriculum,
      slug,
      displayOrder
    }`;
    
    try {
      const result = await client.fetch<CurriculumPageData[]>(query);
      console.log(`[NavCurriculums] Fetched ${result.length} default curriculum pages`);
      
      // If the result is empty, use the hardcoded fallback
      if (!result || result.length === 0) {
        console.log('Using fallback curriculum data');
        return FALLBACK_CURRICULUM_PAGES;
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching default curriculum pages:', error);
      console.log('Using fallback curriculum data after error');
      return FALLBACK_CURRICULUM_PAGES;
    }
  }
  
  // Clone-aware query with 3-tier fallback
  const query = `{
    "cloneSpecific": *[_type == "curriculumPage" && cloneReference->cloneId.current == $cloneId && isActive == true] | order(displayOrder asc) {
      title,
      curriculum,
      slug,
      displayOrder,
      "source": "cloneSpecific"
    },
    "baseline": *[_type == "curriculumPage" && cloneReference->baselineClone == true && isActive == true] | order(displayOrder asc) {
      title,
      curriculum,
      slug,
      displayOrder,
      "source": "baseline"
    },
    "default": *[_type == "curriculumPage" && !defined(cloneReference) && isActive == true] | order(displayOrder asc) {
      title,
      curriculum,
      slug,
      displayOrder,
      "source": "default"
    }
  }`;
  
  try {
    const result = await client.fetch(query, { cloneId });
    
    // Resolve using 3-tier fallback: cloneSpecific → baseline → default
    let curriculumPages: CurriculumPageData[] = [];
    let source = 'none';
    
    if (result.cloneSpecific && result.cloneSpecific.length > 0) {
      curriculumPages = result.cloneSpecific;
      source = 'cloneSpecific';
    } else if (result.baseline && result.baseline.length > 0) {
      curriculumPages = result.baseline;
      source = 'baseline';
    } else if (result.default && result.default.length > 0) {
      curriculumPages = result.default;
      source = 'default';
    }
    
    console.log(`[NavCurriculums] Fetched ${curriculumPages.length} curriculum pages from ${source} for clone: ${cloneId}`);
    
    // If no content found, use fallback
    if (curriculumPages.length === 0) {
      console.log('[NavCurriculums] No curriculum pages found, using fallback data');
      return FALLBACK_CURRICULUM_PAGES;
    }
    
    return curriculumPages;
  } catch (error) {
    console.error(`[NavCurriculums] Error fetching curriculum pages for clone ${cloneId}:`, error);
    
    // Fallback to default content on error
    try {
      const fallbackQuery = `*[_type == "curriculumPage" && !defined(cloneReference)] | order(displayOrder asc) {
        title,
        curriculum,
        slug,
        displayOrder
      }`;
      
      const fallbackResult = await client.fetch<CurriculumPageData[]>(fallbackQuery);
      console.log(`[NavCurriculums] Using fallback: ${fallbackResult.length} default curriculum pages`);
      
      if (!fallbackResult || fallbackResult.length === 0) {
        console.log('[NavCurriculums] Default query also empty, using hardcoded fallback');
        return FALLBACK_CURRICULUM_PAGES;
      }
      
      return fallbackResult;
    } catch (fallbackError) {
      console.error('[NavCurriculums] Fallback query also failed:', fallbackError);
      console.log('[NavCurriculums] Using hardcoded fallback data');
      return FALLBACK_CURRICULUM_PAGES;
    }
  }
}

export { getCurriculumPages, type CurriculumPageData }; 