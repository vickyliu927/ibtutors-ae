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

/**
 * Initialize the slug cache
 */
export const initSlugCache = async (): Promise<void> => {
  if (initialized) return;

  try {
    const subjectPages = await client.fetch<SubjectPageData[]>(`
      *[_type == "subjectPage"] {
        _id,
        subject,
        slug
      }
    `);

    // Build cache of subject -> slug mappings
    slugCache = subjectPages.reduce((cache, page) => {
      return {
        ...cache,
        [page.subject.toLowerCase()]: page.slug.current,
        [page._id]: page.slug.current,
      };
    }, {});

    initialized = true;
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
      // Try to fetch by ID first
      let result = await client.fetch<SubjectPageData | null>(`
        *[_type == "subjectPage" && _id == $id][0] {
          slug
        }
      `, { id: subjectNameOrId });

      // If not found, try by subject name
      if (!result) {
        result = await client.fetch<SubjectPageData | null>(`
          *[_type == "subjectPage" && lower(subject) == $subject][0] {
            slug
          }
        `, { subject: key });
      }

      if (result && result.slug) {
        slug = result.slug.current;
        // Update cache
        slugCache[key] = slug;
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