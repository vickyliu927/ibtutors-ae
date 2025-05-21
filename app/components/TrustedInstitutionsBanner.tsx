'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface Institution {
  name: string;
  logo: any;
  displayOrder?: number;
}

interface TrustedInstitutionsBannerProps {
  title?: string;
  subtitle?: string;
  institutions?: Institution[];
  backgroundColor?: string;
  carouselSpeed?: number;
}

const TrustedInstitutionsBanner: React.FC<TrustedInstitutionsBannerProps> = ({
  title = 'TUTORS FROM AND STUDENTS ACCEPTED',
  subtitle = 'INTO THE WORLD\'S TOP UNIVERSITIES',
  institutions = [],
  backgroundColor = '#ffffff',
  carouselSpeed = 5,
}) => {
  const [displayedLogos, setDisplayedLogos] = useState<Institution[]>([]);
  const [sortedLogos, setSortedLogos] = useState<Institution[]>([]);
  const [animationPaused, setAnimationPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Sort institutions by display order
  useEffect(() => {
    if (institutions.length > 0) {
      const sorted = [...institutions].sort((a, b) => {
        const orderA = a.displayOrder || 100;
        const orderB = b.displayOrder || 100;
        return orderA - orderB;
      });
      
      setSortedLogos(sorted);
      // Double the logos to create a seamless loop for desktop
      setDisplayedLogos([...sorted, ...sorted]);
    }
  }, [institutions]);

  // Calculate animation duration based on speed and number of logos
  const getAnimationDuration = () => {
    const logoCount = institutions.length;
    // Convert carouselSpeed from seconds per logo to total animation time
    // Using a slower base speed for smoother continuous movement
    return Math.max(logoCount * carouselSpeed * 2, 20);
  };

  // Pause animation on hover
  const handleMouseEnter = () => setAnimationPaused(true);
  const handleMouseLeave = () => setAnimationPaused(false);

  // If there are no institutions, don't render anything
  if (!institutions || institutions.length === 0) {
    return null;
  }

  // Chunk logos into rows (2-2-1 layout for mobile)
  const logoRows = [
    sortedLogos.slice(0, 2), // First row: first 2 logos
    sortedLogos.slice(2, 4), // Second row: next 2 logos
    sortedLogos.slice(4, 5)  // Third row: remaining logo
  ].filter(row => row.length > 0);

  return (
    <div className="w-full" style={{ backgroundColor }}>
      {/* This entire container has the background color with padding at the top */}
      <div className="py-3 md:py-6 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Banner text with increased top padding */}
          <div className="text-center mb-1 md:mb-2 pt-2 md:pt-5">
            {title && (
              <div className="text-sm md:text-base font-medium text-gray-600">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="text-base md:text-lg font-bold text-blue-800">
                {subtitle}
              </div>
            )}
          </div>
          
          {/* Mobile view: Static grid layout (2-2-1) */}
          <div className="md:hidden mt-4">
            {logoRows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex justify-center items-center gap-4 mb-6">
                {row.map((institution, index) => (
                  <div
                    key={`static-${institution.name}-${index}`}
                    className="flex-shrink-0 flex flex-col items-center justify-center"
                  >
                    <div className="relative h-14 w-28 mb-2">
                      <Image
                        src={urlFor(institution.logo).width(250).height(125).url()}
                        alt={institution.name}
                        fill
                        className="object-contain"
                        sizes="112px"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    </div>
                    <div className="text-xs text-center font-medium text-gray-700 max-w-[90px] truncate">
                      {institution.name}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Desktop view: Logo carousel with continuous animation */}
          <div 
            className="hidden md:block overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              ref={carouselRef}
              className="flex items-center justify-center space-x-12 pb-1"
              style={{
                animation: animationPaused 
                  ? 'none' 
                  : `logoScroll ${getAnimationDuration()}s linear infinite`,
                // Use transform to create smooth continuous movement
                willChange: 'transform',
              }}
            >
              {displayedLogos.map((institution, index) => (
                <div 
                  key={`${institution.name}-${index}`} 
                  className="flex-shrink-0 flex flex-col items-center justify-center h-32"
                >
                  <div className="relative h-24 w-48 mb-2">
                    <Image
                      src={urlFor(institution.logo).width(250).height(125).url()}
                      alt={institution.name}
                      fill
                      className="object-contain"
                      sizes="250px"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                  <div className="text-sm text-center font-medium text-gray-700 max-w-[170px] truncate">
                    {institution.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animation keyframes */}
      <style jsx global>{`
        @keyframes logoScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default TrustedInstitutionsBanner; 