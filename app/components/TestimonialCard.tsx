'use client';

import React from 'react';

interface TestimonialCardProps {
  testimonial: {
    reviewerName: string;
    location?: string;
    rating?: number;
    reviewText?: string;
  };
}

const StarRating = ({ rating }: { rating?: number }) => {
  if (!rating) return null;
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
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
  );
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>
      
      {testimonial.reviewText && (
        <blockquote className="text-gray-700 italic mb-4 flex-grow">
          "{testimonial.reviewText}"
        </blockquote>
      )}
      
      <div className="mt-auto">
        <p className="font-semibold">{testimonial.reviewerName}</p>
        {testimonial.location && (
          <p className="text-gray-500 text-sm">{testimonial.location}</p>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard; 