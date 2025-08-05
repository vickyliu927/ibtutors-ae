import { client } from '@/sanity/lib/client';
import { getCurrentClone } from './cloneUtils';

export interface NavigationSubjectData {
  title: string;
  subject: string;
  slug: {
    current: string;
  };
  displayOrder: number;
}

export interface NavigationCurriculumData {
  title: string;
  curriculum: string;
  slug: {
    current: string;
  };
  displayOrder: number;
}

export interface NavigationData {
  subjects: NavigationSubjectData[];
  curriculums: NavigationCurriculumData[];
  navbarData: any;
  currentDomain: string;
}

/**
 * Server-side function to fetch all navigation data with clone awareness
 */
export async function getNavigationData(): Promise<NavigationData> {
  try {
    console.log('[NavigationData] Fetching navigation data with clone context...');
    
    // Get current clone context
    const currentClone = await getCurrentClone();
    const cloneId = currentClone?.cloneId?.current || null;
    
    console.log(`[NavigationData] Clone context: ${cloneId || 'global'}`);
    
    // Fetch subjects with clone-aware fallback
    const subjectsPromise = fetchSubjectsWithFallback(cloneId);
    
    // Fetch curriculums with clone-aware fallback  
    const curriculumsPromise = fetchCurriculumsWithFallback(cloneId);
    
    // Fetch navbar data with clone-aware fallback
    const navbarPromise = fetchNavbarWithFallback(cloneId);
    
    // Execute all queries in parallel
    const [subjects, curriculums, navbarData] = await Promise.all([
      subjectsPromise,
      curriculumsPromise, 
      navbarPromise
    ]);
    
    // Get current domain for link generation
    const currentDomain = getCurrentDomain();
    
    console.log(`[NavigationData] Fetched ${subjects.length} subjects, ${curriculums.length} curriculums for clone: ${cloneId || 'global'}`);
    
    return {
      subjects,
      curriculums,
      navbarData,
      currentDomain
    };
  } catch (error) {
    console.error('[NavigationData] Error fetching navigation data:', error);
    
    // Return fallback data
    return {
      subjects: [],
      curriculums: [],
      navbarData: null,
      currentDomain: ''
    };
  }
}

/**
 * Fetch subjects with 3-tier fallback
 */
async function fetchSubjectsWithFallback(cloneId: string | null): Promise<NavigationSubjectData[]> {
  if (!cloneId) {
    // No clone ID, fetch default subjects
    const query = `*[_type == "subjectPage" && !defined(cloneReference) && isActive == true] | order(displayOrder asc) {
      title,
      subject,
      slug,
      displayOrder
    }`;
    
    const result = await client.fetch<NavigationSubjectData[]>(query);
    console.log(`[NavigationData] Fetched ${result.length} default subject pages`);
    return result;
  }
  
  // Clone-aware query with 3-tier fallback
  const query = `{
    "cloneSpecific": *[_type == "subjectPage" && cloneReference->cloneId.current == $cloneId && isActive == true] | order(displayOrder asc) {
      title,
      subject,
      slug,
      displayOrder,
      "source": "cloneSpecific"
    },
    "baseline": *[_type == "subjectPage" && cloneReference->baselineClone == true && isActive == true] | order(displayOrder asc) {
      title,
      subject,
      slug,
      displayOrder,
      "source": "baseline"
    },
    "default": *[_type == "subjectPage" && !defined(cloneReference) && isActive == true] | order(displayOrder asc) {
      title,
      subject,
      slug,
      displayOrder,
      "source": "default"
    }
  }`;
  
  try {
    const result = await client.fetch(query, { cloneId });
    
    // Resolve using 3-tier fallback: cloneSpecific → baseline → default
    let subjects: NavigationSubjectData[] = [];
    let source = 'none';
    
    if (result.cloneSpecific && result.cloneSpecific.length > 0) {
      subjects = result.cloneSpecific;
      source = 'cloneSpecific';
    } else if (result.baseline && result.baseline.length > 0) {
      subjects = result.baseline;
      source = 'baseline';
    } else if (result.default && result.default.length > 0) {
      subjects = result.default;
      source = 'default';
    }
    
    console.log(`[NavigationData] Fetched ${subjects.length} subject pages from ${source} for clone: ${cloneId}`);
    return subjects;
  } catch (error) {
    console.error(`[NavigationData] Error fetching subjects for clone ${cloneId}:`, error);
    
    // Fallback to default content on error
    const fallbackQuery = `*[_type == "subjectPage" && !defined(cloneReference) && isActive == true] | order(displayOrder asc) {
      title,
      subject,
      slug,
      displayOrder
    }`;
    
    const fallbackResult = await client.fetch<NavigationSubjectData[]>(fallbackQuery);
    console.log(`[NavigationData] Using fallback: ${fallbackResult.length} default subject pages`);
    return fallbackResult;
  }
}

