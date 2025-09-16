'use client';

import { useState } from 'react';
import { PortableText } from '@portabletext/react';

export interface FAQSectionProps {
  sectionData: {
    title: string;
    subtitle?: string;
  };
  faqs: {
    _id: string;
    question: string;
    answer: any;
    displayOrder: number;
  }[];
}

const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
    width="14"
    height="28"
    viewBox="0 0 14 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 11.001L7 16.9996L13 11.001"
      stroke="#001A96"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

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
      <div className="max-w-[1056px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-3 mb-8">
          <h2 className="text-textDark font-gilroy text-4xl font-medium leading-[140%]">
            {sectionData.title}
          </h2>
          {sectionData.subtitle && (
            <p className="text-textDark font-gilroy text-lg leading-[160%]" style={{ fontWeight: 200 }}>
              {sectionData.subtitle}
            </p>
          )}
        </div>

        {/* FAQ Container */}
        <div className="bg-faqBackground rounded-[20px] flex flex-col items-center">
          {faqs.map((faq, index) => (
            <div
              key={faq._id}
              className={`flex w-full ${
                openId === faq._id ? 'items-start' : 'items-center'
              } gap-11 px-6 py-7 ${
                index < faqs.length - 1 ? 'border-b border-greyBorder' : ''
              }`}
            >
              {openId === faq._id ? (
                // Expanded state
                <div className="flex flex-col justify-center items-center gap-4 flex-1">
                  <div className="w-full text-primary font-gilroy text-xl leading-[140%] font-medium">
                    {faq.question}
                  </div>
                  <div className="w-full text-textDark font-gilroy text-base leading-[160%]" style={{ fontWeight: 200 }}>
                    <PortableText 
                      value={faq.answer}
                      components={{
                        list: {
                          bullet: ({children}: any) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
                          number: ({children}: any) => <ol className="list-decimal pl-6 space-y-1">{children}</ol>,
                        },
                        marks: {
                          strong: ({children}: any) => <strong className="font-medium">{children}</strong>,
                          em: ({children}: any) => <em className="italic">{children}</em>,
                          link: ({value, children}: any) => {
                            const href = value?.href || '#';
                            return <a href={href} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">{children}</a>;
                          }
                        },
                        block: {
                          normal: ({children}: any) => <p className="mb-3">{children}</p>,
                        },
                      }}
                    />
                  </div>
                </div>
              ) : (
                // Collapsed state
                <div className="flex-1 text-primary font-gilroy text-xl leading-[140%] font-medium">
                  {faq.question}
                </div>
              )}

              <button
                onClick={() => toggleFAQ(faq._id)}
                className="flex flex-col justify-center items-center gap-2.5 h-7"
              >
                <ChevronDownIcon isOpen={openId === faq._id} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
