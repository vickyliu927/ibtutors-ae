import { headers } from 'next/headers';
import { CloneData, getCloneById, getBaselineClone, getCompleteCloneData, CompleteCloneData } from './cloneUtils';

// ============================================================================
// CLONE DETECTION AND PARAMETER HANDLING
// ============================================================================

/**
 * Extract clone ID from various sources (headers, URL params, etc.)
 */
export async function getCloneIdFromRequest(searchParams?: URLSearchParams): Promise<string | null> {
  try {
    // First check URL parameters (for testing/development)
    if (searchParams) {
      const cloneIdParam = searchParams.get('clone') || searchParams.get('cloneId');
      if (cloneIdParam) {
        console.log(`[ClonePageUtils] Found clone ID in URL params: ${cloneIdParam}`);
        return cloneIdParam;
      }
    }

    // Check middleware headers (primary method)
    const headersList = headers();
    const cloneIdHeader = headersList.get('x-clone-id');
    
    if (cloneIdHeader) {
      console.log(`[ClonePageUtils] Found clone ID in headers: ${cloneIdHeader}`);
      return cloneIdHeader;
    }

    console.log('[ClonePageUtils] No clone ID found in request');
    return null;
  } catch (error) {
    console.error('[ClonePageUtils] Error extracting clone ID from request:', error);
    return null;
  }
}

/**
 * Get clone data from ID with proper fallback
 */
export async function getCloneFromId(cloneId: string | null): Promise<CloneData | null> {
  if (!cloneId) {
    return await getBaselineClone();
  }

  try {
    const clone = await getCloneById(cloneId);
    if (clone) {
      return clone;
    }
    
    // Fallback to baseline if specific clone not found
    console.log(`[ClonePageUtils] Clone ID ${cloneId} not found, falling back to baseline`);
    return await getBaselineClone();
  } catch (error) {
    console.error(`[ClonePageUtils] Error fetching clone ${cloneId}:`, error);
    return await getBaselineClone();
  }
}

// ============================================================================
// PAGE DATA INTERFACES
// ============================================================================

/**
 * Enhanced page data with clone context
 */
export interface CloneAwarePageData<T = any> {
  pageData: T | null;
  cloneData: CompleteCloneData | null;
  cloneContext: {
    cloneId: string | null;
    clone: CloneData | null;
    source: 'header' | 'url-param' | 'baseline' | 'default';
    isBaseline: boolean;
    error?: string;
  };
  debugInfo?: {
    requestHeaders: Record<string, string>;
    urlParams: Record<string, string>;
    contentSources: Record<string, string>;
    timestamp: string;
  };
}

/**
 * Error boundary result for fallback scenarios
 */
export interface PageErrorResult {
  hasError: boolean;
  error?: Error;
  fallbackData?: any;
  errorSource: 'clone-detection' | 'data-fetching' | 'content-resolution' | 'unknown';
}

// ============================================================================
// CLONE-AWARE PAGE DATA FETCHER
// ============================================================================

/**
 * Enhanced page data fetcher with clone context and error handling
 */
