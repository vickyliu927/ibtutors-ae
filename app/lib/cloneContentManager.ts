import { getCurrentClone } from './cloneUtils';
import { homepageQueries, seoQueries, heroQueries, ContentResult } from './cloneQueries';

/**
 * High-level content manager that combines clone detection with query system
 */
export class CloneContentManager {
  private static instance: CloneContentManager;
  private currentCloneId: string | null = null;

  private constructor() {}

  static getInstance(): CloneContentManager {
    if (!CloneContentManager.instance) {
      CloneContentManager.instance = new CloneContentManager();
    }
    return CloneContentManager.instance;
  }

  /**
   * Initialize with current clone context
   */
  async initialize(): Promise<void> {
    const currentClone = await getCurrentClone();
    this.currentCloneId = currentClone?.cloneId?.current || null;
  }

  /**
   * Get current clone ID (fallback to baseline if needed)
   */
  getCurrentCloneId(): string {
    return this.currentCloneId || 'baseline';
  }

  /**
   * Fetch all homepage content with fallback hierarchy
   */
  async getHomepageContent() {
    const cloneId = this.getCurrentCloneId();
    return await homepageQueries.fetchAll(cloneId);
  }

  /**
   * Fetch SEO settings for current domain
   */
  async getSeoSettings(): Promise<ContentResult<any>> {
    const cloneId = this.getCurrentCloneId();
    return await seoQueries.fetch(cloneId);
  }

  /**
   * Fetch hero content for current domain
   */
  async getHeroContent(): Promise<ContentResult<any>> {
    const cloneId = this.getCurrentCloneId();
    return await heroQueries.fetch(cloneId);
  }
}

/**
 * Convenience function for getting homepage content
 */
export async function getHomepageContentForCurrentDomain() {
  const manager = CloneContentManager.getInstance();
  await manager.initialize();
  return await manager.getHomepageContent();
}

/**
 * Convenience function for getting SEO settings
 */
export async function getSeoSettingsForCurrentDomain() {
  const manager = CloneContentManager.getInstance();
  await manager.initialize();
  return await manager.getSeoSettings();
}

/**
 * Convenience function for getting hero content
 */
export async function getHeroContentForCurrentDomain() {
  const manager = CloneContentManager.getInstance();
  await manager.initialize();
  return await manager.getHeroContent();
} 