/**
 * Fetch curriculums with 3-tier fallback
 */
async function fetchCurriculumsWithFallback(cloneId: string | null): Promise<NavigationCurriculumData[]> {
  // Hardcoded fallback data
  const FALLBACK_CURRICULUM_PAGES: NavigationCurriculumData[] = [
    { title: 'A-Level Online Tutor', curriculum: 'A-Level', slug: { current: 'a-level' }, displayOrder: 1 },
    { title: 'IGCSE Online Tutor', curriculum: 'IGCSE', slug: { current: 'igcse' }, displayOrder: 2 },
    { title: 'AP Online Tutor', curriculum: 'AP', slug: { current: 'ap' }, displayOrder: 3 },
    { title: 'GCSE Online Tutor', curriculum: 'GCSE', slug: { current: 'gcse' }, displayOrder: 4 },
    { title: 'IB Online Tutor', curriculum: 'IB', slug: { current: 'ib' }, displayOrder: 5 }
  ];
  
  if (!cloneId) {
    // No clone ID, fetch default curriculums
    const query = `*[_type == "curriculumPage" && !defined(cloneReference) && isActive == true] | order(displayOrder asc) {
      title,
      curriculum,
      slug,
      displayOrder
    }`;
    
    try {
      const result = await client.fetch<NavigationCurriculumData[]>(query);
      console.log(`[NavigationData] Fetched ${result.length} default curriculum pages`);
      
      if (!result || result.length === 0) {
        console.log('[NavigationData] Using fallback curriculum data');
        return FALLBACK_CURRICULUM_PAGES;
      }
      
      return result;
    } catch (error) {
      console.error('[NavigationData] Error fetching default curriculums:', error);
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
    
    // Resolve using 3-tier fallback
    let curriculums: NavigationCurriculumData[] = [];
    let source = 'none';
    
    if (result.cloneSpecific && result.cloneSpecific.length > 0) {
      curriculums = result.cloneSpecific;
      source = 'cloneSpecific';
    } else if (result.baseline && result.baseline.length > 0) {
      curriculums = result.baseline;
      source = 'baseline';
    } else if (result.default && result.default.length > 0) {
      curriculums = result.default;
      source = 'default';
    }
    
    console.log(`[NavigationData] Fetched ${curriculums.length} curriculum pages from ${source} for clone: ${cloneId}`);
    
    if (curriculums.length === 0) {
      console.log('[NavigationData] No curriculums found, using fallback');
      return FALLBACK_CURRICULUM_PAGES;
    }
    
    return curriculums;
  } catch (error) {
    console.error(`[NavigationData] Error fetching curriculums for clone ${cloneId}:`, error);
    return FALLBACK_CURRICULUM_PAGES;
  }
}

/**
 * Fetch navbar data with clone awareness
 */
async function fetchNavbarWithFallback(cloneId: string | null): Promise<any> {
  if (!cloneId) {
    // Fetch default navbar
    const query = `*[_type == "navbar" && !defined(cloneReference)][0] {
      logo,
      logoAlt,
      logoLink,
      navigation,
      buttonText,
      buttonLink,
      mobileMenu
    }`;
    
    return await client.fetch(query);
  }
  
  // Clone-aware navbar query with fallback
  const query = `{
    "cloneSpecific": *[_type == "navbar" && cloneReference->cloneId.current == $cloneId][0] {
      logo,
      logoAlt,
      logoLink,
      navigation,
      buttonText,
      buttonLink,
      mobileMenu
    },
    "baseline": *[_type == "navbar" && cloneReference->baselineClone == true][0] {
      logo,
      logoAlt,
      logoLink,
      navigation,
      buttonText,
      buttonLink,
      mobileMenu
    },
    "default": *[_type == "navbar" && !defined(cloneReference)][0] {
      logo,
      logoAlt,
      logoLink,
      navigation,
      buttonText,
      buttonLink,
      mobileMenu
    }
  }`;
  
  try {
    const result = await client.fetch(query, { cloneId });
    
    // Resolve using 3-tier fallback
    if (result.cloneSpecific) {
      return result.cloneSpecific;
    } else if (result.baseline) {
      return result.baseline;
    } else if (result.default) {
      return result.default;
    }
    
    return null;
  } catch (error) {
    console.error(`[NavigationData] Error fetching navbar for clone ${cloneId}:`, error);
    return null;
  }
}

/**
 * Get current domain for link generation
 */
function getCurrentDomain(): string {
  try {
    // Try to get domain from headers (server-side)
    const { headers } = require('next/headers');
    const headersList = headers();
    const host = headersList.get('host');
    
    if (host) {
      return host;
    }
  } catch (error) {
    // Headers not available (might be during build)
  }
  
  // Fallback to empty string
  return '';
} 