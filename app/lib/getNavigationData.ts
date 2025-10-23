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
  externalRedirectEnabled?: boolean;
  externalRedirectUrl?: string;
  externalRedirectPermanent?: boolean;
  subjectPages?: {
    subject: string;
    slug: { current: string };
    displayOrder: number;
    externalRedirectEnabled?: boolean;
    externalRedirectUrl?: string;
  }[];
}

export interface NavigationData {
  subjects: NavigationSubjectData[];
  curriculums: NavigationCurriculumData[];
  navbarData: any;
  currentDomain: string;
  hasBlog: boolean;
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
    const [subjects, curriculums, navbarData, hasBlog] = await Promise.all([
      subjectsPromise,
      curriculumsPromise, 
      navbarPromise,
      getHasBlogForClone(cloneId),
    ]);
    
    // Get current domain for link generation
    const currentDomain = getCurrentDomain();
    
    console.log(`[NavigationData] Fetched ${subjects.length} subjects, ${curriculums.length} curriculums for clone: ${cloneId || 'global'}`);
    
    return {
      subjects,
      curriculums,
      navbarData,
      currentDomain,
      hasBlog
    };
  } catch (error) {
    console.error('[NavigationData] Error fetching navigation data:', error);
    
    // Return fallback data
    return {
      subjects: [],
      curriculums: [],
      navbarData: null,
      currentDomain: '',
      hasBlog: false
    };
  }
}

