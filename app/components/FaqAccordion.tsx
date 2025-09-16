'use client';

import React, { useState } from 'react';
import { PortableText } from '@portabletext/react';

interface FaqAccordionProps {
  question: string;
  answer?: any;
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-4">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-blue-700">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
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
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 py-4 bg-gray-50">
          <div className="text-gray-700 text-base leading-7">
            {answer ? (
              <PortableText
                value={answer}
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
                    },
                  },
                  block: {
                    normal: ({children}: any) => <p className="mb-3">{children}</p>,
                  },
                }}
              />
            ) : (
              <p className="text-gray-600">No answer provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqAccordion; 