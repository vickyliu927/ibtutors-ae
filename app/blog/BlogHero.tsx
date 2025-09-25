'use client';

import React from 'react';

export interface BlogHeroProps {
  title?: string;
  description?: string;
}

export default function BlogHero({ title = 'Blog', description = 'Insights, guides, and resources from our expert tutors.' }: BlogHeroProps) {
  return (
    <section
      className="w-full relative"
      style={{
        background:
          'linear-gradient(103deg, #FFF6F3 0%, #F2F4FA 68.07%, #F6F5FE 100%)',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 pt-12 sm:pt-16 lg:pt-20 pb-24 sm:pb-28 lg:pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[40px] sm:text-[48px] lg:text-[56px] leading-[120%] font-medium text-[#171D23] font-gilroy">
            {title}
          </h1>
          <p className="mt-4 text-[#171D23] text-lg sm:text-xl font-light leading-[160%] font-gilroy">
            {description}
          </p>
        </div>
      </div>
      {/* Overlap container: pulls next section up */}
      <div className="absolute bottom-[-48px] left-0 right-0 h-12 sm:h-16 lg:h-20 pointer-events-none" />
    </section>
  );
}


