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
  backgroundColor = '#f8f9fa',
  carouselSpeed = 5,
}) => {
  const [displayedLogos, setDisplayedLogos] = useState<Institution[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [animationPaused, setAnimationPaused] = useState(false);

  // Sort institutions by display order
  useEffect(() => {
    if (institutions.length > 0) {
      const sorted = [...institutions].sort((a, b) => {
        const orderA = a.displayOrder || 100;
        const orderB = b.displayOrder || 100;
        return orderA - orderB;
      });
      setDisplayedLogos(sorted);
    }
  }, [institutions]);

  // Carousel animation effect
  useEffect(() => {
    if (!displayedLogos.length || animationPaused) return;

    // Function to move the first logo to the end
    const rotateLogos = () => {
      setIsAnimating(true);
      setTimeout(() => {
        setDisplayedLogos(prevLogos => {
          const newLogos = [...prevLogos];
          const firstLogo = newLogos.shift();
          if (firstLogo) newLogos.push(firstLogo);
          return newLogos;
        });
        setIsAnimating(false);
      }, 500); // Match this with the CSS transition duration
    };

    // Set up the interval for rotation
    const interval = setInterval(rotateLogos, carouselSpeed * 1000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [displayedLogos, carouselSpeed, animationPaused]);

  // Pause animation on hover
  const handleMouseEnter = () => setAnimationPaused(true);
  const handleMouseLeave = () => setAnimationPaused(false);

  // If there are no institutions, don't render anything
  if (!institutions || institutions.length === 0) {
    return null;
  }

  return (
    <div 
      className="py-6 md:py-8 w-full" 
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* Logo carousel - Now on the left side */}
          <div 
            className="flex-shrink-0 md:w-3/5 overflow-hidden order-2 md:order-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              ref={carouselRef}
              className="flex items-center space-x-8 md:space-x-12 transition-transform duration-500 ease-in-out"
              style={{ opacity: isAnimating ? 0.7 : 1 }}
            >
              {displayedLogos.map((institution, index) => (
                <div 
                  key={`${institution.name}-${index}`} 
                  className="flex-shrink-0 flex items-center justify-center h-20 md:h-24"
                >
                  <div className="relative h-16 md:h-20 w-32 md:w-40">
                    <Image
                      src={urlFor(institution.logo).width(200).height(100).url()}
                      alt={institution.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 150px, 200px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Banner text - Now on the right side */}
          <div className="md:w-2/5 mb-4 md:mb-0 text-left md:pl-8 order-1 md:order-2">
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
        </div>
      </div>
    </div>
  );
};

export default TrustedInstitutionsBanner; 