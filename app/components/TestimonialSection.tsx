'use client';
import React from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';

export interface TestimonialSectionData {
  rating: number;
  totalReviews: number;
  subtitle: string;
  tutorChaseLink?: string;
  selectedTestimonials?: Array<{ _id: string, reviewerName: string }> | string[];
  maxDisplayCount?: number;
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

  console.log("Testimonial Section Data:", JSON.stringify(sectionData, null, 2));
  console.log("All testimonials:", testimonials.map(t => `${t._id} - ${t.reviewerName}`));

  // Filter testimonials if selectedTestimonials is provided
  let displayTestimonials = testimonials;
  if (sectionData.selectedTestimonials && sectionData.selectedTestimonials.length > 0) {
    console.log("Selected testimonials exist - count:", sectionData.selectedTestimonials.length);
    
    const selectedIds = sectionData.selectedTestimonials.map(item => {
      if (typeof item === 'string') return item;
      return item._id;
    });
    
    console.log("Selected IDs:", selectedIds);
    
    displayTestimonials = testimonials.filter(testimonial => {
      const isIncluded = selectedIds.includes(testimonial._id);
      console.log(`Checking ${testimonial._id} (${testimonial.reviewerName}): ${isIncluded ? 'SELECTED' : 'not selected'}`);
      return isIncluded;
    });
  }

  // Sort by order field
  displayTestimonials = displayTestimonials.sort((a, b) => a.order - b.order);

  // Apply max display count (default to 6 if not specified, with min of 1)
  const maxCount = sectionData.maxDisplayCount ? 
    Math.min(Math.max(sectionData.maxDisplayCount, 1), 6) : 6;
  
  displayTestimonials = displayTestimonials.slice(0, maxCount);

  console.log("Final display testimonials:", displayTestimonials.map(t => t.reviewerName));

  // Ensure we have at least one testimonial to display
  if (displayTestimonials.length === 0 && testimonials.length > 0) {
    displayTestimonials = [testimonials[0]];
    console.log("Fallback to first testimonial:", testimonials[0].reviewerName);
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

        {displayTestimonials.length === 1 ? (
          <div className="flex justify-center">
            <div className="w-full max-w-xl">
              <div className="bg-white p-8 rounded-lg shadow-sm h-[320px] flex items-center justify-center">
                <div>
                <div className="flex justify-center mb-4">
                  <StarRating rating={displayTestimonials[0].rating} />
                </div>
                <blockquote className="text-center mb-6">
                  <p className="text-gray-600 italic">"{displayTestimonials[0].testimonialText}"</p>
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold">{displayTestimonials[0].reviewerName}</p>
                  <p className="text-gray-500 text-sm">{displayTestimonials[0].reviewerType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : displayTestimonials.length === 2 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {displayTestimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-white p-8 rounded-lg shadow-sm w-full h-[320px] flex items-center justify-center"
                >
                  <div>
                  <div className="flex justify-center mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <blockquote className="text-center mb-6">
                    <p className="text-gray-600 italic">"{testimonial.testimonialText}"</p>
                  </blockquote>
                  <div className="text-center">
                    <p className="font-semibold">{testimonial.reviewerName}</p>
                    <p className="text-gray-500 text-sm">{testimonial.reviewerType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md mx-auto h-[320px] flex items-center justify-center"
              >
                <div>
                <div className="flex justify-center mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>
                <blockquote className="text-center mb-6">
                  <p className="text-gray-600 italic">"{testimonial.testimonialText}"</p>
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold">{testimonial.reviewerName}</p>
                  <p className="text-gray-500 text-sm">{testimonial.reviewerType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Read our verified reviews button */}
        <div className="flex justify-center mt-12">
          <a 
            href="https://www.reviews.co.uk/company-reviews/store/tutorchase" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-blue-800 text-white font-normal text-center text-2xl py-3 px-10 rounded-md hover:bg-blue-700 transition-all w-64 sm:w-auto"
          >
            Read our verified reviews
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection; 