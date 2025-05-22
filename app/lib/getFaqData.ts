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

export async function getFAQData(): Promise<FAQResponse> {
  try {
    // Fetch FAQ section data with FAQs in a single query
    const result = await client.fetch(
      `*[_type == "faq_section"][0] {
        title,
        subtitle,
        "faqs": faqReferences[]-> {
          _id,
          question,
          answer,
          displayOrder
        }
      }`,
      {},
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