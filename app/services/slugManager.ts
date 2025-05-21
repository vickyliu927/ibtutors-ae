import { client } from '@/sanity/lib/client';

const CACHE_KEY = 'dt_slug_cache';
const CACHE_TIMEOUT_HOURS = 24;

export interface SubjectPageData {
  _id: string;
  title: string;
  subject: string;
  slug: {
    current: string;
  };
}

export interface CurriculumPageData {
  _id: string;
  title: string;
  curriculum: string;
  slug: {
    current: string;
  };
}

// In-memory cache for slugs
let slugCache: Record<string, string> = {};
let initialized = false;

/**
 * Initialize the slug cache from localStorage or fetch fresh data
 */
export const initSlugCache = async (): Promise<void> => {
  if (initialized) return;
  
  try {
    // Check if we have cached data in localStorage
    if (typeof window !== 'undefined') {
      const cachedData = localStorage.getItem(CACHE_KEY);
      
      if (cachedData) {
        const cacheObj = JSON.parse(cachedData);
        const now = new Date().getTime();
        
        // Use cached data if it's not expired
        if (cacheObj.expiry > now) {
          slugCache = cacheObj.data;
          initialized = true;
          console.log('Loaded slug cache from localStorage:', Object.keys(slugCache).length, 'entries');
          return;
        }
      }
    }
    
    // Fetch fresh data if no cache or expired cache
    await refreshSlugCache();
    initialized = true;
  } catch (error) {
    console.error('Error initializing slug cache:', error);
    // Still mark as initialized to prevent repeated init calls
    initialized = true;
  }
};

/**
 * Refresh the slug cache with fresh data from Sanity
 */
export const refreshSlugCache = async (): Promise<void> => {
  try {
    // Fetch subject pages
    const subjectPages = await client.fetch<SubjectPageData[]>(`
      *[_type == "subjectPage"] {
        _id,
        title,
        subject,
        slug
      }
    `);
    
    // Fetch curriculum pages
    const curriculumPages = await client.fetch<CurriculumPageData[]>(`
      *[_type == "curriculumPage"] {
        _id,
        title,
        curriculum,
        slug
      }
    `);
    
    // Reset cache
    const newCache: Record<string, string> = {};
    
    // Add subject pages to cache
    subjectPages.forEach(page => {
      if (page.subject && page.slug) {
        newCache[page.subject.toLowerCase()] = page.slug.current;
        newCache[page._id] = page.slug.current;
      }
    });
    
    // Add curriculum pages to cache
    curriculumPages.forEach(page => {
      if (page.curriculum && page.slug) {
        newCache[page.curriculum.toLowerCase()] = page.slug.current;
        newCache[page._id] = page.slug.current;
      }
    });
    
    // Update in-memory cache
    slugCache = newCache;
    
    // Save to localStorage if possible
    if (typeof window !== 'undefined') {
      const expiry = new Date().getTime() + (CACHE_TIMEOUT_HOURS * 60 * 60 * 1000);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: slugCache,
        expiry
      }));
    }
    
    console.log('Slug cache initialized with', Object.keys(slugCache).length, 'entries');
  } catch (error) {
    console.error('Error refreshing slug cache:', error);
  }
};

/**
 * Get the URL for a subject page
 * @param subjectNameOrId - The subject name (e.g., "English") or ID
 * @param hash - Optional hash to append (e.g., "#contact-form")
 */
export const getSubjectPageUrl = async (subjectNameOrId: string, hash?: string): Promise<string> => {
  if (!initialized) {
    await initSlugCache();
  }

  // Normalize for lookup
  const key = subjectNameOrId.toLowerCase();
  let slug = slugCache[key];

  // If not in cache, fetch directly
  if (!slug) {
    try {
      console.log(`Slug not found in cache for: ${key}, fetching directly`);
      
      // Try to fetch by ID first
      let result = await client.fetch<SubjectPageData | null>(
        `*[_type == "subjectPage" && (_id == $id || lower(subject) == $subject)][0] {
          slug
        }`,
        { 
          id: subjectNameOrId,
          subject: key
        }
      );

      if (result && result.slug) {
        slug = result.slug.current;
        // Update cache
        slugCache[key] = slug;
        
        // Update localStorage if available
        if (typeof window !== 'undefined') {
          try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
              const cacheObj = JSON.parse(cachedData);
              cacheObj.data[key] = slug;
              localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
            }
          } catch (e) {
            console.warn('Failed to update localStorage cache:', e);
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching slug for ${subjectNameOrId}:`, error);
    }
  }

  // Default to fallback if still not found
  if (!slug) {
    console.warn(`No slug found for subject: ${subjectNameOrId}`);
    return hash ? `/#${hash}` : '/';
  }

  return hash ? `/${slug}#${hash}` : `/${slug}`;
};

/**
 * Get the URL for a curriculum page
 * @param curriculumNameOrId - The curriculum name (e.g., "IB") or ID
 * @param hash - Optional hash to append (e.g., "#contact-form")
 */
export const getCurriculumPageUrl = async (curriculumNameOrId: string, hash?: string): Promise<string> => {
  if (!initialized) {
    await initSlugCache();
  }

  // Normalize for lookup
  const key = curriculumNameOrId.toLowerCase();
  let slug = slugCache[key];

  // If not in cache, fetch directly
  if (!slug) {
    try {
      console.log(`Slug not found in cache for: ${key}, fetching directly`);
      
      // Try to fetch by ID first
      let result = await client.fetch<CurriculumPageData | null>(
        `*[_type == "curriculumPage" && (_id == $id || lower(curriculum) == $curriculum)][0] {
          slug
        }`,
        { 
          id: curriculumNameOrId,
          curriculum: key
        }
      );

      if (result && result.slug) {
        slug = result.slug.current;
        // Update cache
        slugCache[key] = slug;
        
        // Update localStorage if available
        if (typeof window !== 'undefined') {
          try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
              const cacheObj = JSON.parse(cachedData);
              cacheObj.data[key] = slug;
              localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
            }
          } catch (e) {
            console.warn('Failed to update localStorage cache:', e);
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching slug for ${curriculumNameOrId}:`, error);
    }
  }

  // Default to fallback if still not found
  if (!slug) {
    console.warn(`No slug found for curriculum: ${curriculumNameOrId}`);
    return hash ? `/#${hash}` : '/';
  }

  return hash ? `/curriculum/${slug}#${hash}` : `/curriculum/${slug}`;
}; 