'use client';

import React from 'react';

interface AdvertBlockProps {
  sectionData?: {
    title?: string;
    subtitle?: string;
    description?: string;
    highlightText?: string;
    pricingText?: string;
    backgroundColor?: string;
    enabled?: boolean;
  } | null;
  className?: string;
}

const AdvertBlock: React.FC<AdvertBlockProps> = ({
  sectionData,
  className = ""
}) => {
  // Extract data from sectionData with fallbacks
  const title = sectionData?.title || "Voted #1 for IB";
  const subtitle = sectionData?.subtitle || "by 10,000+ students";
  const description = sectionData?.description || "We're trusted by hundreds of IB schools globally. All tutoring includes FREE access to our";
  const highlightText = sectionData?.highlightText || "IB Resources Platform";
  const pricingText = sectionData?.pricingText || "- normally £29/month!";
  const backgroundColor = sectionData?.backgroundColor || "#001A96";
  return (
    <section className={`relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Container with 20% narrower width (960px instead of 1200px) */}
      <div className="relative max-w-[960px] mx-auto">
        {/* Background with dynamic color and border radius */}
        <div 
          className="relative rounded-[20px] px-6 py-12 sm:px-10 sm:py-14 lg:px-[40px] lg:py-[80px]" 
          style={{ backgroundColor }}
        >
          {/* Enhanced Geometric Background Lines SVG */}
          <div className="absolute inset-0 overflow-hidden rounded-[20px]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 960 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Main diagonal lines from corners */}
              <path
                d="M0 0L300 280"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
              />
              <path
                d="M960 0L660 280"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
              />
              
              {/* Secondary diagonal lines */}
              <path
                d="M0 80L240 280"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <path
                d="M960 80L720 280"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              
              {/* Curved connecting lines - top */}
              <path
                d="M0 0C160 40 320 80 480 80C640 80 800 40 960 0"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1.5"
                fill="none"
              />
              
              {/* Curved connecting lines - middle */}
              <path
                d="M0 140C160 100 320 120 480 140C640 160 800 120 960 140"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                fill="none"
              />
              
              {/* Curved connecting lines - bottom */}
              <path
                d="M0 280C160 240 320 200 480 200C640 200 800 240 960 280"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                fill="none"
              />
              
              {/* Additional geometric intersecting lines */}
              <path
                d="M120 0C180 70 240 140 300 280"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <path
                d="M840 0C780 70 720 140 660 280"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              
              {/* Horizontal connecting lines */}
              <path
                d="M200 60L760 60"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              <path
                d="M150 180L810 180"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
              
              {/* Complex curved intersection */}
              <path
                d="M0 200Q240 120 480 160T960 200"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                fill="none"
              />
              
              {/* Strategic decorative dots */}
              <circle cx="150" cy="50" r="2" fill="rgba(255,255,255,0.12)" />
              <circle cx="810" cy="50" r="2" fill="rgba(255,255,255,0.12)" />
              <circle cx="300" cy="140" r="1.5" fill="rgba(255,255,255,0.08)" />
              <circle cx="660" cy="140" r="1.5" fill="rgba(255,255,255,0.08)" />
              <circle cx="480" cy="220" r="1" fill="rgba(255,255,255,0.06)" />
              <circle cx="200" cy="180" r="1" fill="rgba(255,255,255,0.06)" />
              <circle cx="760" cy="180" r="1" fill="rgba(255,255,255,0.06)" />
              
              {/* Additional small geometric elements */}
              <path
                d="M100 120L140 160L100 200L60 160Z"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M860 120L900 160L860 200L820 160Z"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>

          {/* Book Icon - positioned top left */}
          <div className="absolute top-6 left-6 hidden lg:block">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 19.5C4 18.837 4.263 18.201 4.732 17.732C5.201 17.263 5.837 17 6.5 17H20"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                />
                <path
                  d="M6.5 2H20V22H6.5C5.837 22 5.201 21.737 4.732 21.268C4.263 20.799 4 20.163 4 19.5V4.5C4 3.837 4.263 3.201 4.732 2.732C5.201 2.263 5.837 2 6.5 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                />
              </svg>
            </div>
          </div>

          {/* Content container - centered */}
          <div className="relative z-10 text-center text-white">
            {/* Main Title - same font weight as subtitle */}
            <h2 className="font-gilroy text-2xl sm:text-3xl lg:text-4xl leading-tight mb-2 font-normal">
              {title}
            </h2>
            
            {/* Subtitle - same font weight as title */}
            <h3 className="font-gilroy text-2xl sm:text-3xl lg:text-4xl leading-tight mb-8 font-normal">
              {subtitle}
            </h3>

            {/* Description with highlighted text */}
            <div className="max-w-3xl mx-auto">
              <p className="font-gilroy text-base sm:text-lg lg:text-xl leading-relaxed" style={{ fontWeight: 300 }}>
                {description}{' '}
                                 <span className="underline decoration-white decoration-2 underline-offset-4">
                   {highlightText}
                 </span>
                 {' '}{pricingText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertBlock; 