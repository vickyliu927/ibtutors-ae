import { cachedFetch } from '@/sanity/lib/queryCache';

export interface SeoData {
  title: string;
  description: string;
}

export async function getSeoData(): Promise<SeoData> {
  try {
    const query = `*[_type == "seoSettings"][0] {
      title,
      description
    }`;

    // Using cachedFetch with a 24-hour TTL since SEO data rarely changes
    const seoData = await cachedFetch<SeoData | null>(
      query,
      {},
      { next: { revalidate: 86400 } }, // 24 hours cache
      24 * 60 * 60 * 1000 // 24 hours TTL 
    );
    
    // If there's no SEO data, return default values
    if (!seoData) {
      return {
        title: 'Dubai Tutors - Expert IB Teachers and Examiners',
        description: 'Learn from qualified IB teachers with proven success rates in Dubai, Abu Dhabi, and across the UAE.',
      };
    }

    return seoData;
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    
    // Return default values in case of error
    return {
      title: 'Dubai Tutors - Expert IB Teachers and Examiners',
      description: 'Learn from qualified IB teachers with proven success rates in Dubai, Abu Dhabi, and across the UAE.',
    };
  }
} 