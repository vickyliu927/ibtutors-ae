'use client';
import React, { useState, useEffect } from 'react';
import { getSubjectHeroData, type SubjectHeroData } from '../lib/getSubjectHeroData';

interface SubjectHeroSectionProps {
  className?: string;
  subjectSlug?: string;
}

const SubjectHeroSection = ({ className = '', subjectSlug }: SubjectHeroSectionProps) => {
  const [heroData, setHeroData] = useState<SubjectHeroData | null>(null);

  // Fetch hero data on mount
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await getSubjectHeroData(subjectSlug);
        setHeroData(data);
      } catch (error) {
        console.error('Error fetching subject hero data:', error);
      }
    };

    fetchHeroData();
  }, [subjectSlug]); // Re-fetch when subjectSlug changes

  return (
    <div
      className={`relative w-full min-h-[500px] md:min-h-[200px] md:h-auto overflow-hidden md:overflow-visible ${className}`}
      style={{
        background: 'linear-gradient(103deg, #FFF6F3 0%, #F2F4FA 68.07%, #F6F5FE 100%)'
      }}
    >

      {/* Main Content */}
      <div className="flex w-full max-w-[1441px] mx-auto px-4 pt-[60px] md:pt-[105px] lg:pt-[110px] pb-[40px] md:pb-[60px] lg:pb-[65px] flex-col justify-end md:justify-start items-center gap-4 md:gap-4 lg:gap-5">
        
        {/* Mobile Layout - Title, Description, Ratings */}
        <div className="flex md:hidden flex-col justify-start items-start gap-6 text-left px-4 w-full">
          {/* Title - Mobile */}
          <h1 className="text-[48px] font-semibold leading-[100%] font-gilroy" style={{ fontWeight: 600 }}>
            <span className="text-[#1D1D35]">{heroData?.title?.firstPart || '#1 Rated '}</span>
            <span className="text-primary">{heroData?.title?.secondPart || 'Online IB Maths Tutors'}</span>
          </h1>

          {/* Subtitle - Mobile */}
          <div className="w-full text-left text-[20px] leading-[140%] font-gilroy text-textDark" style={{ fontWeight: 200 }}>
            {heroData?.subtitle || 'Study with IB examiners and qualified teachers. Recommended by 98% of IB maths students in United Kingdom and globally!'}
          </div>

          {/* Rating Section - Mobile */}
          <div className="flex items-center gap-3 flex-wrap justify-start">
            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, index) => (
                <svg key={index} width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.2451 7.90983H19.5106L13.6327 12.1803L15.8779 19.0902L10 14.8197L4.12215 19.0902L6.36729 12.1803L0.489435 7.90983H7.75486L10 1Z" fill="#FFC235"/>
                </svg>
              ))}
            </div>

            {/* Rating Text */}
            <span className="text-[20px] leading-[140%] font-gilroy text-textDark opacity-70">
              {heroData?.rating?.score || '4.91/5'} {heroData?.rating?.basedOnText || 'based on'}
            </span>

            <span className="text-[20px] leading-[140%] font-gilroy text-black underline">
              {heroData?.rating?.reviewCount || '578 reviews'}
            </span>
          </div>
        </div>

        {/* Desktop Layout - Original centered layout */}
        <div className="hidden md:flex flex-col justify-center items-center gap-6 text-center px-4">
          {/* Rating Section - Desktop */}
          <div className="flex items-center gap-3 flex-wrap justify-center py-2">
            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, index) => (
                <svg key={index} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L12.2451 7.90983H19.5106L13.6327 12.1803L15.8779 19.0902L10 14.8197L4.12215 19.0902L6.36729 12.1803L0.489435 7.90983H7.75486L10 1Z" fill="#FFC235"/>
                </svg>
              ))}
            </div>

            {/* Rating Text */}
            <span className="text-[16px] leading-[160%] font-gilroy text-textDark opacity-70 py-1">
              {heroData?.rating?.score || '4.92/5'} {heroData?.rating?.basedOnText || 'based on'}
            </span>

            <span className="text-[16px] leading-[160%] font-gilroy text-black underline py-1">
              {heroData?.rating?.reviewCount || '546 reviews'}
            </span>
          </div>

          {/* Title - Desktop */}
          <h1 className="text-[28px] sm:text-[40px] lg:text-[56px] font-semibold leading-[110%] font-gilroy" style={{ fontWeight: 600 }}>
            <span className="text-[#1D1D35]">{heroData?.title?.firstPart || '#1 Rated '}</span>
            <span className="text-primary">{heroData?.title?.secondPart || 'Online IB Tutors'}</span>
          </h1>

          {/* Subtitle - Desktop */}
          <div className="w-full max-w-[600px] text-center text-[14px] sm:text-[16px] lg:text-[18px] leading-[140%] font-gilroy text-textDark" style={{ fontWeight: 200 }}>
            {heroData?.subtitle || 'Study with IB examiners and qualified teachers. Recommended by 98% of IB students in United Kingdom and globally!'}
          </div>
        </div>
      </div>

      {/* Decorative Cards - Only visible on large screens */}
      <div className="hidden xl:block absolute inset-0 pointer-events-none">
        <div className="relative w-full max-w-[1441px] mx-auto h-full">
          {/* Right Card - High Resolution Live Session */}
          <img
            src="/images/subject-hero-live.jpg"
            alt="Live tutoring session"
            className="absolute right-0 top-[80px] w-[180px] h-[160px] object-cover rounded-lg"
          />

          {/* Left Card - High Resolution Lesson Interface */}
          <img
            src="/images/subject-hero-lesson.jpg"
            alt="Lesson 1 interface"
            className="absolute left-0 top-[140px] w-[160px] h-[160px] object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SubjectHeroSection;
