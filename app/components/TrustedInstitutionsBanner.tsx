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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedLogos, setDisplayedLogos] = useState<Institution[]>([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle window resize to determine how many logos to show
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Determine how many logos to show based on screen width
  const getLogosPerView = () => {
    if (windowWidth < 640) return 2; // Mobile: 2 logos
    if (windowWidth < 768) return 3; // Small tablets: 3 logos
    if (windowWidth < 1024) return 4; // Tablets: 4 logos
    return 5; // Desktop: 5 logos
  };

  // Carousel autoplay effect
  useEffect(() => {
    if (displayedLogos.length <= getLogosPerView()) return; // Don't animate if all logos fit

    const timer = setTimeout(() => {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayedLogos.length);
      
      // Remove animation class after transition completes
      const resetAnimation = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      
      return () => clearTimeout(resetAnimation);
    }, carouselSpeed * 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, displayedLogos.length, carouselSpeed]);

  // Get visible logos based on current index and screen size
  const getVisibleLogos = () => {
    const logosPerView = getLogosPerView();
    if (displayedLogos.length <= logosPerView) return displayedLogos;
    
    // Create a circular array of logos to display
    const result = [];
    for (let i = 0; i < logosPerView; i++) {
      const index = (currentIndex + i) % displayedLogos.length;
      result.push(displayedLogos[index]);
    }
    return result;
  };

  // If there are no institutions, don't render anything
  if (!institutions || institutions.length === 0) {
    return null;
  }

  return (
    <div 
      className="py-4 md:py-6 w-full" 
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner text */}
        <div className="text-center mb-4">
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
        
        {/* Logo carousel */}
        <div 
          ref={containerRef}
          className={`flex items-center justify-center space-x-4 md:space-x-8 transition-all duration-1000 ease-in-out ${isAnimating ? 'opacity-80' : 'opacity-100'}`}
        >
          {getVisibleLogos().map((institution, index) => (
            <div 
              key={`${institution.name}-${index}`} 
              className="flex-shrink-0 flex items-center justify-center h-16 md:h-20"
            >
              <div className="relative h-12 md:h-16 w-24 md:w-32">
                <Image
                  src={urlFor(institution.logo).width(200).height(100).url()}
                  alt={institution.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100px, 150px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustedInstitutionsBanner; 