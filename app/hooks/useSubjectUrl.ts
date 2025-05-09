'use client';

import { useState, useEffect } from 'react';
import { getSubjectPageUrl, initSlugCache } from '../services/slugManager';

/**
 * Custom hook to get a subject page URL
 * @param subjectNameOrId - The subject name or ID
 * @param hash - Optional hash to append
 */
export const useSubjectUrl = (subjectNameOrId: string, hash?: string): string => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const fetchUrl = async () => {
      // Initialize cache on first run
      await initSlugCache();
      
      // Get URL for this subject
      const pageUrl = await getSubjectPageUrl(subjectNameOrId, hash);
      
      if (isMounted) {
        setUrl(pageUrl);
      }
    };

    fetchUrl();

    return () => {
      isMounted = false;
    };
  }, [subjectNameOrId, hash]);

  return url;
}; 