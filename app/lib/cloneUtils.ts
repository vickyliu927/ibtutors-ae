import { client } from '@/sanity/lib/client';
import { headers } from 'next/headers';

export interface CloneData {
  _id: string;
  cloneId: { current: string };
  cloneName: string;
  cloneDescription?: string;
  isActive: boolean;
  baselineClone: boolean;
  metadata: {
    targetAudience: string;
    region: string;
    domains: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Cache for clone data to avoid repeatedly fetching the same data
let cachedClones: CloneData[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Get all active clones from Sanity
 */
export async function getAllClones(): Promise<CloneData[]> {
  const now = Date.now();
  
  // Return cached clones if they're still valid
  if (cachedClones && now - lastFetchTime < CACHE_TTL) {
    return cachedClones;
  }

  try {
    const query = `*[_type == "clone" && isActive == true] | order(baselineClone desc, cloneName asc) {
      _id,
      cloneId,
      cloneName,
      cloneDescription,
      isActive,
      baselineClone,
      metadata,
      createdAt,
      updatedAt
    }`;

    const clones = await client.fetch<CloneData[]>(query);
    
    // Update cache
    cachedClones = clones;
    lastFetchTime = now;
    
    return clones;
  } catch (error) {
    console.error('Error fetching clones:', error);
    return [];
  }
}

/**
 * Get the current domain from request headers
 */
export function getCurrentDomain(): string {
  try {
    const headersList = headers();
    const host = headersList.get('host') || '';
    return host.replace('www.', '').toLowerCase();
  } catch (error) {
    console.error('Error getting current domain:', error);
    return '';
  }
}

/**
 * Find clone configuration for a specific domain
 */
export async function getCloneByDomain(domain?: string): Promise<CloneData | null> {
  const targetDomain = domain || getCurrentDomain();
  
  if (!targetDomain) {
    return null;
  }

  const clones = await getAllClones();
  
  // Find clone that has this domain in its domains array
  const clone = clones.find(clone => 
    clone.metadata.domains.some(d => 
      d.toLowerCase() === targetDomain || 
      d.toLowerCase() === `www.${targetDomain}`
    )
  );

  return clone || null;
}

/**
 * Get the baseline clone (template clone)
 */
export async function getBaselineClone(): Promise<CloneData | null> {
  const clones = await getAllClones();
  return clones.find(clone => clone.baselineClone) || null;
}

/**
 * Get clone by ID
 */
export async function getCloneById(cloneId: string): Promise<CloneData | null> {
  try {
    const query = `*[_type == "clone" && cloneId.current == $cloneId][0] {
      _id,
      cloneId,
      cloneName,
      cloneDescription,
      isActive,
      baselineClone,
      metadata,
      createdAt,
      updatedAt
    }`;

    const clone = await client.fetch<CloneData | null>(query, { cloneId });
    return clone;
  } catch (error) {
    console.error('Error fetching clone by ID:', error);
    return null;
  }
}

/**
 * Get the current clone context (fallback to baseline if domain not found)
 * First checks middleware headers (set by enhanced middleware), then falls back to domain lookup
 */
export async function getCurrentClone(): Promise<CloneData | null> {
  try {
    // First try to get clone ID from middleware headers (server-side)
    if (typeof window === 'undefined') {
      // We're on the server, try to get from request headers
      const { headers } = await import('next/headers');
      const headersList = headers();
      const cloneId = headersList.get('x-clone-id');
      
      if (cloneId) {
        console.log(`[CloneUtils] Using clone from middleware header: ${cloneId}`);
        const clone = await getCloneById(cloneId);
        if (clone) {
          return clone;
        }
      }
    }
    
    // Fallback to domain-based lookup
    const domain = getCurrentDomain();
    let clone = await getCloneByDomain(domain);
    
    // If no clone found for domain, fall back to baseline
    if (!clone) {
      clone = await getBaselineClone();
    }
    
    return clone;
  } catch (error) {
    console.error('Error getting current clone:', error);
    
    // Final fallback to baseline
    return await getBaselineClone();
  }
}

/**
 * Check if a domain is valid for any clone
 */
export async function isValidDomain(domain: string): Promise<boolean> {
  const clones = await getAllClones();
  return clones.some(clone => 
    clone.metadata.domains.some(d => 
      d.toLowerCase() === domain.toLowerCase() || 
      d.toLowerCase() === `www.${domain.toLowerCase()}`
    )
  );
}

/**
 * Clear the clone cache (useful after updates)
 */
export function clearCloneCache(): void {
  cachedClones = null;
  lastFetchTime = 0;
}

// ============================================================================
// ENHANCED FALLBACK UTILITIES AND CONTENT RESOLUTION
// ============================================================================

/**
 * Content source types for the fallback hierarchy
 */
export type ContentSource = 'cloneSpecific' | 'baseline' | 'default';

/**
 * Fallback result interface that includes both data and source information
 */
export interface FallbackResult<T> {
  data: T | null;
  source: ContentSource | null;
  cloneId?: string;
  isBaseline?: boolean;
  error?: string;
}

/**
 * Raw fallback data structure from queries
 */
export interface RawFallbackData<T> {
  cloneSpecific?: T | null;
  baseline?: T | null;
  default?: T | null;
}

/**
 * Component content interfaces
 */
export interface HeroContent {
  _id: string;
  titleFirstRow: string;
  titleSecondRow: string;
  subtitle: string;
  mainImage: any;
  primaryButton: {
    text: string;
    link: string;
  };
  features?: string[];
  rating?: {
    score: string;
    basedOnText: string;
    reviewCount: string;
  };
  cloneSpecificData?: any;
}

export interface SeoContent {
  _id: string;
  title: string;
  description: string;
  cloneSpecificData?: any;
}

export interface FooterContent {
  _id: string;
  title: string;
  phone: string;
  phoneLink?: string;
  whatsapp: string;
  whatsappLink?: string;
  address: string;
  addressLink?: string;
  tutorchaseLink?: string;
  cloneSpecificData?: any;
}

export interface NavbarContent {
  _id: string;
  logo: any;
  logoLink: string;
  navigation: {
    levelsText: string;
    subjectsText: string;
    allLevelsPageLink?: string;
    allSubjectsPageLink?: string;
  };
  mobileMenu?: {
    closeButtonColor?: string;
    dropdownArrowColor?: string;
    borderColor?: string;
  };
  buttonText: string;
  buttonLink: string;
  cloneSpecificData?: any;
}

export interface TutorContent {
  _id: string;
  name: string;
  professionalTitle?: string;
  displayOrder: number;
  priceTag?: any;
  displayOnHomepage?: boolean;
  experience: string;
  profilePhoto: any;
  specialization: any;
  hireButtonLink: string;
  profilePDF?: any;
  price?: any;
  rating?: number;
  reviewCount?: number;
  activeStudents?: number;
  totalLessons?: number;
  languagesSpoken?: any[];
  cloneSpecificData?: any;
}

export interface TestimonialContent {
  _id: string;
  reviewerName: string;
  reviewerType: string;
  testimonialText: string;
  rating: number;
  order: number;
  cloneSpecificData?: any;
}

export interface PlatformBannerContent {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  features: Array<{
    feature: string;
    description?: string;
  }>;
  cloneSpecificData?: any;
}

export interface HighlightsContent {
  _id: string;
  highlights: Array<{
    title: string;
    description: string;
    iconType: 'star' | 'language' | 'education';
    isFeatured: boolean;
  }>;
  cloneSpecificData?: any;
}

export interface FaqSectionContent {
  _id: string;
  title: string;
  subtitle?: string;
  faqReferences: Array<{
    _id: string;
    question: string;
    answer: string;
    displayOrder: number;
  }>;
  cloneSpecificData?: any;
}

export interface CompleteCloneData {
  hero: FallbackResult<HeroContent>;
  seo: FallbackResult<SeoContent>;
  footer: FallbackResult<FooterContent>;
  navbar: FallbackResult<NavbarContent>;
  tutors: FallbackResult<TutorContent[]>;
  testimonials: FallbackResult<TestimonialContent[]>;
  platformBanner: FallbackResult<PlatformBannerContent>;
  highlights: FallbackResult<HighlightsContent>;
  faqSection: FallbackResult<FaqSectionContent>;
  cloneMetadata: {
    cloneId: string;
    cloneName?: string;
    isBaseline: boolean;
    domain: string;
    fetchedAt: string;
  };
}

/**
 * Resolve content using fallback hierarchy: cloneSpecific → baseline → default
 */
export function resolveFallback<T>(fallbackData: RawFallbackData<T>): T | null {
  try {
    if (fallbackData.cloneSpecific) {
      return fallbackData.cloneSpecific;
    }
    
    if (fallbackData.baseline) {
      return fallbackData.baseline;
    }
    
    if (fallbackData.default) {
      return fallbackData.default;
    }
    
    return null;
  } catch (error) {
    console.error('Error in resolveFallback:', error);
    return null;
  }
}

/**
 * Resolve content with full source information
 */
export function resolveFallbackWithInfo<T>(
  fallbackData: RawFallbackData<T>,
  cloneId?: string
): FallbackResult<T> {
  try {
    if (fallbackData.cloneSpecific) {
      return {
        data: fallbackData.cloneSpecific,
        source: 'cloneSpecific',
        cloneId,
        isBaseline: false,
      };
    }
    
    if (fallbackData.baseline) {
      return {
        data: fallbackData.baseline,
        source: 'baseline',
        cloneId: 'baseline',
        isBaseline: true,
      };
    }
    
    if (fallbackData.default) {
      return {
        data: fallbackData.default,
        source: 'default',
        cloneId: undefined,
        isBaseline: false,
      };
    }
    
    return {
      data: null,
      source: null,
      error: 'No content found in fallback hierarchy',
    };
  } catch (error) {
    return {
      data: null,
      source: null,
      error: `Error resolving fallback: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Build a generic content query with fallback
 */
function buildContentQuery(
  contentType: string,
  cloneId: string,
  fields: string,
  additionalFilter: string = ''
): string {
  const baseFilter = additionalFilter ? ` && ${additionalFilter}` : '';
  
  return `{
    "cloneSpecific": *[_type == "${contentType}" && cloneReference->cloneId.current == "${cloneId}" && isActive == true${baseFilter}][0] {
      ${fields}
    },
    "baseline": *[_type == "${contentType}" && cloneReference->baselineClone == true && isActive == true${baseFilter}][0] {
      ${fields}
    },
    "default": *[_type == "${contentType}" && !defined(cloneReference) && isActive == true${baseFilter}][0] {
      ${fields}
    }
  }`;
}

/**
 * Build a generic array content query with fallback
 */
function buildArrayContentQuery(
  contentType: string,
  cloneId: string,
  fields: string,
  orderBy: string = 'displayOrder asc',
  additionalFilter: string = ''
): string {
  const baseFilter = additionalFilter ? ` && ${additionalFilter}` : '';
  const orderClause = orderBy ? ` | order(${orderBy})` : '';
  
  return `{
    "cloneSpecific": *[_type == "${contentType}" && cloneReference->cloneId.current == "${cloneId}" && isActive == true${baseFilter}]${orderClause} {
      ${fields}
    },
    "baseline": *[_type == "${contentType}" && cloneReference->baselineClone == true && isActive == true${baseFilter}]${orderClause} {
      ${fields}
    },
    "default": *[_type == "${contentType}" && !defined(cloneReference) && isActive == true${baseFilter}]${orderClause} {
      ${fields}
    }
  }`;
}

/**
 * Safe query execution with error handling
 */
async function safeQuery<T>(query: string, params: Record<string, any> = {}): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.error('Query execution error:', error);
    return null;
  }
}

// ============================================================================
// INDIVIDUAL COMPONENT FUNCTIONS
// ============================================================================

/**
 * Get hero content for a specific clone
 */
export async function getHeroForClone(cloneId: string): Promise<FallbackResult<HeroContent>> {
  const fields = `
    _id,
    titleFirstRow,
    titleSecondRow,
    subtitle,
    mainImage,
    primaryButton,
    features,
    rating,
    cloneSpecificData
  `;
  
  const query = buildContentQuery('hero', cloneId, fields);
  const result = await safeQuery<RawFallbackData<HeroContent>>(query);
  
  if (!result) {
    return {
      data: null,
      source: null,
      error: 'Failed to fetch hero content',
    };
  }
  
  return resolveFallbackWithInfo(result, cloneId);
}

/**
 * Get SEO settings for a specific clone
 */
export async function getSeoForClone(cloneId: string): Promise<FallbackResult<SeoContent>> {
  const fields = `
    _id,
    title,
    description,
    cloneSpecificData
  `;
  
  const query = buildContentQuery('seoSettings', cloneId, fields);
  const result = await safeQuery<RawFallbackData<SeoContent>>(query);
  
  if (!result) {
    return {
      data: null,
      source: null,
      error: 'Failed to fetch SEO content',
    };
  }
  
  return resolveFallbackWithInfo(result, cloneId);
}

/**
 * Get footer content for a specific clone
 */
export async function getFooterForClone(cloneId: string): Promise<FallbackResult<FooterContent>> {
  const fields = `
    _id,
    title,
    phone,
    phoneLink,
    whatsapp,
    whatsappLink,
    address,
    addressLink,
    tutorchaseLink,
    cloneSpecificData
  `;
  
  const query = buildContentQuery('footerSection', cloneId, fields);
  const result = await safeQuery<RawFallbackData<FooterContent>>(query);
  
  if (!result) {
    return {
      data: null,
      source: null,
      error: 'Failed to fetch footer content',
    };
  }
  
  return resolveFallbackWithInfo(result, cloneId);
}

/**
 * Get navbar content for a specific clone
 */
export async function getNavbarForClone(cloneId: string): Promise<FallbackResult<NavbarContent>> {
  const fields = `
    _id,
    logo,
    logoLink,
    navigation,
    mobileMenu,
    buttonText,
    buttonLink,
    cloneSpecificData
  `;
  
  const query = buildContentQuery('navbarSettings', cloneId, fields);
  const result = await safeQuery<RawFallbackData<NavbarContent>>(query);
  
  if (!result) {
    return {
      data: null,
      source: null,
      error: 'Failed to fetch navbar content',
    };
  }
  
  return resolveFallbackWithInfo(result, cloneId);
}

/**
 * Get tutors for a specific clone
 */
export async function getTutorsForClone(
  cloneId: string,
  homepageOnly: boolean = false
): Promise<FallbackResult<TutorContent[]>> {
  const fields = `
    _id,
    name,
    professionalTitle,
    displayOrder,
    priceTag,
    displayOnHomepage,
    experience,
    profilePhoto,
    specialization,
    hireButtonLink,
    profilePDF,
    price,
    rating,
    reviewCount,
    activeStudents,
    totalLessons,
    languagesSpoken,
    cloneSpecificData
  `;
  
  const additionalFilter = homepageOnly ? 'displayOnHomepage == true' : '';
  const query = buildArrayContentQuery('tutor', cloneId, fields, 'displayOrder asc', additionalFilter);
  const result = await safeQuery<RawFallbackData<TutorContent[]>>(query);
  
  if (!result) {
    return {
      data: null,
      source: null,
      error: 'Failed to fetch tutors',
    };
  }
  
  // For arrays, return the first non-empty array with highest priority
  if (result.cloneSpecific && result.cloneSpecific.length > 0) {
    return {
      data: result.cloneSpecific,
      source: 'cloneSpecific',
      cloneId,
      isBaseline: false,
    };
  }
  
  if (result.baseline && result.baseline.length > 0) {
    return {
      data: result.baseline,
      source: 'baseline',
      cloneId: 'baseline',
      isBaseline: true,
    };
  }
  
  if (result.default && result.default.length > 0) {
    return {
      data: result.default,
      source: 'default',
      cloneId: undefined,
      isBaseline: false,
    };
  }
  
  return {
    data: [],
    source: null,
    error: 'No tutors found in fallback hierarchy',
  };
}

/**
 * Get testimonials for a specific clone
 */
export async function getTestimonialsForClone(cloneId: string): Promise<FallbackResult<TestimonialContent[]>> {
  const fields = `
    _id,
    reviewerName,
    reviewerType,
    testimonialText,
    rating,
    order,
    cloneSpecificData
  `;
  
  const query = buildArrayContentQuery('testimonial', cloneId, fields, 'order asc');
  const result = await safeQuery<RawFallbackData<TestimonialContent[]>>(query);
  
  if (!result) {
    return {
      data: null,
      source: null,
      error: 'Failed to fetch testimonials',
    };
  }
  
  // For arrays, return the first non-empty array with highest priority
  if (result.cloneSpecific && result.cloneSpecific.length > 0) {
    return {
      data: result.cloneSpecific,
      source: 'cloneSpecific',
      cloneId,
      isBaseline: false,
    };
  }
  
  if (result.baseline && result.baseline.length > 0) {
    return {
      data: result.baseline,
      source: 'baseline',
      cloneId: 'baseline',
      isBaseline: true,
    };
  }
  
  if (result.default && result.default.length > 0) {
    return {
      data: result.default,
      source: 'default',
      cloneId: undefined,
      isBaseline: false,
    };
  }
  
  return {
    data: [],
    source: null,
    error: 'No testimonials found in fallback hierarchy',
  };
}

/**
 * Get platform banner for a specific clone
 */
export async function getPlatformBannerForClone(cloneId: string): Promise<FallbackResult<PlatformBannerContent>> {
  const fields = `
    _id,
    title,
    subtitle,
    description,
    features,
    cloneSpecificData
  `;
  
  const query = buildContentQuery('platformBanner', cloneId, fields);
  const result = await safeQuery<RawFallbackData<PlatformBannerContent>>(query);
  
  if (!result) {
    return {
      data: null,
      source: null,
      error: 'Failed to fetch platform banner content',
    };
  }
  
  return resolveFallbackWithInfo(result, cloneId);
}

/**
 * Get highlights for a specific clone
 */
export async function getHighlightsForClone(cloneId: string): Promise<FallbackResult<HighlightsContent>> {
  const fields = `
    _id,
    highlights,
    cloneSpecificData
  `;
  
  const query = buildContentQuery('highlightsSection', cloneId, fields);
  const result = await safeQuery<RawFallbackData<HighlightsContent>>(query);
  
  if (!result) {
    return {
      data: null,
      source: null,
      error: 'Failed to fetch highlights content',
    };
  }
  
  return resolveFallbackWithInfo(result, cloneId);
}

/**
 * Get FAQ section for a specific clone
 */
export async function getFaqSectionForClone(cloneId: string): Promise<FallbackResult<FaqSectionContent>> {
  const fields = `
    _id,
    title,
    subtitle,
    faqReferences[]-> {
      _id,
      question,
      answer,
      displayOrder
    },
    cloneSpecificData
  `;
  
  const query = buildContentQuery('faq_section', cloneId, fields);
  const result = await safeQuery<RawFallbackData<FaqSectionContent>>(query);
  
  if (!result) {
    return {
      data: null,
      source: null,
      error: 'Failed to fetch FAQ section content',
    };
  }
  
  return resolveFallbackWithInfo(result, cloneId);
}

// ============================================================================
// COMPLETE CLONE DATA FUNCTION
// ============================================================================

/**
 * Get all components for a specific clone in one call
 */
export async function getCompleteCloneData(cloneId?: string): Promise<CompleteCloneData | null> {
  try {
    // Get current clone if no cloneId provided
    const currentClone = cloneId ? await getCloneById(cloneId) : await getCurrentClone();
    
    if (!currentClone) {
      console.error('No clone found for ID:', cloneId);
      return null;
    }
    
    const targetCloneId = currentClone.cloneId.current;
    const currentDomain = getCurrentDomain();
    
    console.log(`Fetching complete clone data for: ${targetCloneId}`);
    
    // Fetch all content in parallel for maximum performance
    const [
      hero,
      seo,
      footer,
      navbar,
      tutors,
      testimonials,
      platformBanner,
      highlights,
      faqSection,
    ] = await Promise.all([
      getHeroForClone(targetCloneId),
      getSeoForClone(targetCloneId),
      getFooterForClone(targetCloneId),
      getNavbarForClone(targetCloneId),
      getTutorsForClone(targetCloneId, true), // Homepage tutors only
      getTestimonialsForClone(targetCloneId),
      getPlatformBannerForClone(targetCloneId),
      getHighlightsForClone(targetCloneId),
      getFaqSectionForClone(targetCloneId),
    ]);
    
    return {
      hero,
      seo,
      footer,
      navbar,
      tutors,
      testimonials,
      platformBanner,
      highlights,
      faqSection,
      cloneMetadata: {
        cloneId: targetCloneId,
        cloneName: currentClone.cloneName,
        isBaseline: currentClone.baselineClone,
        domain: currentDomain,
        fetchedAt: new Date().toISOString(),
      },
    };
    
  } catch (error) {
    console.error('Error fetching complete clone data:', error);
    return null;
  }
} 