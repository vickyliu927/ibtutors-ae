import { client } from '@/sanity/lib/client';

interface CurriculumPageData {
  title: string;
  curriculum: string;
  slug: {
    current: string;
  };
  displayOrder: number;
}

async function getCurriculumPages() {
  const query = `*[_type == "curriculumPage"] | order(displayOrder asc) {
    title,
    curriculum,
    slug,
    displayOrder
  }`;
  
  return client.fetch<CurriculumPageData[]>(query);
}

export { getCurriculumPages, type CurriculumPageData }; 