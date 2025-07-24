import { client } from '@/sanity/lib/client';

export interface FAQSectionData {
  title: string;
  subtitle?: string;
}

export interface FAQData {
  _id: string;
  question: string;
  answer: string;
  displayOrder: number;
}

export interface FAQResponse {
  sectionData: FAQSectionData | null;
  faqs: FAQData[];
}

export async function getFAQData(
  pageType: 'homepage' | 'subject' | 'curriculum' | 'general' = 'homepage',
  cloneId?: string | null,
  subjectSlug?: string
): Promise<FAQResponse> {
  try {
    // Build query with proper page type filtering, subject filtering, and clone support
    let query = '';
    let params: any = { pageType };
    
    // Build filter conditions
    let pageTypeFilter = 'pageType == $pageType';
    
    if (pageType === 'subject' && subjectSlug) {
      // For subject pages, filter by specific subject if provided
      pageTypeFilter += ' && subjectPage->slug.current == $subjectSlug';
      params.subjectSlug = subjectSlug;
    } else if (pageType === 'subject' && !subjectSlug) {
      // For subject pages without specific subject, get general subject FAQs
      pageTypeFilter += ' && !defined(subjectPage)';
    }
    
    if (cloneId) {
      // Clone-specific query with fallback
      query = `
        *[_type == "faq_section" && ${pageTypeFilter} && (
          cloneReference._ref == $cloneId || 
          !defined(cloneReference)
        )] | order(defined(cloneReference) desc)[0] {
          title,
          subtitle,
          "faqs": faqReferences[]-> {
            _id,
            question,
            answer,
            displayOrder
          }
        }
      `;
      params.cloneId = cloneId;
    } else {
      // Global query filtered by page type
      query = `
        *[_type == "faq_section" && ${pageTypeFilter} && !defined(cloneReference)][0] {
          title,
          subtitle,
          "faqs": faqReferences[]-> {
            _id,
            question,
            answer,
            displayOrder
          }
        }
      `;
    }

    const result = await client.fetch(
      query,
      params,
      { next: { revalidate: 600 } } // Cache for 10 minutes
    );

    if (!result) {
      console.log('FAQ section not configured');
      return {
        sectionData: null,
        faqs: []
      };
    }

    return {
      sectionData: {
        title: result.title,
        subtitle: result.subtitle
      },
      faqs: (result.faqs || []).sort((a: FAQData, b: FAQData) => 
        a.displayOrder - b.displayOrder
      )
    };
  } catch (err) {
    console.error('Error fetching FAQ data:', err);
    return {
      sectionData: null,
      faqs: []
    };
  }
} 