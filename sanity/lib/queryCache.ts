import { client } from './client';

/**
 * Interface for a cache entry
 */
type CacheEntry = {
  data: any;
  timestamp: number;
  expiresAt: number;
};

/**
 * In-memory cache for GROQ queries
 */
const queryCache: Record<string, CacheEntry> = {};

/**
 * Default cache TTL (5 minutes)
 */
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Maximum number of entries to keep in the cache
 */
const MAX_CACHE_SIZE = 100;

/**
 * Generate a cache key from a query and params
 */
const generateCacheKey = (query: string, params: any = {}): string => {
  return JSON.stringify({ query, params });
};

/**
 * Clean up old entries from the cache
 */
const cleanupCache = (): void => {
  const now = Date.now();
  const entries = Object.entries(queryCache);
  
  // If we're under the limit, only clean expired entries
  if (entries.length <= MAX_CACHE_SIZE) {
    // Remove expired entries
    for (const [key, entry] of entries) {
      if (entry.expiresAt < now) {
        delete queryCache[key];
      }
    }
    return;
  }
  
  // If we're over the limit, sort by timestamp and keep the newest ones
  entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
  const toKeep = entries.slice(0, MAX_CACHE_SIZE - 10); // Keep some buffer
  
  // Reset the cache with only the entries to keep
  Object.keys(queryCache).forEach(key => delete queryCache[key]);
  
  // Add back the entries to keep
  toKeep.forEach(([key, entry]) => {
    queryCache[key] = entry;
  });
};

/**
 * Fetch data from Sanity with caching
 * 
 * @param query - GROQ query string
 * @param params - Query parameters
 * @param options - Fetch options
 * @param cacheTTL - Cache TTL in milliseconds (default: 5 minutes)
 * @returns - Fetched data
 */
export const cachedFetch = async <T = any>(
  query: string,
  params: Record<string, any> = {},
  options: Record<string, any> = {},
  cacheTTL: number = DEFAULT_CACHE_TTL
): Promise<T> => {
  const cacheKey = generateCacheKey(query, params);
  const now = Date.now();
  
  // Check cache
  if (queryCache[cacheKey] && queryCache[cacheKey].expiresAt > now) {
    console.log('Cache hit for query:', query);
    return queryCache[cacheKey].data as T;
  }
  
  console.log('Cache miss for query:', query);
  
  // Not in cache or expired, fetch from Sanity
  const data = await client.fetch<T>(query, params, options);
  
  // Store in cache
  queryCache[cacheKey] = {
    data,
    timestamp: now,
    expiresAt: now + cacheTTL
  };
  
  // Clean up cache if needed
  cleanupCache();
  
  return data;
};

/**
 * Clear specific entries from the cache
 * 
 * @param pattern - Regex pattern to match against query strings
 */
export const clearCacheEntries = (pattern: RegExp): void => {
  for (const key in queryCache) {
    try {
      const { query } = JSON.parse(key);
      if (pattern.test(query)) {
        delete queryCache[key];
      }
    } catch (e) {
      console.warn('Failed to parse cache key:', key);
    }
  }
};

/**
 * Clear the entire cache
 */
export const clearCache = (): void => {
  Object.keys(queryCache).forEach(key => delete queryCache[key]);
}; 