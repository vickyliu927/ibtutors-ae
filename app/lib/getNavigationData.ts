import { client } from '@/sanity/lib/client';
import { getCurrentClone } from './cloneUtils';

export interface NavigationSubjectData {
  title: string;
  subject: string;
  slug?: {
    current: string;
  };
  displayOrder: number;
  externalRedirectEnabled?: boolean;
  externalRedirectUrl?: string;
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

export interface NavigationLocationData {
  title: string;
  location: string;
  slug: {
    current: string;
  };
  displayOrder: number;
  externalRedirectEnabled?: boolean;
  externalRedirectUrl?: string;
}

export interface NavigationData {
  subjects: NavigationSubjectData[];
  curriculums: NavigationCurriculumData[];
  locations: NavigationLocationData[];
  navbarData: any;
  currentDomain: string;
  hasBlog: boolean;
}

function getAllowedTypesFromNavbar(navbarData: any): {
  allowSubjects: boolean;
  allowCurriculums: boolean;
  allowLocations: boolean;
  allowBlog: boolean;
} {
  try {
    const items: any[] = navbarData?.navigation?.navOrder || [];
    if (!Array.isArray(items) || items.length === 0) {
      // Empty dropdown → homepage only
      return { allowSubjects: false, allowCurriculums: false, allowLocations: false, allowBlog: false };
    }
    let allowSubjects = false;
    let allowCurriculums = false;
    let allowLocations = false;
    let allowBlog = false;
    for (const item of items) {
      const t = item?.itemType;
      if (t === 'allSubjects') allowSubjects = true;
      if (t === 'locations') allowLocations = true;
      if (t === 'blog') allowBlog = true;
      if (t === 'curriculum') allowCurriculums = true;
    }
    return { allowSubjects, allowCurriculums, allowLocations, allowBlog };
  } catch {
    // On any error, be conservative: homepage only
    return { allowSubjects: false, allowCurriculums: false, allowLocations: false, allowBlog: false };
  }
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
    // Fetch locations with clone-aware fallback
    const locationsPromise = fetchLocationsWithFallback(cloneId);
    
    // Fetch navbar data with clone-aware fallback
    const navbarPromise = fetchNavbarWithFallback(cloneId);
    
    // Execute all queries in parallel
    const [subjectsRaw, curriculumsRaw, locationsRaw, navbarData, hasBlogRaw] = await Promise.all([
      subjectsPromise,
      curriculumsPromise, 
      locationsPromise,
      navbarPromise,
      getHasBlogForClone(cloneId),
    ]);
    
    // Get current domain for link generation
    const currentDomain = getCurrentDomain();
    
    // AUTO-GATE MENUS BY CONTENT EXISTENCE ONLY (ignores navOrder toggles)
    // If content exists for this clone, show the corresponding menu.
    const allowSubjects = Array.isArray(subjectsRaw) && subjectsRaw.length > 0;
    const allowCurriculums = Array.isArray(curriculumsRaw) && curriculumsRaw.length > 0;
    const allowLocations = Array.isArray(locationsRaw) && locationsRaw.length > 0;
    const allowBlog = !!hasBlogRaw;
    const subjects = allowSubjects ? subjectsRaw : [];
    const curriculums = allowCurriculums ? curriculumsRaw : [];
    const locations = allowLocations ? locationsRaw : [];
    const hasBlog = allowBlog;

    console.log(`[NavigationData] Allowed types — subjects:${allowSubjects} curriculums:${allowCurriculums} locations:${allowLocations} blog:${allowBlog}`);
    console.log(`[NavigationData] Fetched ${subjects.length} subjects, ${curriculums.length} curriculums, ${locations.length} locations for clone: ${cloneId || 'global'}`);
    
    return {
      subjects,
      curriculums,
      locations,
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
      locations: [],
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
    const count = await client.fetch<number>(q, {}, { next: { revalidate: 300 } });
    return (count || 0) > 0;
  }
  const q = `count(*[_type == "blogPost" && cloneReference->cloneId.current == $cloneId && isActive == true])`;
  const count = await client.fetch<number>(q, { cloneId }, { next: { revalidate: 300 } });
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
      displayOrder,
      externalRedirectEnabled,
      externalRedirectUrl
    }`;
    
    const result = await client.fetch<NavigationSubjectData[]>(query, {}, { next: { revalidate: 300 } });
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
    { cloneId },
    { next: { revalidate: 300 } }
  );
  if (flags?.homepageOnly || flags?.curriculumOnly) {
    console.log('[NavigationData] subjects disabled by clone flags; returning empty subjects');
    return [];
  }

  // STRICT: clones must use clone-specific only (no fallback)
  const query = `*[_type == "subjectPage" && cloneReference->cloneId.current == $cloneId && isActive == true] | order(displayOrder asc) {
    title,
    subject,
    slug,
    displayOrder,
    externalRedirectEnabled,
    externalRedirectUrl
  }`;
  const result = await client.fetch<NavigationSubjectData[]>(query, { cloneId }, { next: { revalidate: 300 } });
  console.log(`[NavigationData] Fetched ${result.length} clone-specific subject pages for clone: ${cloneId}`);
  return result || [];
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
      const result = await client.fetch<NavigationCurriculumData[]>(query, {}, { next: { revalidate: 300 } });
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
    { cloneId },
    { next: { revalidate: 300 } }
  );
  if (flags?.homepageOnly || flags?.subjectOnly) {
    console.log('[NavigationData] curriculums disabled by clone flags; returning empty curriculums');
    return [];
  }

  // STRICT: clones must use clone-specific only (no fallback)
  const query = `*[_type == "curriculumPage" && cloneReference->cloneId.current == $cloneId && isActive == true] | order(displayOrder asc) {
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
  const result = await client.fetch<NavigationCurriculumData[]>(query, { cloneId }, { next: { revalidate: 300 } });
  console.log(`[NavigationData] Fetched ${result.length} clone-specific curriculum pages for clone: ${cloneId}`);
  return result || [];
}

/**
 * Fetch locations with 3-tier fallback (cloneSpecific → baseline → default)
 */
async function fetchLocationsWithFallback(cloneId: string | null): Promise<NavigationLocationData[]> {
  // Global site (no clone): fetch default locations
  if (!cloneId) {
    const query = `*[_type == "locationPage" && !defined(cloneReference) && isActive == true] | order(displayOrder asc) {
      title,
      location,
      slug,
      displayOrder,
      externalRedirectEnabled,
      externalRedirectUrl
    }`;
    const result = await client.fetch<NavigationLocationData[]>(query, {}, { next: { revalidate: 300 } });
    console.log(`[NavigationData] Fetched ${result.length} default location pages`);
    return result;
  }

  // Respect clone flags
  const flags = await client.fetch(
    `*[_type == "clone" && cloneId.current == $cloneId][0]{
      "homepageOnly": homepageOnly == true
    }`,
    { cloneId },
    { next: { revalidate: 300 } }
  );
  if (flags?.homepageOnly) {
    console.log('[NavigationData] locations disabled by clone flags; returning empty locations');
    return [];
  }

  // STRICT: clones must use clone-specific only (no fallback)
  const query = `*[_type == "locationPage" && cloneReference->cloneId.current == $cloneId && isActive == true] | order(displayOrder asc) {
    title, location, slug, displayOrder, externalRedirectEnabled, externalRedirectUrl
  }`;
  const result = await client.fetch<NavigationLocationData[]>(query, { cloneId }, { next: { revalidate: 300 } });
  console.log(`[NavigationData] Fetched ${result.length} clone-specific location pages for clone: ${cloneId}`);
  return result || [];
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
        navOrder[]{
          itemType,
          curriculumTarget->{
            title,
            curriculum,
            slug
          }
        },
      },
      buttonText,
      buttonLink,
      mobileMenu{ closeButtonColor, dropdownArrowColor, borderColor, mobileNavOrder[]{ itemType, curriculumTarget->{ title, curriculum, slug } } }
    }`;
    
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
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
        navOrder[]{
          itemType,
          curriculumTarget->{
            title,
            curriculum,
            slug
          }
        },
      },
      buttonText,
      buttonLink,
      mobileMenu{ closeButtonColor, dropdownArrowColor, borderColor, mobileNavOrder[]{ itemType, curriculumTarget->{ title, curriculum, slug } } },
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
        navOrder[]{
          itemType,
          curriculumTarget->{
            title,
            curriculum,
            slug
          }
        }
      },
      buttonText,
      buttonLink,
      mobileMenu{ closeButtonColor, dropdownArrowColor, borderColor, mobileNavOrder[]{ key } },
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
        navOrder[]{
          itemType,
          curriculumTarget->{
            title,
            curriculum,
            slug
          }
        },
      },
      buttonText,
      buttonLink,
      mobileMenu{ closeButtonColor, dropdownArrowColor, borderColor, mobileNavOrder[]{ itemType, curriculumTarget->{ title, curriculum, slug } } },
      "sourceInfo": {
        "source": "default",
        "cloneId": null
      }
    }
  }`;
  
  try {
    const result = await client.fetch(query, { cloneId }, { next: { revalidate: 300 } });
    
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