import React from 'react';
import { urlFor } from '@/sanity/lib/image';

export interface SubjectHeaderData {
  subject: string;
  title: string;
  subtitle?: string;
  backgroundImage?: {
    asset: {
      _ref: string;
    };
  };
  callToAction?: {
    text: string;
    link: string;
  };
  reviews?: {
    rating: number;
    count: number;
  };
}

interface SubjectHeaderProps {
  data: SubjectHeaderData | null;
  defaultTitle?: string;
}

export default function SubjectHeader({ data, defaultTitle = 'IB Tutors' }: SubjectHeaderProps) {
  const backgroundImageUrl = data?.backgroundImage 
    ? urlFor(data.backgroundImage).url()
    : undefined;

  const headerStyle = backgroundImageUrl 
    ? { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  const renderStars = (rating: number) => {
    return (
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-6 h-6 text-yellow-400`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderTitle = (title: string) => {
    // Split the title into parts: "Online", "IB Maths", and "Tutors"
    const parts = title.split('IB Maths');
    if (parts.length !== 2) return title; // If not in expected format, return as is

    return (
      <>
        {parts[0]}
        <span className="text-blue-600">IB Maths</span>
        {parts[1]}
      </>
    );
  };

  return (
    <section 
      className="py-32 text-center relative"
      style={headerStyle}
    >
      {/* Add an overlay if there's a background image */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}
      <div className="relative z-10 container mx-auto px-4">
        {data?.reviews && (
          <div className="mb-6">
            {renderStars(data.reviews.rating)}
            <p className="text-sm text-gray-600 mt-2">
              {data.reviews.rating.toFixed(2)}/5 based on {data.reviews.count} reviews
            </p>
          </div>
        )}
        <h1 className="text-5xl font-bold mb-6">
          {data?.title ? renderTitle(data.title) : defaultTitle}
        </h1>
        {data?.subtitle && (
          <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        )}
        {data?.callToAction && (
          <a 
            href={data.callToAction.link}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {data.callToAction.text}
          </a>
        )}
      </div>
    </section>
  );
} 