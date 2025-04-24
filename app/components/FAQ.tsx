'use client';
import React, { useState } from 'react';

const faqs = [
  {
    id: 1,
    question: "Are IB Tutor available during Ramadan and other UAE holidays?",
    answer: "Yes, our IB tutors are available during Ramadan and other UAE holidays. We understand the importance of maintaining a flexible schedule during these times, so we offer tutoring sessions that align with your convenience, whether you prefer daytime or evening sessions."
  },
  {
    id: 2,
    question: "Which cities does IB Tutor provide tutoring in the UAE?",
    answer: "We provide tutoring across all major cities in the UAE including Dubai, Abu Dhabi, Sharjah, Ajman, Al Ain, Ras Al Khaimah, Fujairah, and Umm Al Quwain."
  },
  {
    id: 3,
    question: "What IB subjects do you offer tutoring for?",
    answer: "We provide tutoring for all IB subjects including Maths, Biology, Chemistry, Physics, ESS, Computer Science, English, Economics, History, Psychology, Business Management, French, Spanish, TOK, and Extended Essay."
  },
  {
    id: 4,
    question: "How does IB tutoring help students in the UAE?",
    answer: "IB tutoring in the UAE helps students by providing personalized support, adapting to local curriculum needs, offering Arabic and Islamic Studies support alongside IB subjects, preparing for UAE universities, and aligning with UAE school schedules."
  }
];

const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className="font-medium text-blue-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openId === faq.id ? 'rotate-180' : ''
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
              {openId === faq.id && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 