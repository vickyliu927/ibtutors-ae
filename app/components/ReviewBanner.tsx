'use client';
import React from 'react';
import Link from 'next/link';

const reviews = [
  {
    id: 1,
    text: "Nadia has been a great tutor for my son. She's been very flexible with her schedule, teaches well, and always gives helpful notes after each lesson.",
    author: "Aamina",
    role: "Parent of an IB History Student"
  },
  {
    id: 2,
    text: "Edward is an excellent tutor who truly takes the time to understand my doubts. His explanations are clear and easy to follow. I really appreciate his support!",
    author: "Ali",
    role: "IB Economics Student"
  },
  {
    id: 3,
    text: "We've been very pleased with the service from IB Tutor. Yusuf has been tutoring our son, and he's made great progress with her help. This is the second time we've worked with him, and we highly recommend him.",
    author: "Bilal",
    role: "Parent of an IB Geography Student"
  }
];

const ReviewBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="h-6 w-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 15.934L4.618 19.098l1.039-6.054L1.314 8.902l6.068-.881L10 2.666l2.618 5.355 6.068.881-4.343 4.142 1.039 6.054L10 15.934z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
          </div>
          <h2 className="text-3xl font-bold mb-2">
            Rated 4.92/5 based on <span className="underline">480 reviews</span>
          </h2>
          <p className="text-gray-600">
            We're part of{' '}
            <Link href="https://tutorchase.com" className="text-orange-500 hover:text-orange-600">
              TutorChase
            </Link>
            , the world's #1 IB tutoring provider
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.934L4.618 19.098l1.039-6.054L1.314 8.902l6.068-.881L10 2.666l2.618 5.355 6.068.881-4.343 4.142 1.039 6.054L10 15.934z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 text-center italic">"{review.text}"</p>
              <div className="text-center">
                <p className="font-medium">{review.author}</p>
                <p className="text-gray-500 text-sm">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewBanner; 