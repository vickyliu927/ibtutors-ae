import React from 'react';
import type { Metadata } from 'next';

// Reuse the parent `[subject]` page renderer and metadata
import SubjectDynamicPage, { generateMetadata as generateSubjectMetadata } from '../page';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { subject: string; child: string } }): Promise<Metadata> {
  // Compose slash-style combined slug, e.g. `ossd/math`
  const combinedSlug = `${params.subject}/${params.child}`;
  return generateSubjectMetadata({ params: { subject: combinedSlug } } as any);
}

export default function SubjectChildCombinedPage({
  params,
  searchParams,
}: {
  params: { subject: string; child: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const combinedSlug = `${params.subject}/${params.child}`;
  return (
    <SubjectDynamicPage
      params={{ subject: combinedSlug } as any}
      searchParams={searchParams}
    />
  );
}


