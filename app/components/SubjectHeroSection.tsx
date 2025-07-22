'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getSubjectPages, type SubjectPageData } from './NavSubjects';
import { getCurriculumPages, type CurriculumPageData } from './NavCurriculums';
import { getSubjectHeroData, type SubjectHeroData } from '../lib/getSubjectHeroData';

interface SubjectHeroSectionProps {
  className?: string;
  subjectSlug?: string;
}

const SubjectHeroSection = ({ className = '', subjectSlug }: SubjectHeroSectionProps) => {
  const [subjects, setSubjects] = useState<SubjectPageData[]>([]);
  const [curriculums, setCurriculums] = useState<CurriculumPageData[]>([]);
  const [heroData, setHeroData] = useState<SubjectHeroData | null>(null);
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  const [showLevelsDropdown, setShowLevelsDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const subjectsDropdownRef = useRef<HTMLDivElement>(null);
  const levelsDropdownRef = useRef<HTMLDivElement>(null);
  const subjectsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const levelsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dropdown handlers
  const handleSubjectsMouseEnter = () => {
    if (subjectsTimeoutRef.current) {
      clearTimeout(subjectsTimeoutRef.current);
      subjectsTimeoutRef.current = null;
    }
    setShowSubjectsDropdown(true);
  };

  const handleSubjectsMouseLeave = () => {
    subjectsTimeoutRef.current = setTimeout(() => {
      setShowSubjectsDropdown(false);
    }, 300);
  };

  const handleLevelsMouseEnter = () => {
    if (levelsTimeoutRef.current) {
      clearTimeout(levelsTimeoutRef.current);
      levelsTimeoutRef.current = null;
    }
    setShowLevelsDropdown(true);
  };

  const handleLevelsMouseLeave = () => {
    levelsTimeoutRef.current = setTimeout(() => {
      setShowLevelsDropdown(false);
    }, 300);
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectPages = await getSubjectPages();
        setSubjects(subjectPages);
      } catch (error) {
        console.error('Error fetching subject pages:', error);
      }
    };

    const fetchCurriculums = async () => {
      try {
        const curriculumPages = await getCurriculumPages();
        const sortedCurriculums = curriculumPages.sort((a, b) => a.displayOrder - b.displayOrder);
        setCurriculums(sortedCurriculums);
      } catch (error) {
        console.error('Error fetching curriculum pages:', error);
      }
    };

    const fetchHeroData = async () => {
      try {
        const data = await getSubjectHeroData(subjectSlug);
        setHeroData(data);
      } catch (error) {
        console.error('Error fetching subject hero data:', error);
      }
    };

    fetchSubjects();
    fetchCurriculums();
    fetchHeroData();

    return () => {
      if (subjectsTimeoutRef.current) {
        clearTimeout(subjectsTimeoutRef.current);
      }
      if (levelsTimeoutRef.current) {
        clearTimeout(levelsTimeoutRef.current);
      }
    };
  }, [subjectSlug]); // Re-fetch when subjectSlug changes

  return (
    <div
      className={`relative w-full h-[300px] sm:h-[350px] lg:h-[378px] overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(103deg, #FFF6F3 0%, #F2F4FA 68.07%, #F6F5FE 100%)'
      }}
    >
      {/* Header Navigation */}
      <div className="absolute left-0 top-0 flex w-full max-w-[1440px] mx-auto px-4 sm:px-[30px] py-4 sm:py-[24px] justify-between items-center h-[80px] sm:h-[96px] z-20">
        {/* Logo */}
        <Link href="/" className="flex h-12 items-center">
          <div className="relative w-[188px] h-[41px]">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/e64c8d35b1d775ba1fd0098e334800df6b0f0cc9?width=297"
              alt="TutorChase Logo"
              className="absolute left-[39px] top-[3px] w-[149px] h-[18px]"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/cd779b73627c630cd5e5a68274c5da27f4ca9bd9?width=64"
              alt="Logo Icon"
              className="absolute left-0 top-0 w-[32px] h-[41px]"
            />
            <div className="absolute left-[41px] top-[25px] w-[75px] h-[13px]">
              <span className="text-[10px] italic font-semibold leading-[100%] font-gilroy text-[#0D173D]">
                Dubai Tutors
              </span>
            </div>
          </div>
        </Link>

        {/* Menu Items - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          <div
            className="relative"
            ref={levelsDropdownRef}
            onMouseEnter={handleLevelsMouseEnter}
            onMouseLeave={handleLevelsMouseLeave}
          >
            <button className="flex items-center gap-1">
              <span className="text-[16px] font-medium leading-[140%] font-gilroy text-textDark">
                All Levels
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 4.5L6 8L2.5 4.5" stroke="#171D23" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {showLevelsDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-30">
                {curriculums.map((curriculum) => {
                  const curriculumPath = `/${curriculum.slug.current.replace(/^\/+/, '')}`;
                  return (
                    <Link
                      key={curriculum.slug.current}
                      href={curriculumPath}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {curriculum.curriculum}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div
            className="relative"
            ref={subjectsDropdownRef}
            onMouseEnter={handleSubjectsMouseEnter}
            onMouseLeave={handleSubjectsMouseLeave}
          >
            <button className="flex items-center gap-1">
              <span className="text-[16px] font-medium leading-[140%] font-gilroy text-textDark">
                All Subjects
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 4.5L6 8L2.5 4.5" stroke="#171D23" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {showSubjectsDropdown && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-30 grid grid-cols-2 gap-1">
                {subjects.map((subject) => (
                  <Link
                    key={subject.slug.current}
                    href={`/${subject.slug.current}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {subject.subject}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hire a tutor button - Hidden on mobile */}
        <div className="hidden md:flex justify-end items-center gap-4">
          <Link
            href="#contact-form"
            className="flex h-[42px] px-6 justify-center items-center rounded-[28px] text-[14px] font-medium leading-[140%] font-gilroy bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Hire a tutor
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="#171D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-30">
            <div className="px-4 py-4 space-y-4">
              <div>
                <div className="font-semibold text-gray-800 mb-2">Levels</div>
                {curriculums.map((curriculum) => {
                  const curriculumPath = `/${curriculum.slug.current.replace(/^\/+/, '')}`;
                  return (
                    <Link
                      key={curriculum.slug.current}
                      href={curriculumPath}
                      className="block py-2 text-gray-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {curriculum.curriculum}
                    </Link>
                  );
                })}
              </div>
              <div>
                <div className="font-semibold text-gray-800 mb-2">Subjects</div>
                {subjects.slice(0, 6).map((subject) => (
                  <Link
                    key={subject.slug.current}
                    href={`/${subject.slug.current}`}
                    className="block py-2 text-gray-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {subject.subject}
                  </Link>
                ))}
              </div>
              <Link
                href="#contact-form"
                className="block w-full py-3 px-6 bg-primary text-white text-center rounded-[28px] font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hire a tutor
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex w-full max-w-[1441px] mx-auto px-4 pt-[120px] sm:pt-[130px] lg:pt-[136px] pb-[40px] sm:pb-[50px] lg:pb-[60px] flex-col justify-end items-center gap-4 sm:gap-6">
        {/* Rating Section */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Stars */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => (
              <svg key={index} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1L12.2451 7.90983H19.5106L13.6327 12.1803L15.8779 19.0902L10 14.8197L4.12215 19.0902L6.36729 12.1803L0.489435 7.90983H7.75486L10 1Z" fill="#FFC235"/>
              </svg>
            ))}
          </div>

          {/* Rating Text */}
          <span className="text-[16px] leading-[140%] font-gilroy text-textDark opacity-70">
            {heroData?.rating?.score || '4.92/5'} {heroData?.rating?.basedOnText || 'based on'}
          </span>

          <span className="text-[16px] leading-[140%] font-gilroy text-black underline">
            {heroData?.rating?.reviewCount || '546 reviews'}
          </span>
        </div>

        {/* Heading Section */}
        <div className="flex flex-col justify-center items-center gap-6 text-center px-4">
          {/* Title */}
          <h1 className="text-[28px] sm:text-[40px] lg:text-[56px] font-semibold leading-[100%] font-gilroy" style={{ fontWeight: 600 }}>
            <span className="text-[#1D1D35]">{heroData?.title?.firstPart || '#1 Rated '}</span>
            <span className="text-primary">{heroData?.title?.secondPart || 'Online IB Tutors'}</span>
          </h1>

          {/* Subtitle */}
          <div className="w-full max-w-[600px] text-center text-[14px] sm:text-[16px] lg:text-[18px] leading-[140%] font-gilroy text-textDark" style={{ fontWeight: 200 }}>
            {heroData?.subtitle || 'Study with IB examiners and qualified teachers. Recommended by 98% of IB students in United Kingdom and globally!'}
          </div>
        </div>
      </div>

      {/* Decorative Cards - Only visible on large screens */}
      <div className="hidden xl:block absolute left-[57px] top-[115px] w-[1380px] h-[208px]">
        {/* Right Card - Moved further right */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/4398d714395ea97a84425a4f237fef6197e4064e?width=198"
          alt="Decorative card"
          className="absolute left-[1280px] top-0 w-[180px] h-[184px]"
        />

        {/* Left Card - Increased width */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/973532e524d3d383236e66295cd78c2285b8a455?width=169"
          alt="Decorative card"
          className="absolute left-0 top-[89px] w-[160px] h-[178px]"
        />
      </div>
    </div>
  );
};

export default SubjectHeroSection;
