import React from 'react';
import type { Metadata } from 'next';

// Reuse the existing subject/curriculum dynamic page renderer
// from the top-level `[subject]` route.
// This allows `/[curriculum]/[subject]` (e.g., /ib/maths)
// to render the same content as `/[subject]` while preserving the combined URL.
//
// Note: Importing from a bracket-named file is supported by Node/TS when using a string path.
// The imported component is an async Server Component and can be rendered directly.
//
// eslint-disable-next-line import/no-relative-packages
import SubjectDynamicPage, { generateMetadata as generateSubjectMetadata } from '../../[subject]/page';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { curriculum: string; subject: string } }): Promise<Metadata> {
  // Use combined slug to target existing `curriculum-subject` pages (e.g., ossd-math)
  const combinedSlug = `${params.curriculum}-${params.subject}`;
  return generateSubjectMetadata({ params: { subject: combinedSlug } } as any);
}

export default function CurriculumSubjectPage({
  params,
  searchParams,
}: {
  params: { curriculum: string; subject: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Combine curriculum + subject to match existing `curriculum-subject` slugs
  // so that `/ossd/math` maps to the page with slug `ossd-math`.
  const combinedSlug = `${params.curriculum}-${params.subject}`;
  return (
    <SubjectDynamicPage
      params={{ subject: combinedSlug } as any}
      searchParams={searchParams}
    />
  );
}


