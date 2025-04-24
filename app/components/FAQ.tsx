'use client';
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';

interface FAQSectionData {
  title: string;
  subtitle?: string;
}

interface FAQData {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

const FAQ = () => {
  const [sectionData, setSectionData] = useState<FAQSectionData | null>(null);
  const [faqs, setFaqs] = useState<FAQData[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch FAQ section data
        const section = await client.fetch<FAQSectionData>(`
          *[_type == "faq_section"][0] {
            title,
            subtitle
          }
        `);

        // Fetch FAQ items
        const faqData = await client.fetch<FAQData[]>(`
          *[_type == "faq"] | order(order asc) {
            _id,
            question,
            answer,
            order
          }
        `);

        setSectionData(section);
        setFaqs(faqData);
      } catch (err) {
        console.error('Error fetching FAQ data:', err);
        setError('Failed to load FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

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

  if (error || !sectionData) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">{sectionData.title}</h2>
        {sectionData.subtitle && (
          <p className="text-gray-600 text-center mb-8">{sectionData.subtitle}</p>
        )}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq._id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(faq._id)}
              >
                <span className="font-medium text-blue-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                    openId === faq._id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`transition-all duration-200 ease-in-out ${
                  openId === faq._id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 whitespace-pre-wrap">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 