export async function getCloneAwarePageData<T>(
  searchParams: URLSearchParams | undefined,
  pageDataFetcher: (cloneId: string | null) => Promise<T | null>,
  pageName: string = 'unknown'
): Promise<CloneAwarePageData<T>> {
  const startTime = Date.now();
  let errorResult: PageErrorResult = { hasError: false, errorSource: 'unknown' };

  try {
    console.log(`[ClonePageUtils] Starting clone-aware data fetch for ${pageName}`);

    // Step 1: Extract clone ID from request
    const cloneId = await getCloneIdFromRequest(searchParams);
    const source = cloneId ? 
      (searchParams?.get('clone') || searchParams?.get('cloneId') ? 'url-param' : 'header') : 
      'baseline';

    // Step 2: Get clone context
    const clone = await getCloneFromId(cloneId);
    const isBaseline = clone?.baselineClone || false;

    console.log(`[ClonePageUtils] Clone context for ${pageName}:`, {
      cloneId,
      cloneName: clone?.cloneName,
      source,
      isBaseline
    });

    // Step 3: Fetch clone-aware content data
    let cloneData: CompleteCloneData | null = null;
    try {
      if (cloneId || clone) {
        cloneData = await getCompleteCloneData(cloneId || clone?.cloneId?.current);
      }
    } catch (error) {
      console.error(`[ClonePageUtils] Error fetching clone data for ${pageName}:`, error);
      errorResult = {
        hasError: true,
        error: error as Error,
        errorSource: 'data-fetching'
      };
    }

    // Step 4: Fetch page-specific data
    let pageData: T | null = null;
    try {
      pageData = await pageDataFetcher(cloneId);
    } catch (error) {
      console.error(`[ClonePageUtils] Error fetching page data for ${pageName}:`, error);
      errorResult = {
        hasError: true,
        error: error as Error,
        errorSource: 'content-resolution',
        fallbackData: pageData
      };
    }

    // Step 5: Prepare debug info
    let debugInfo: CloneAwarePageData<T>['debugInfo'];
    if (process.env.NODE_ENV === 'development') {
      const headersList = headers();
      debugInfo = {
        requestHeaders: {
          'x-clone-id': headersList.get('x-clone-id') || 'none',
          'x-clone-name': headersList.get('x-clone-name') || 'none',
          'x-clone-source': headersList.get('x-clone-source') || 'none',
          'host': headersList.get('host') || 'none',
        },
        urlParams: searchParams ? Object.fromEntries(searchParams.entries()) : {},
        contentSources: cloneData ? {
          hero: cloneData.hero.source || 'none',
          seo: cloneData.seo.source || 'none',
          footer: cloneData.footer.source || 'none',
          navbar: cloneData.navbar.source || 'none',
          tutors: cloneData.tutors.source || 'none',
          testimonials: cloneData.testimonials.source || 'none',
          platformBanner: cloneData.platformBanner.source || 'none',
          highlights: cloneData.highlights.source || 'none',
          faqSection: cloneData.faqSection.source || 'none',
        } : {},
        timestamp: new Date().toISOString()
      };
    }

    const result: CloneAwarePageData<T> = {
      pageData,
      cloneData,
      cloneContext: {
        cloneId,
        clone,
        source,
        isBaseline,
        error: errorResult.hasError ? errorResult.error?.message : undefined
      },
      debugInfo
    };

    console.log(`[ClonePageUtils] Completed ${pageName} data fetch in ${Date.now() - startTime}ms`);
    return result;

  } catch (error) {
    console.error(`[ClonePageUtils] Critical error in getCloneAwarePageData for ${pageName}:`, error);
    
    // Return safe fallback structure
    return {
      pageData: null,
      cloneData: null,
      cloneContext: {
        cloneId: null,
        clone: null,
        source: 'default',
        isBaseline: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      debugInfo: process.env.NODE_ENV === 'development' ? {
        requestHeaders: {},
        urlParams: {},
        contentSources: {},
        timestamp: new Date().toISOString()
      } : undefined
    };
  }
}

// ============================================================================
// CLONE INDICATOR BANNER COMPONENT PROPS
// ============================================================================

export interface CloneIndicatorProps {
  cloneContext: CloneAwarePageData['cloneContext'];
  cloneData?: CompleteCloneData | null;
  debugInfo?: CloneAwarePageData['debugInfo'];
  pageName: string;
}

/**
 * Generate clone indicator banner data for development/testing
 */
export function getCloneIndicatorData(
  cloneContext: CloneAwarePageData['cloneContext'],
  cloneData: CompleteCloneData | null,
  debugInfo: CloneAwarePageData['debugInfo'],
  pageName: string
): CloneIndicatorProps {
  return {
    cloneContext,
    cloneData,
    debugInfo,
    pageName
  };
}

// ============================================================================
// CONTENT MERGING UTILITIES
// ============================================================================

/**
 * Merge clone-specific content with page-specific content
 */
export function mergeCloneContent<T extends Record<string, any>>(
  pageContent: T | null,
  cloneContent: any,
  contentType: string
): T | null {
  if (!pageContent) {
    return cloneContent?.data || null;
  }

  if (!cloneContent?.data) {
    return pageContent;
  }

  try {
    // Apply clone customizations to page content
    const merged = {
      ...pageContent,
      ...cloneContent.data,
      // Preserve clone metadata for debugging
      _cloneSource: cloneContent.source,
      _cloneId: cloneContent.cloneId,
      _isBaseline: cloneContent.isBaseline
    };

    console.log(`[ClonePageUtils] Merged ${contentType} content from source: ${cloneContent.source}`);
    return merged;
  } catch (error) {
    console.error(`[ClonePageUtils] Error merging ${contentType} content:`, error);
    return pageContent;
  }
}

/**
 * Safe content resolver with fallback
 */
export function resolveContentSafely<T>(
  cloneContent: { data: T | null; source: string | null } | null,
  fallbackContent: T | null,
  contentType: string
): T | null {
  try {
    if (cloneContent?.data) {
      console.log(`[ClonePageUtils] Using ${contentType} from clone source: ${cloneContent.source}`);
      return cloneContent.data;
    }

    if (fallbackContent) {
      console.log(`[ClonePageUtils] Using fallback ${contentType} content`);
      return fallbackContent;
    }

    console.log(`[ClonePageUtils] No ${contentType} content available`);
    return null;
  } catch (error) {
    console.error(`[ClonePageUtils] Error resolving ${contentType} content:`, error);
    return fallbackContent;
  }
} 