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
  const [transitionEnabled, setTransitionEnabled] = useState(true);

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

  // Improved carousel animation effect with smoother transitions
  useEffect(() => {
    if (!displayedLogos.length || displayedLogos.length < 2 || animationPaused) return;

    const interval = setInterval(() => {
      // Start transition
      setIsAnimating(true);
      
      // After transition completes, rearrange items without animation
      setTimeout(() => {
        setTransitionEnabled(false);
        setIsAnimating(false);
        
        // Move first item to the end
        setDisplayedLogos(prevLogos => {
          const newLogos = [...prevLogos];
          const firstLogo = newLogos.shift();
          if (firstLogo) newLogos.push(firstLogo);
          return newLogos;
        });
        
        // Re-enable transitions after rearrangement
        setTimeout(() => {
          setTransitionEnabled(true);
        }, 50);
      }, 700); // Match this with CSS transition duration
      
    }, carouselSpeed * 1000);
    
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
        {/* Banner text - Now back on top */}
        <div className="text-center mb-5">
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
          className="overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={carouselRef}
            className="flex items-center justify-center space-x-8 md:space-x-12"
            style={{
              opacity: isAnimating ? 0.9 : 1,
              transition: transitionEnabled ? 'transform 0.7s ease-in-out, opacity 0.7s ease-in-out' : 'none'
            }}
          >
            {displayedLogos.map((institution, index) => (
              <div 
                key={`${institution.name}-${index}`} 
                className="flex-shrink-0 flex items-center justify-center h-24 md:h-28"
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
    </div>
  );
};

export default TrustedInstitutionsBanner; 