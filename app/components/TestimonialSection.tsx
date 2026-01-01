'use client';
import React, { useEffect, useRef, useState } from 'react';
import ExternalLink from './ui/ExternalLink';
import { PortableText } from '@portabletext/react';

export interface TestimonialSectionData {
  rating: number;
  totalReviews: number;
  subtitle: string;
  tutorChaseLink?: string;
  selectedTestimonials?: Array<{ _ref: string, _type: string, _key?: string }> | string[];
  maxDisplayCount?: number;
}

export interface TestimonialData {
  _id: string;
  reviewerName: string;
  reviewerType: string;
  testimonialText: any[];
  rating: number;
  order: number;
}

const StarIcon = () => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.8047 0L15.4989 8.2918H24.2174L17.1639 13.4164L19.8581 21.7082L12.8047 16.5836L5.75126 21.7082L8.44543 13.4164L1.39201 8.2918H10.1105L12.8047 0Z" fill="#FCBD00"/>
  </svg>
);

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} />
      ))}
    </div>
  );
};

const TestimonialSection = ({ sectionData, testimonials }: { sectionData?: TestimonialSectionData, testimonials?: TestimonialData[] }) => {
  if (!sectionData || !testimonials) {
    return (
      <div style={{ background: 'linear-gradient(103deg, #FFF6F3 0%, #F2F4FA 68.07%, #F6F5FE 100%)' }} className="py-20">
        <div className="max-w-[1440px] mx-auto px-24 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Filter testimonials if selectedTestimonials is provided
  let displayTestimonials = testimonials;
  if (sectionData.selectedTestimonials && sectionData.selectedTestimonials.length > 0) {
    const selectedIds = sectionData.selectedTestimonials.map(item => {
      if (typeof item === 'string') return item;
      return item._ref;
    });
    
    displayTestimonials = testimonials.filter(testimonial => {
      return selectedIds.includes(testimonial._id);
    });
  }

  // Sort by order field
  displayTestimonials = displayTestimonials.sort((a, b) => a.order - b.order);

  // Apply max display count - limit to 3 for this design
  const maxCount = 3;
  displayTestimonials = displayTestimonials.slice(0, maxCount);

  // Ensure we have at least one testimonial to display
  if (displayTestimonials.length === 0 && testimonials.length > 0) {
    displayTestimonials = testimonials.slice(0, 3);
  }

  // Default testimonials that match the Figma design
  const defaultTestimonials = [
    {
      _id: '1',
      reviewerName: 'Fayaz Khan',
      reviewerType: 'A-Level Student',
      testimonialText: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Fantastic support for A-Level Maths, Physics, and Biology! Worked with three different tutors who were each equally great and achieved the grades I needed for uni because of them, thanks so much!'
            }
          ]
        }
      ],
      rating: 5,
      order: 1
    },
    {
      _id: '2',
      reviewerName: 'Olivia',
      reviewerType: 'A-Level Economics Student',
      testimonialText: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'My tutor was knowledgeable, patient, and helped me understand challenging concepts in a way that made sense. He also provided helpful study materials and resources. I would highly recommend TutorChase to anyone looking for help with their A-Levels.'
            }
          ]
        }
      ],
      rating: 5,
      order: 2
    },
    {
      _id: '3',
      reviewerName: 'Ben',
      reviewerType: 'A-Level History Student',
      testimonialText: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'As someone who struggled with understanding the A-Level History content, I\'m so grateful to have found TutorChase to help me prepare for my exams. My tutor was able to break down complex topics into manageable chunks and provided me with useful study tips and techniques.'
            }
          ]
        }
      ],
      rating: 5,
      order: 3
    }
  ];

  // Use default testimonials if no testimonials are available
  if (displayTestimonials.length === 0) {
    displayTestimonials = defaultTestimonials;
  }

  return (
    <section className="relative py-16">
      {/* Full-width gradient background */}
      <div 
        className="absolute inset-0 w-full"
        style={{ 
          background: 'linear-gradient(103deg, #FFF6F3 0%, #F2F4FA 68.07%, #F6F5FE 100%)'
        }}
      />
      
      {/* Content container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="flex flex-col items-center gap-6 mb-16">
          {/* Stars */}
          <div className="flex justify-center mb-2">
            <StarRating rating={5} />
        </div>

          {/* Title - Two lines on mobile, one line on desktop */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-center">
              {/* Mobile: Stacked layout */}
              <div className="flex flex-col lg:hidden">
                <div className="font-gilroy font-medium text-3xl lg:text-4xl leading-[140%] text-textDark">
                  Rated {sectionData.rating}/5
                </div>
                <div className="font-gilroy font-medium text-3xl lg:text-4xl leading-[140%] text-primary">
                  based on {sectionData.totalReviews} reviews
                </div>
              </div>
              
              {/* Desktop: Single line layout */}
              <div className="hidden lg:block">
                <div className="font-gilroy font-medium text-4xl leading-[140%] text-center">
                  <span className="text-textDark">Rated {sectionData.rating}/5</span>
                  <span className="text-primary"> based on {sectionData.totalReviews} reviews</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <span className="font-gilroy text-lg leading-[150%] text-[#F57C40] uppercase" style={{ fontWeight: 300 }}>
                Trusted globally by students and parents
              </span>
            </div>
          </div>
        </div>

        {/* Testimonial cards - Grid layout (center single or double items) */}
        <div
          className={`grid gap-8 sm:gap-6 lg:gap-8 px-4 sm:px-0 place-items-center ${
            displayTestimonials.length === 1
              ? 'grid-cols-1 justify-items-center justify-center'
              : displayTestimonials.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 justify-center lg:max-w-[920px] mx-auto'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {displayTestimonials.slice(0, 3).map((testimonial) => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Separate component for testimonial card with overflow detection
const TestimonialCard = ({ testimonial }: { testimonial: TestimonialData }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('text-lg');

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current;
        const isOverflowing = element.scrollHeight > element.clientHeight;
        
        if (isOverflowing) {
          // Reduce font size if overflowing
          setFontSize('text-base');
          
          // Check again after font size change
          setTimeout(() => {
            if (element.scrollHeight > element.clientHeight) {
              setFontSize('text-sm');
            }
          }, 100);
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-6 px-6 py-8 rounded-2xl bg-white shadow-[0px_16px_40px_0px_rgba(0,14,81,0.05)] h-[352px] w-full max-w-[420px] flex-shrink-0">
      {/* Testimonial Text with overflow detection */}
      <div 
        ref={textRef}
        className={`text-center font-gilroy ${fontSize} leading-[150%] text-textDark flex-1 flex items-center justify-center px-2 overflow-hidden`} 
        style={{ fontWeight: 300 }}
      >
        <div className="testimonial-content">
          "<PortableText 
            value={testimonial.testimonialText}
            components={{
                marks: {
                  strong: ({children}: any) => <strong className="font-medium">{children}</strong>,
                  em: ({children}: any) => <em className="italic">{children}</em>,
                },
                block: {
                  normal: ({children}: any) => <span>{children}</span>,
                },
              }}
          />"
        </div>
      </div>

      {/* Author Info */}
      <div className="flex flex-col items-center gap-3">
        <StarRating rating={testimonial.rating} />
        <div className="flex items-center gap-3" style={{ whiteSpace: 'nowrap', minWidth: 'max-content' }}>
          <span className="font-gilroy text-base text-textDark font-medium">
            {testimonial.reviewerName}
          </span>
          <span className="font-gilroy text-base text-textDark opacity-80 flex-shrink-0">|</span>
          <span className="font-gilroy text-base text-[#8B8E91]">
            {testimonial.reviewerType}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection; 
