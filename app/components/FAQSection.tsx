'use client';

import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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
);

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  displayOrder: number;
}

interface FAQSection {
  title: string;
  subtitle?: string;
  faqs: FAQ[];
}

export default function FAQSection() {
  const [faqSection, setFAQSection] = useState<FAQSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const query = `*[_type == "FAQ_Section"][0]{
          title,
          subtitle,
          "faqs": *[_type == "FAQ"] | order(displayOrder asc) {
            _id,
            question,
            answer,
            displayOrder
          }
        }`;
        
        const result = await client.fetch(query);
        setFAQSection(result);
      } catch (err) {
        setError('Failed to load FAQs. Please try again later.');
        console.error('Error fetching FAQs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (faqId: string) => {
    setOpenFAQs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">Loading FAQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    );
  }

  if (!faqSection) {
    return null;
  }

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{faqSection.title}</h2>
        {faqSection.subtitle && (
          <p className="text-gray-600 text-lg">{faqSection.subtitle}</p>
        )}
      </div>

      <div className="space-y-4">
        {faqSection.faqs.map((faq) => (
          <div
            key={faq._id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(faq._id)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={openFAQs.has(faq._id)}
            >
              <span className="font-medium text-lg">{faq.question}</span>
              <ChevronIcon 
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                  openFAQs.has(faq._id) ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openFAQs.has(faq._id) && (
              <div className="p-4 pt-0 text-gray-600 bg-gray-50">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 