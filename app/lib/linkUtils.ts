import { client } from '@/sanity/lib/client';

interface LinkSettings {
  defaultNofollow: boolean;
  nofollowDomains: string[];
  followDomains: string[];
}

// Cache for link settings to avoid repeatedly fetching the same data
let cachedLinkSettings: LinkSettings | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function getLinkSettings(): Promise<LinkSettings> {
  const now = Date.now();
  
  // Return cached settings if they're still valid
  if (cachedLinkSettings && now - lastFetchTime < CACHE_TTL) {
    return cachedLinkSettings;
  }

  try {
    const settings = await client.fetch<LinkSettings>(`
      *[_type == "linkSettings" && !(_id in path("drafts.**"))][0]{
        "defaultNofollow": defaultNofollow,
        "nofollowDomains": nofollowDomains,
        "followDomains": followDomains
      }
    `);

    if (settings) {
      cachedLinkSettings = settings;
      lastFetchTime = now;
      return settings;
    }
  } catch (error) {
    console.error('Error fetching link settings:', error);
  }

  // Default settings if none are found
  return {
    defaultNofollow: false,
    nofollowDomains: [],
    followDomains: []
  };
}

export function extractHostname(url: string): string {
  try {
    // Create a URL object to parse the hostname
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace(/^www\./i, '');
  } catch (e) {
    // If URL parsing fails, return an empty string
    return '';
  }
}

export function shouldApplyNofollow(url: string, settings: LinkSettings): boolean {
  // Don't apply nofollow to same-site URLs (those starting with / or #)
  if (url.startsWith('/') || url.startsWith('#')) {
    return false;
  }

  const hostname = extractHostname(url);
  
  // Skip if hostname couldn't be extracted
  if (!hostname) {
    return false;
  }

  // If hostname is in the follow domains list, don't apply nofollow
  if (settings.followDomains?.some(domain => hostname.includes(domain))) {
    return false;
  }

  // If hostname is in the nofollow domains list, apply nofollow
  if (settings.nofollowDomains?.some(domain => hostname.includes(domain))) {
    return true;
  }

  // Apply the default setting
  return settings.defaultNofollow;
}

export function getRelAttribute(url: string, settings: LinkSettings, existingRel?: string): string {
  // Start with existing rel values if present
  const relValues = existingRel ? existingRel.split(' ') : [];
  
  // Add standard values for external links
  if (!url.startsWith('/') && !url.startsWith('#')) {
    if (!relValues.includes('noopener')) relValues.push('noopener');
    if (!relValues.includes('noreferrer')) relValues.push('noreferrer');
  }
  
  // Add or remove nofollow based on settings
  if (shouldApplyNofollow(url, settings)) {
    if (!relValues.includes('nofollow')) relValues.push('nofollow');
  } else {
    // Remove nofollow if it's already there but shouldn't be
    const nofollowIndex = relValues.indexOf('nofollow');
    if (nofollowIndex !== -1) {
      relValues.splice(nofollowIndex, 1);
    }
  }
  
  return relValues.join(' ');
} 