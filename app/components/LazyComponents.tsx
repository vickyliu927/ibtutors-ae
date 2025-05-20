'use client';

import dynamic from 'next/dynamic';

// Dynamically import components that aren't needed on initial render
// This reduces the initial JavaScript bundle size and speeds up loading

// Contact form isn't needed until user scrolls to the bottom
export const LazyContactForm = dynamic(
  () => import('./ContactForm'),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-100 rounded-lg h-[400px] w-full"></div>
    ),
  }
);

// Testimonial section can be loaded after critical content
export const LazyTestimonialSection = dynamic(
  () => import('./TestimonialSection'),
  {
    ssr: true,
    loading: () => (
      <div className="animate-pulse bg-pink-50 rounded-lg h-[400px] w-full"></div>
    ),
  }
); 