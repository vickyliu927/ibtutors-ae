import { client } from '@/sanity/lib/client';

interface SubjectPageData {
  title: string;
  subject: string;
  slug: {
    current: string;
  };
}

async function getSubjectPages() {
  const query = `*[_type == "subjectPage"] | order(title asc) {
    title,
    subject,
    slug
  }`;
  
  return client.fetch<SubjectPageData[]>(query);
}

export { getSubjectPages, type SubjectPageData }; 