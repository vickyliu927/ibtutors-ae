'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CurriculumErrorRedirect() {
  const router = useRouter();
  const params = useParams();
  const curriculum = params?.curriculum as string;

  useEffect(() => {
    // Redirect to the new URL structure
    if (curriculum) {
      router.replace(`/${curriculum}`);
    } else {
      router.replace('/');
    }
  }, [curriculum, router]);

  // This component won't actually render as it redirects
  return null;
} 