import { shouldRenderHomepage, should404Homepage } from '../app/lib/homepageStrict';

type Content = { hero?: { source?: string } | null };

function assert(condition: boolean, message: string) {
	if (!condition) {
		console.error('Assertion failed:', message);
		process.exitCode = 1;
	}
}

function run() {
	console.log('Running homepage strictness unit tests...');

	// Case 1: No clone (global/baseline) should render regardless of hero source
	assert(shouldRenderHomepage(null, { hero: { source: 'default' } }), 'Global should render even with default hero');
	assert(shouldRenderHomepage(null, { hero: { source: 'baseline' } }), 'Global should render even with baseline hero');
	assert(shouldRenderHomepage(null, { hero: { source: 'cloneSpecific' } }), 'Global should render with cloneSpecific hero');
	assert(shouldRenderHomepage(null, { hero: null }), 'Global should render even with missing hero');

	// Case 2: Clone present must be cloneSpecific
	const cloneId = 'qa';
	assert(shouldRenderHomepage(cloneId, { hero: { source: 'cloneSpecific' } }), 'Clone should render with cloneSpecific hero');
	assert(!shouldRenderHomepage(cloneId, { hero: { source: 'baseline' } }), 'Clone must not render with baseline hero');
	assert(!shouldRenderHomepage(cloneId, { hero: { source: 'default' } }), 'Clone must not render with default hero');
	assert(!shouldRenderHomepage(cloneId, { hero: null }), 'Clone must not render with missing hero');

	// Case 3: Inverse helper
	assert(!should404Homepage(null, { hero: { source: 'default' } }), 'Global should not 404 with default');
	assert(should404Homepage(cloneId, { hero: { source: 'default' } }), 'Clone should 404 with default');

	if (process.exitCode === 1) {
		console.error('❌ Homepage strictness tests failed.');
		process.exit(1);
	} else {
		console.log('✅ Homepage strictness tests passed.');
	}
}

run();


