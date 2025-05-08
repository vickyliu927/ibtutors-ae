'use client';
import React from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';

export interface TestimonialSectionData {
  rating: number;
  totalReviews: number;
  subtitle: string;
  tutorChaseLink?: string;
}

export interface TestimonialData {
  _id: string;
  reviewerName: string;
  reviewerType: string;
  testimonialText: string;
  rating: number;
  order: number;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
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
  );
};

const TestimonialSection = ({ sectionData, testimonials }: { sectionData?: TestimonialSectionData, testimonials?: TestimonialData[] }) => {
  if (!sectionData || !testimonials) {
    return (
      <div className="py-16 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-2">
            <StarRating rating={5} />
          </div>
          <h2 className="text-3xl font-bold">
            Rated {sectionData.rating}/5 based on{' '}
            <span className="underline decoration-2">{sectionData.totalReviews} reviews</span>
          </h2>
          <p className="mt-2 text-gray-600">
            We're part of{' '}
            {sectionData.tutorChaseLink ? (
              <Link href={sectionData.tutorChaseLink} className="text-orange-500 hover:text-orange-600">
                TutorChase
              </Link>
            ) : (
              'TutorChase'
            )}
            , {sectionData.subtitle}
          </p>
        </div>

        {testimonials.length === 1 ? (
          <div className="flex justify-center">
            <div className="w-full max-w-xl">
              <div className="bg-white p-8 rounded-lg shadow-sm h-[320px] flex flex-col justify-between">
                <div className="flex justify-center">
                  <StarRating rating={testimonials[0].rating} />
                </div>
                <blockquote className="text-center my-auto py-6">
                  <p className="text-gray-600 italic">"{testimonials[0].testimonialText}"</p>
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold">{testimonials[0].reviewerName}</p>
                  <p className="text-gray-500 text-sm">{testimonials[0].reviewerType}</p>
                </div>
              </div>
            </div>
          </div>
        ) : testimonials.length === 2 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-white p-8 rounded-lg shadow-sm w-full h-[320px] flex flex-col justify-between"
                >
                  <div className="flex justify-center">
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <blockquote className="text-center my-auto py-6">
                    <p className="text-gray-600 italic">"{testimonial.testimonialText}"</p>
                  </blockquote>
                  <div className="text-center">
                    <p className="font-semibold">{testimonial.reviewerName}</p>
                    <p className="text-gray-500 text-sm">{testimonial.reviewerType}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md mx-auto h-[320px] flex flex-col justify-between"
              >
                <div className="flex justify-center">
                  <StarRating rating={testimonial.rating} />
                </div>
                <blockquote className="text-center my-auto py-6">
                  <p className="text-gray-600 italic">"{testimonial.testimonialText}"</p>
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold">{testimonial.reviewerName}</p>
                  <p className="text-gray-500 text-sm">{testimonial.reviewerType}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection; 