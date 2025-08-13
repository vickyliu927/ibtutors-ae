import { permanentRedirect } from 'next/navigation';

export default function CurriculumRedirect({ params }: { params: { curriculum: string } }) {
  // Redirect from old /curriculum/[slug] to new /[slug] format
  permanentRedirect(`/${params.curriculum}`);
} 