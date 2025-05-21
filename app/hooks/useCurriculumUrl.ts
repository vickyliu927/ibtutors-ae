'use client';

import { useState, useEffect } from 'react';
import { getCurriculumPageUrl, initSlugCache } from '../services/slugManager';

/**
 * Custom hook to get a curriculum page URL
 * @param curriculumNameOrId - The curriculum name or ID
 * @param hash - Optional hash to append
 */
export const useCurriculumUrl = (curriculumNameOrId: string, hash?: string): string => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const fetchUrl = async () => {
      // Initialize cache on first run
      await initSlugCache();
      
      // Get URL for this curriculum
      const pageUrl = await getCurriculumPageUrl(curriculumNameOrId, hash);
      
      if (isMounted) {
        setUrl(pageUrl);
      }
    };

    fetchUrl();

    return () => {
      isMounted = false;
    };
  }, [curriculumNameOrId, hash]);

  return url;
}; 