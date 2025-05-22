import { client } from '@/sanity/lib/client';

export interface SubjectPageData {
  _id: string;
  title: string;
  subject: string;
  slug: {
    current: string;
  };
  displayOrder: number;
  firstSection: {
    title: string;
    highlightedWords?: string[];
    description: string;
  };
}

export async function getSubjectGridData() {
  try {
    const query = `*[_type == "subjectPage"] | order(displayOrder asc) {
      _id,
      title,
      subject,
      slug,
      displayOrder,
      firstSection
    }`;
    
    // Fetch with revalidation set to 600 seconds (10 minutes)
    const data = await client.fetch<SubjectPageData[]>(
      query,
      {},
      { next: { revalidate: 600 } }
    );
    
    return data;
  } catch (err) {
    console.error('Error fetching subjects:', err);
    return [];
  }
} 