// Determine if a clone has blog posts (no fallback)
async function getHasBlogForClone(cloneId: string | null): Promise<boolean> {
  if (!cloneId) {
    // For global site, consider blog available if any default or baseline exists
    const q = `count(*[_type == "blogPost" && (!defined(cloneReference) || cloneReference->baselineClone == true) && isActive == true])`;
    const count = await client.fetch<number>(q);
    return (count || 0) > 0;
  }
  const q = `count(*[_type == "blogPost" && cloneReference->cloneId.current == $cloneId && isActive == true])`;
  const count = await client.fetch<number>(q, { cloneId });
  return (count || 0) > 0;
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
  
  // Respect clone page availability flags
  const flags = await client.fetch(
    `*[_type == "clone" && cloneId.current == $cloneId][0]{
      "homepageOnly": homepageOnly == true,
      "subjectOnly": enableSubjectPagesOnly == true,
      "curriculumOnly": enableCurriculumPagesOnly == true
    }`,
    { cloneId }
  );
  if (flags?.homepageOnly || flags?.curriculumOnly) {
    console.log('[NavigationData] subjects disabled by clone flags; returning empty subjects');
    return [];
  }

  // Allow 3-tier fallback: cloneSpecific → baseline → default
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
  // Remove hardcoded fallback for clone-specific navigation
  const FALLBACK_CURRICULUM_PAGES: NavigationCurriculumData[] = [];
  
  if (!cloneId) {
    // No clone ID, fetch default curriculums
    const query = `*[_type == "curriculumPage" && !defined(cloneReference) && isActive == true] | order(displayOrder asc) {
      title,
      curriculum,
      slug,
      displayOrder,
      externalRedirectEnabled,
      externalRedirectUrl,
      externalRedirectPermanent,
      subjectPages[]->{
        subject,
        slug,
        displayOrder,
        externalRedirectEnabled,
        externalRedirectUrl
      }
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
  
  // Respect clone page availability flags
  const flags = await client.fetch(
    `*[_type == "clone" && cloneId.current == $cloneId][0]{
      "homepageOnly": homepageOnly == true,
      "subjectOnly": enableSubjectPagesOnly == true,
      "curriculumOnly": enableCurriculumPagesOnly == true
    }`,
    { cloneId }
  );
  if (flags?.homepageOnly || flags?.subjectOnly) {
    console.log('[NavigationData] curriculums disabled by clone flags; returning empty curriculums');
    return [];
  }

  // Allow 3-tier fallback: cloneSpecific → baseline → default
  const query = `{
    "cloneSpecific": *[_type == "curriculumPage" && cloneReference->cloneId.current == $cloneId && isActive == true] | order(displayOrder asc) {
      title,
      curriculum,
      slug,
      displayOrder,
      externalRedirectEnabled,
      externalRedirectUrl,
      externalRedirectPermanent,
      subjectPages[]->{
        subject,
        slug,
        displayOrder,
        externalRedirectEnabled,
        externalRedirectUrl
      },
      "source": "cloneSpecific"
    },
    "baseline": *[_type == "curriculumPage" && cloneReference->baselineClone == true && isActive == true] | order(displayOrder asc) {
      title,
      curriculum,
      slug,
      displayOrder,
      externalRedirectEnabled,
      externalRedirectUrl,
      externalRedirectPermanent,
      subjectPages[]->{
        subject,
        slug,
        displayOrder,
        externalRedirectEnabled,
        externalRedirectUrl
      },
      "source": "baseline"
    },
    "default": *[_type == "curriculumPage" && !defined(cloneReference) && isActive == true] | order(displayOrder asc) {
      title,
      curriculum,
      slug,
      displayOrder,
      externalRedirectEnabled,
      externalRedirectUrl,
      externalRedirectPermanent,
      subjectPages[]->{
        subject,
        slug,
        displayOrder,
        externalRedirectEnabled,
        externalRedirectUrl
      },
      "source": "default"
    }
  }`;
  
  try {
    const result = await client.fetch(query, { cloneId });
    
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
  console.log(`[NavigationData] Fetching navbar for cloneId: ${cloneId || 'none'}`);
  
  if (!cloneId) {
    // Fetch default navbar
    const query = `*[_type == "navbarSettings" && !defined(cloneReference)][0] {
      logo,
      logoAlt,
      logoLink,
      navigation{
        levelsText,
        subjectsText,
        allLevelsPageLink,
        allSubjectsPageLink,
        subjectsMenuGroups[]{
          title,
          items[]->{
            subject,
            slug,
            displayOrder
          }
        }
      },
      buttonText,
      buttonLink,
      mobileMenu
    }`;
    
    const result = await client.fetch(query);
    console.log(`[NavigationData] Default navbar result:`, result ? 'Found' : 'Not found');
    return result;
  }
  
  // Clone-aware navbar query with fallback
  const query = `{
    "cloneSpecific": *[_type == "navbarSettings" && cloneReference->cloneId.current == $cloneId][0] {
      logo,
      logoAlt,
      logoLink,
      navigation{
        levelsText,
        subjectsText,
        allLevelsPageLink,
        allSubjectsPageLink,
        subjectsMenuGroups[]{
          title,
          items[]->{
            subject,
            slug,
            displayOrder
          }
        }
      },
      buttonText,
      buttonLink,
      mobileMenu,
      "sourceInfo": {
        "source": "cloneSpecific",
        "cloneId": $cloneId
      }
    },
    "baseline": *[_type == "navbarSettings" && cloneReference->baselineClone == true][0] {
      logo,
      logoAlt,
      logoLink,
      navigation{
        levelsText,
        subjectsText,
        allLevelsPageLink,
        allSubjectsPageLink,
        subjectsMenuGroups[]{
          title,
          items[]->{
            subject,
            slug,
            displayOrder
          }
        }
      },
      buttonText,
      buttonLink,
      mobileMenu,
      "sourceInfo": {
        "source": "baseline",
        "cloneId": cloneReference->cloneId.current
      }
    },
    "default": *[_type == "navbarSettings" && !defined(cloneReference)][0] {
      logo,
      logoAlt,
      logoLink,
      navigation{
        levelsText,
        subjectsText,
        allLevelsPageLink,
        allSubjectsPageLink,
        subjectsMenuGroups[]{
          title,
          items[]->{
            subject,
            slug,
            displayOrder
          }
        }
      },
      buttonText,
      buttonLink,
      mobileMenu,
      "sourceInfo": {
        "source": "default",
        "cloneId": null
      }
    }
  }`;
  
  try {
    const result = await client.fetch(query, { cloneId });
    
    console.log(`[NavigationData] Navbar query results:`, {
      cloneSpecific: result.cloneSpecific ? 'Found' : 'Not found',
      baseline: result.baseline ? 'Found' : 'Not found', 
      default: result.default ? 'Found' : 'Not found'
    });
    
    // Resolve using 3-tier fallback
    if (result.cloneSpecific) {
      console.log(`[NavigationData] Using clone-specific navbar for ${cloneId}`);
      return result.cloneSpecific;
    } else if (result.baseline) {
      console.log(`[NavigationData] Using baseline navbar for ${cloneId}`);
      return result.baseline;
    } else if (result.default) {
      console.log(`[NavigationData] Using default navbar for ${cloneId}`);
      return result.default;
    }
    
    console.log(`[NavigationData] No navbar found for ${cloneId}`);
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
    
    console.log(`[NavigationData] getCurrentDomain() - host header: ${host}`);
    
    if (host) {
      console.log(`[NavigationData] Returning domain: ${host}`);
      return host;
    }
  } catch (error) {
    // Headers not available (might be during build)
    console.log(`[NavigationData] Headers not available in getCurrentDomain:`, error);
  }
  
  // Fallback to empty string
  console.log(`[NavigationData] getCurrentDomain() - returning empty string`);
  return '';
} 