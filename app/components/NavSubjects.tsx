import { client } from '@/sanity/lib/client';

interface SubjectPageData {
  title: string;
  subject: string;
  slug: {
    current: string;
  };
  displayOrder: number;
}

async function getSubjectPages(cloneId?: string | null) {
  console.log(`[NavSubjects] Fetching subject pages for clone: ${cloneId || 'global'}`);
  
  // If no clone ID provided, fall back to global query for compatibility
  if (!cloneId || cloneId === 'global' || cloneId === 'none') {
    const query = `*[_type == "subjectPage" && !defined(cloneReference)] | order(displayOrder asc) {
      title,
      subject,
      slug,
      displayOrder
    }`;
    
    const result = await client.fetch<SubjectPageData[]>(query);
    console.log(`[NavSubjects] Fetched ${result.length} default subject pages`);
    return result;
  }
  
  // Clone-aware query with 3-tier fallback
  const query = `{
    "cloneSpecific": *[_type == "subjectPage" && cloneReference->cloneId.current == $cloneId && isActive == true] | order(displayOrder asc) {
      title,
      subject,
      slug,
      displayOrder,
      "source": "cloneSpecific"
    },
    "baseline": *[_type == "subjectPage" && cloneReference->baselineClone == true && isActive == true] | order(displayOrder asc) {
      title,
      subject,
      slug,
      displayOrder,
      "source": "baseline"
    },
    "default": *[_type == "subjectPage" && !defined(cloneReference) && isActive == true] | order(displayOrder asc) {
      title,
      subject,
      slug,
      displayOrder,
      "source": "default"
    }
  }`;
  
  try {
    const result = await client.fetch(query, { cloneId });
    
    // Resolve using 3-tier fallback: cloneSpecific → baseline → default
    let subjectPages: SubjectPageData[] = [];
    let source = 'none';
    
    if (result.cloneSpecific && result.cloneSpecific.length > 0) {
      subjectPages = result.cloneSpecific;
      source = 'cloneSpecific';
    } else if (result.baseline && result.baseline.length > 0) {
      subjectPages = result.baseline;
      source = 'baseline';
    } else if (result.default && result.default.length > 0) {
      subjectPages = result.default;
      source = 'default';
    }
    
    console.log(`[NavSubjects] Fetched ${subjectPages.length} subject pages from ${source} for clone: ${cloneId}`);
    return subjectPages;
  } catch (error) {
    console.error(`[NavSubjects] Error fetching subject pages for clone ${cloneId}:`, error);
    
    // Fallback to default content on error
    const fallbackQuery = `*[_type == "subjectPage" && !defined(cloneReference)] | order(displayOrder asc) {
      title,
      subject,
      slug,
      displayOrder
    }`;
    
    const fallbackResult = await client.fetch<SubjectPageData[]>(fallbackQuery);
    console.log(`[NavSubjects] Using fallback: ${fallbackResult.length} default subject pages`);
    return fallbackResult;
  }
}

export { getSubjectPages, type SubjectPageData }; 