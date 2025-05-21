import { useState, useEffect } from 'react';
import { getLinkSettings, getRelAttribute, shouldApplyNofollow } from '@/app/lib/linkUtils';

// Define the interface locally to avoid import issues
interface LinkSettings {
  defaultNofollow: boolean;
  nofollowDomains: string[];
  followDomains: string[];
}

export function useLinkSettings() {
  const [settings, setSettings] = useState<LinkSettings>({
    defaultNofollow: false,
    nofollowDomains: [],
    followDomains: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchSettings = async () => {
      try {
        const linkSettings = await getLinkSettings();
        if (isMounted) {
          setSettings(linkSettings);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in useLinkSettings hook:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSettings();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Function to get the rel attribute for a given URL
  const getRel = (url: string, existingRel?: string) => {
    return getRelAttribute(url, settings, existingRel);
  };

  // Function to check if nofollow should be applied
  const checkNofollow = (url: string) => {
    return shouldApplyNofollow(url, settings);
  };

  return {
    settings,
    isLoading,
    getRel,
    checkNofollow
  };
} 