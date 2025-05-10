import { client } from '@/sanity/lib/client';

interface SubjectPageData {
  title: string;
  subject: string;
  slug: {
    current: string;
  };
  displayOrder: number;
}

async function getSubjectPages() {
  const query = `*[_type == "subjectPage"] | order(displayOrder asc) {
    title,
    subject,
    slug,
    displayOrder
  }`;
  
  return client.fetch<SubjectPageData[]>(query);
}

export { getSubjectPages, type SubjectPageData }; 