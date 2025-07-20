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
    <section className={`relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Container with optimized design dimensions for 15" screen */}
      <div className="relative max-w-[1200px] mx-auto">
        {/* Background with dynamic color and border radius */}
        <div 
          className="relative rounded-[20px] px-6 py-8 sm:px-10 lg:px-[40px] lg:py-[40px]" 
          style={{ backgroundColor }}
        >
          {/* Cool Background Lines SVG */}
          <div className="absolute inset-0 overflow-hidden rounded-[20px]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Diagonal lines from corners */}
              <path
                d="M0 0L360 200"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <path
                d="M1200 0L840 200"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              
              {/* Curved connecting lines */}
              <path
                d="M0 200C180 150 360 100 600 100C840 100 1020 150 1200 200"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Additional geometric elements */}
              <path
                d="M90 0C135 65 225 135 360 200"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <path
                d="M1110 0C1065 65 975 135 840 200"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              
              {/* Subtle connecting curves */}
              <path
                d="M0 100Q300 50 600 100T1200 100"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                fill="none"
              />
              
              {/* Small decorative dots */}
              <circle cx="180" cy="50" r="2" fill="rgba(255,255,255,0.1)" />
              <circle cx="450" cy="150" r="1.5" fill="rgba(255,255,255,0.08)" />
              <circle cx="720" cy="35" r="1" fill="rgba(255,255,255,0.06)" />
              <circle cx="1000" cy="165" r="2" fill="rgba(255,255,255,0.1)" />
            </svg>
          </div>

          {/* Book Icon - positioned top left */}
          <div className="absolute top-6 left-6 hidden lg:block">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
              <svg
                width="16"
                height="16"
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
            {/* Main Title */}
            <h2 className="font-gilroy text-2xl sm:text-3xl lg:text-4xl leading-tight mb-2 font-semibold">
              {title}
            </h2>
            
            {/* Subtitle */}
            <h3 className="font-gilroy text-2xl sm:text-3xl lg:text-4xl leading-tight mb-6" style={{ fontWeight: 300 }}>
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