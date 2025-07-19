'use client';

import React from 'react';

interface AdvertBlockProps {
  title?: string;
  subtitle?: string;
  description?: string;
  highlightText?: string;
  backgroundColor?: string;
  className?: string;
}

const AdvertBlock: React.FC<AdvertBlockProps> = ({
  title = "Voted #1 for IB",
  subtitle = "by 10,000+ students",
  description = "We're trusted by hundreds of IB schools globally. All tutoring includes FREE access to our",
  highlightText = "IB Resources Platform",
  backgroundColor = "#4053B0",
  className = ""
}) => {
  return (
    <section className={`relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Container with optimized design dimensions */}
      <div className="relative max-w-[1320px] mx-auto">
        {/* Background with dynamic color and border radius */}
        <div 
          className="relative rounded-[20px] px-6 py-12 sm:px-12 lg:px-[60px] lg:py-[60px]" 
          style={{ backgroundColor }}
        >
          {/* Cool Background Lines SVG */}
          <div className="absolute inset-0 overflow-hidden rounded-[20px]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1320 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Diagonal lines from corners */}
              <path
                d="M0 0L400 240"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <path
                d="M1320 0L920 240"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              
              {/* Curved connecting lines */}
              <path
                d="M0 240C200 180 400 120 660 120C920 120 1120 180 1320 240"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Additional geometric elements */}
              <path
                d="M100 0C150 80 250 160 400 240"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <path
                d="M1220 0C1170 80 1070 160 920 240"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              
              {/* Subtle connecting curves */}
              <path
                d="M0 120Q330 60 660 120T1320 120"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                fill="none"
              />
              
              {/* Small decorative dots */}
              <circle cx="200" cy="60" r="2" fill="rgba(255,255,255,0.1)" />
              <circle cx="500" cy="180" r="1.5" fill="rgba(255,255,255,0.08)" />
              <circle cx="800" cy="40" r="1" fill="rgba(255,255,255,0.06)" />
              <circle cx="1100" cy="200" r="2" fill="rgba(255,255,255,0.1)" />
            </svg>
          </div>

          {/* Book Icon - positioned top left */}
          <div className="absolute top-8 left-8 hidden lg:block">
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
            {/* Main Title */}
            <h2 className="font-gilroy text-3xl sm:text-4xl lg:text-5xl leading-tight mb-2" style={{ fontWeight: 300 }}>
              {title}
            </h2>
            
            {/* Subtitle */}
            <h3 className="font-gilroy text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8" style={{ fontWeight: 300 }}>
              {subtitle}
            </h3>

            {/* Description with highlighted text */}
            <div className="max-w-4xl mx-auto">
              <p className="font-gilroy text-lg sm:text-xl lg:text-2xl leading-relaxed" style={{ fontWeight: 300 }}>
                {description}{' '}
                <span className="underline decoration-white decoration-2 underline-offset-4">
                  {highlightText}
                </span>
                {' '}- normally £29/month!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertBlock; 