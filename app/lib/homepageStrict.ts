import type { ContentSource } from './cloneQueries';

export type HomepageContentLike = {
	hero?: { source?: ContentSource | null } | null;
};

/**
 * Decide whether the homepage should render based on strict clone rules.
 * - If cloneId is truthy, require hero.source === 'cloneSpecific'
 * - If no cloneId (global/baseline), allow rendering
 */
export function shouldRenderHomepage(
	cloneId: string | null,
	content: HomepageContentLike,
): boolean {
	if (cloneId) {
		return content?.hero?.source === 'cloneSpecific';
	}
	return true;
}

/**
 * Convenience inverse for readability at call sites.
 */
export function should404Homepage(
	cloneId: string | null,
	content: HomepageContentLike,
): boolean {
	return !shouldRenderHomepage(cloneId, content);
}


