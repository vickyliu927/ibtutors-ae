import { client } from '@/sanity/lib/client';

// Types
interface SubjectPageData {
  _id: string;
  subject: string;
  slug: {
    current: string;
  };
}

// Cache for subject slugs
let slugCache: Record<string, string> = {};
let initialized = false;
const CACHE_KEY = 'subject_slugs_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Initialize the slug cache
 */
export const initSlugCache = async (): Promise<void> => {
  if (initialized) return;

  try {
    // Try to load from localStorage first (client-side only)
    if (typeof window !== 'undefined') {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          const now = Date.now();

          // Check if cache is still valid
          if (now - timestamp < CACHE_TTL) {
            slugCache = data;
            initialized = true;
            console.log('Loaded slug cache from localStorage');
            return;
          } else {
            console.log('Slug cache expired, refreshing...');
          }
        } catch (e) {
          console.warn('Invalid slug cache in localStorage:', e);
        }
      }
    }

    // Fetch all slugs at once
    console.log('Fetching all subject slugs');
    const subjectPages = await client.fetch<SubjectPageData[]>(
      `*[_type == "subjectPage"] {
        _id,
        subject,
        slug
      }`,
      {},
      { next: { revalidate: 3600 } } // Cache for 1 hour on server
    );

    // Build cache of subject -> slug mappings
    slugCache = subjectPages.reduce((cache, page) => {
      return {
        ...cache,
        [page.subject.toLowerCase()]: page.slug.current,
        [page._id]: page.slug.current,
      };
    }, {});

    // Store in localStorage if available
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: slugCache,
          timestamp: Date.now(),
        })
      );
    }

    initialized = true;
    console.log('Slug cache initialized with', Object.keys(slugCache).length, 'entries');
  } catch (error) {
    console.error('Failed to initialize slug cache:', error);
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