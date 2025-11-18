/**
 * Strict subject page rendering rule:
 * Only render when clone-specific subjectPage exists.
 */
export function shouldRenderSubjectFromFallback(fallback: {
	cloneSpecific?: { subjectPage?: unknown } | null;
	baseline?: { subjectPage?: unknown } | null;
	default?: { subjectPage?: unknown } | null;
}): boolean {
	return Boolean(fallback?.cloneSpecific?.subjectPage);
}

/**
 * Strict curriculum page rendering rule:
 * Only render when clone-specific curriculum page exists (top-level object).
 */
export function shouldRenderCurriculumFromFallback(fallback: {
	cloneSpecific?: unknown | null;
	baseline?: unknown | null;
	default?: unknown | null;
}): boolean {
	return Boolean(fallback?.cloneSpecific);
}


