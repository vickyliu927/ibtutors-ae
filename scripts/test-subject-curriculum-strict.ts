import { shouldRenderSubjectFromFallback, shouldRenderCurriculumFromFallback } from '../app/lib/subjectStrict';

function assert(condition: boolean, message: string) {
	if (!condition) {
		console.error('Assertion failed:', message);
		process.exitCode = 1;
	}
}

function run() {
	console.log('Running subject/curriculum strictness unit tests...');

	// Subject: only render if clone-specific subjectPage exists
	assert(
		shouldRenderSubjectFromFallback({
			cloneSpecific: { subjectPage: { _id: 'x' } },
			baseline: { subjectPage: { _id: 'y' } },
			default: { subjectPage: { _id: 'z' } },
		}),
		'Subject should render when clone-specific subjectPage exists',
	);
	assert(
		!shouldRenderSubjectFromFallback({
			cloneSpecific: { subjectPage: null },
			baseline: { subjectPage: { _id: 'y' } },
			default: { subjectPage: { _id: 'z' } },
		}),
		'Subject should NOT render with only baseline/default subjectPage',
	);
	assert(
		!shouldRenderSubjectFromFallback({
			cloneSpecific: null,
			baseline: null,
			default: null,
		}),
		'Subject should NOT render when nothing exists',
	);

	// Curriculum: only render if clone-specific object exists
	assert(
		shouldRenderCurriculumFromFallback({
			cloneSpecific: { _id: 'c1' },
			baseline: { _id: 'c2' },
			default: { _id: 'c3' },
		}),
		'Curriculum should render when clone-specific exists',
	);
	assert(
		!shouldRenderCurriculumFromFallback({
			cloneSpecific: null,
			baseline: { _id: 'c2' },
			default: { _id: 'c3' },
		}),
		'Curriculum should NOT render with only baseline/default',
	);
	assert(
		!shouldRenderCurriculumFromFallback({
			cloneSpecific: null,
			baseline: null,
			default: null,
		}),
		'Curriculum should NOT render when nothing exists',
	);

	if (process.exitCode === 1) {
		console.error('❌ Subject/Curriculum strictness tests failed.');
		process.exit(1);
	} else {
		console.log('✅ Subject/Curriculum strictness tests passed.');
	}
}

run();


