'use client';

import React from 'react';

export interface BlogHeroProps {
  title?: string;
  description?: string;
}

export default function BlogHero({ title = 'Blog', description = 'Insights, guides, and resources from our expert tutors.' }: BlogHeroProps) {
  return (
    <section
      className="w-full"
      style={{
        background:
          'linear-gradient(103deg, #FFF6F3 0%, #F2F4FA 68.07%, #F6F5FE 100%)',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <h1 className="text-[40px] sm:text-[48px] lg:text-[56px] leading-[120%] font-medium text-[#171D23] font-gilroy">
            {title}
          </h1>
          <p className="mt-4 text-[#171D23] text-lg sm:text-xl font-light leading-[160%] font-gilroy">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}


