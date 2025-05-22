/**
 * A simplified version of link utilities for server components
 * This avoids using client-side hooks while providing safe defaults
 */

/**
 * Get standard rel attributes for external links in server components
 * This is a simplified version that doesn't require fetching settings
 */
export function getServerRelAttributes(url: string, existingRel?: string): string {
  // Start with existing rel values if present
  const relValues = existingRel ? existingRel.split(' ') : [];
  
  // For external links (not starting with / or #), add standard security attributes
  if (!url.startsWith('/') && !url.startsWith('#')) {
    if (!relValues.includes('noopener')) relValues.push('noopener');
    if (!relValues.includes('noreferrer')) relValues.push('noreferrer');
    
    // Add nofollow by default for external links in server components
    // This is a safe default when we can't access the settings
    if (!relValues.includes('nofollow')) relValues.push('nofollow');
  }
  
  return relValues.join(' ');
} 