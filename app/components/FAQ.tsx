'use client';
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import FAQSection from './FAQSection';

interface FAQSectionData {
  title: string;
  subtitle?: string;
}

interface FAQData {
  _id: string;
  question: string;
  answer: string;
  displayOrder: number;
}

const FAQ = () => {
  const [sectionData, setSectionData] = useState<FAQSectionData | null>(null);
  const [faqs, setFaqs] = useState<FAQData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch FAQ section data with FAQs in a single query
        const result = await client.fetch(`*[_type == "faq_section"][0] {
          title,
          subtitle,
          "faqs": faqReferences[]-> {
            _id,
            question,
            answer,
            displayOrder
          }
        }`);

        console.log('FAQ Data:', result); // Debug log

        if (!result) {
          setError('FAQ section not configured');
          return;
        }

        setSectionData({
          title: result.title,
          subtitle: result.subtitle
        });
        setFaqs(result.faqs?.sort((a: FAQData, b: FAQData) => a.displayOrder - b.displayOrder) || []);
      } catch (err) {
        console.error('Error fetching FAQ data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load FAQs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </section>
    );
  }

  if (!sectionData || faqs.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 text-center">
            {!sectionData ? 'FAQ section not configured' : 'No FAQs available at the moment'}
          </p>
        </div>
      </section>
    );
  }

  return <FAQSection sectionData={sectionData} faqs={faqs} />;
};

export default FAQ; 