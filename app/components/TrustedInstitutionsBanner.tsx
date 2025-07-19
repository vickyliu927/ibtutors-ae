'use client';
import React from 'react';
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
  title = 'Trusted by 500+ IB Schools Worldwide',
  subtitle,
  institutions = [],
  backgroundColor = '#ffffff',
  carouselSpeed = 5,
}) => {
  // If there are no institutions, don't render anything
  if (!institutions || institutions.length === 0) {
    return null;
  }

  // Sort institutions by display order
  const sortedLogos = [...institutions].sort((a, b) => {
    const orderA = a.displayOrder || 100;
    const orderB = b.displayOrder || 100;
    return orderA - orderB;
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Text */}
        <div className="text-center mb-16">
          {title && (
            <h2 className="text-2xl md:text-3xl font-medium leading-[130%] text-[#171D23] font-gilroy" style={{ fontWeight: 500 }}>
              {title}
            </h2>
          )}
        </div>
        
        {/* Logo Grid - Centered with even spacing */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 items-center justify-items-center max-w-5xl">
            {sortedLogos.map((institution, index) => (
              <div
                key={`${institution.name}-${index}`}
                className="flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-200"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mb-3">
                  <Image
                    src={urlFor(institution.logo).width(150).height(150).url()}
                    alt={institution.name}
                    fill
                    className="object-contain transition-transform duration-300"
                    sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                  />
                </div>
                <div className="text-xs md:text-sm text-gray-700 font-medium max-w-[100px] md:max-w-[120px] leading-tight">
                  {institution.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedInstitutionsBanner;
