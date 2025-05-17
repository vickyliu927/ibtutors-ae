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
      
      // Double the logos to create a seamless loop
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

  return (
    <div 
      className="py-2 md:py-3 w-full" 
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner text */}
        <div className="text-center mb-2">
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
        
        {/* Logo carousel with continuous animation */}
        <div 
          className="overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={carouselRef}
            className="flex items-center justify-center space-x-8 md:space-x-12 pb-1"
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
                className="flex-shrink-0 flex items-center justify-center h-20 md:h-24"
              >
                <div className="relative h-20 md:h-24 w-36 md:w-48">
                  <Image
                    src={urlFor(institution.logo).width(250).height(125).url()}
                    alt={institution.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 150px, 250px"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
              </div>
            ))}
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