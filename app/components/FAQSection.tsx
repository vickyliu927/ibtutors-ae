'use client';

import { useState } from 'react';

export interface FAQSectionProps {
  sectionData: {
    title: string;
    subtitle?: string;
  };
  faqs: {
    _id: string;
    question: string;
    answer: string;
    displayOrder: number;
  }[];
}

const FAQSection = ({ sectionData, faqs }: FAQSectionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (!sectionData || faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-12 text-center">{sectionData.title}</h2>
        {sectionData.subtitle && (
          <p className="text-gray-600 text-center mb-12">{sectionData.subtitle}</p>
        )}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(faq._id)}
              >
                <span className="font-medium text-blue-700 text-lg">{faq.question}</span>
                <svg
                  className={`w-6 h-6 text-gray-400 transform transition-transform duration-200 ${
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
                <div className="px-8 py-6 bg-gray-50">
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{faq.answer}</p>
                </div>
              </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 