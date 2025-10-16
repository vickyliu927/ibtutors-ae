'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import ExternalLink from './ui/ExternalLink';

// Import types for server-side props
interface SubjectPageData {
  title: string;
  subject: string;
  slug: {
    current: string;
  };
  displayOrder: number;
}

interface CurriculumPageData {
  title: string;
  curriculum: string;
  slug: {
    current: string;
  };
  displayOrder: number;
  subjectPages?: {
    subject: string;
    slug: { current: string };
    displayOrder: number;
  }[];
}

// Navbar data interface
interface NavbarData {
  logo: any;
  logoLink: string;
  navigation: {
    levelsText: string;
    subjectsText: string;
    allLevelsPageLink?: string;
    allSubjectsPageLink?: string;
  };
  mobileMenu?: {
    closeButtonColor?: string;
    dropdownArrowColor?: string;
    borderColor?: string;
  };
  buttonText: string;
  buttonLink: string;
}

interface NavbarProps {
  navbarData?: NavbarData | null;
  subjects?: SubjectPageData[];  // Server-side data
  curriculums?: CurriculumPageData[];  // Server-side data
  currentDomain?: string;  // Domain context for link generation
  hasBlog?: boolean; // controls display of Blog link
}

// Create a class name with specific meaning to avoid conflicts
const MOBILE_ONLY_CLASS = 'mobile-menu-button';

const Navbar = ({ navbarData, subjects = [], curriculums = [], currentDomain, hasBlog = true }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  const [showCurriculumDropdowns, setShowCurriculumDropdowns] = useState<{[key: string]: boolean}>({});
  const [isScrolled, setIsScrolled] = useState(false);
  // Mobile submenu states
  const [mobileSubmenuView, setMobileSubmenuView] = useState<'main' | 'subjects'>('main');
  const hasSubjects = Array.isArray(subjects) && subjects.length > 0;

  const subjectsDropdownRef = useRef<HTMLDivElement>(null);
  const subjectsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const curriculumDropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const curriculumTimeoutRefs = useRef<{[key: string]: NodeJS.Timeout | null}>({});

  // Helper function to generate proper domain-aware links
  const generateSubjectLink = (slug: string) => `/${slug}`;

  // Add global style when component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (min-width: 768px) {
        .${MOBILE_ONLY_CLASS} {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  const handleCurriculumMouseEnter = (curriculumSlug: string) => {
    if (curriculumTimeoutRefs.current[curriculumSlug]) {
      clearTimeout(curriculumTimeoutRefs.current[curriculumSlug]!);
      curriculumTimeoutRefs.current[curriculumSlug] = null;
    }
    setShowCurriculumDropdowns(prev => ({
      ...prev,
      [curriculumSlug]: true
    }));
  };

  const handleCurriculumMouseLeave = (curriculumSlug: string) => {
    curriculumTimeoutRefs.current[curriculumSlug] = setTimeout(() => {
      setShowCurriculumDropdowns(prev => ({
        ...prev,
        [curriculumSlug]: false
      }));
    }, 300);
  };



  // Handle scroll for mobile background (keep original functionality)
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return; // SSR safety

      const scrollTop = window.scrollY;
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        const shouldShowBg = scrollTop > 10;
        setIsScrolled(shouldShowBg);
      } else {
        setIsScrolled(false);
      }
    };

    // Set initial scroll state and add listeners (client-side only)
    if (typeof window !== 'undefined') {
      // Small delay to ensure DOM is loaded
      setTimeout(() => handleScroll(), 100);
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      if (subjectsTimeoutRef.current) {
        clearTimeout(subjectsTimeoutRef.current);
      }
      // Clear all curriculum timeouts
      Object.values(curriculumTimeoutRefs.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      }
    };
  }, []);

  const isExternalLink = (url: string) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  };

  return (
    <nav
      className={`${isScrolled ? 'fixed' : 'absolute'} md:absolute top-0 left-0 right-0 z-30 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white md:bg-transparent shadow-md md:shadow-none' : 'bg-transparent'
      }`}
    >
      <div className="flex w-full max-w-[1440px] mx-auto px-[16px] py-[24px] justify-between items-center">
        {/* Logo */}
        <Link href={navbarData?.logoLink || "/"} className="flex items-center">
          {navbarData?.logo ? (
            <Image
              src={urlFor(navbarData.logo).width(376).height(82).quality(95).url()}
              alt="Company Logo"
              width={188}
              height={41}
              className="object-contain"
              sizes="188px"
            />
          ) : (
            <div className="relative w-[188px] h-[41px]">
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/2bd75eea4781d78fa262562983b8251170bea168?width=297"
                alt="TutorChase Logo"
                width={149}
                height={18}
                className="absolute left-[39px] top-[3px]"
              />
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/92785eb93ccb208978e339aa7f50908bac820333?width=64"
                alt="Logo Icon"
                width={32}
                height={41}
                className="absolute left-0 top-0"
              />
              <div className="absolute left-[41px] top-[25px] w-[75px] h-[13px]">
                <span className="text-[#0D2854] text-[10px] italic font-medium leading-[100%] font-gilroy">
                  Dubai Tutors
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-[48px]">
          {/* Curriculum Dropdowns */}
          {curriculums.map((curriculum) => {
            const curriculumPath = generateSubjectLink(curriculum.slug.current);
            const curriculumSlug = curriculum.slug.current;
            
            return (
              <div
                key={curriculum.slug.current}
                className="relative"
                ref={el => { curriculumDropdownRefs.current[curriculumSlug] = el; }}
                onMouseEnter={() => handleCurriculumMouseEnter(curriculumSlug)}
                onMouseLeave={() => handleCurriculumMouseLeave(curriculumSlug)}
              >
                <button className="flex items-center gap-[8px] text-[#171D23] text-[16px] font-medium leading-[140%] font-gilroy hover:text-[#001A96] transition-colors">
                  {curriculum.curriculum}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.5 4.5L6 8L2.5 4.5"
                      stroke="#171D23"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {showCurriculumDropdowns[curriculumSlug] && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-30">
                    {/* Main curriculum page link */}
                    <Link
                      href={curriculumPath}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                    >
                      {curriculum.curriculum} Overview
                    </Link>
                    
                    {/* Curriculum-specific subject pages */}
                    {Array.isArray(curriculum.subjectPages) && curriculum.subjectPages.length > 0 ? (
                      <div className="mt-1 border-t border-gray-100 pt-1">
                        {curriculum.subjectPages
                          .slice()
                          .sort((a, b) => (a.displayOrder || 100) - (b.displayOrder || 100))
                          .map((sp) => (
                            <Link
                              key={sp.slug.current}
                              href={generateSubjectLink(sp.slug.current)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {sp.subject}
                            </Link>
                          ))}
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-xs text-gray-400 italic">
                        Subject pages coming soon...
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* All Subjects Dropdown - hidden if no subjects */}
          {hasSubjects && (
            <div 
              className="relative"
              ref={subjectsDropdownRef}
              onMouseEnter={handleSubjectsMouseEnter}
              onMouseLeave={handleSubjectsMouseLeave}
            >
              <button className="flex items-center gap-[8px] text-[#171D23] text-[16px] font-medium leading-[140%] font-gilroy">
                {navbarData?.navigation?.subjectsText || 'All Subjects'}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 4.5L6 8L2.5 4.5"
                    stroke="#171D23"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              
              {showSubjectsDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-30 grid grid-cols-2 gap-1">
                  {subjects.map((subject) => (
                    <Link
                      key={subject.slug.current}
                      href={generateSubjectLink(subject.slug.current)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {subject.subject}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Blog Link */}
          {hasBlog && (
            <Link href="/blog" className="text-[#171D23] text-[16px] font-medium leading-[140%] font-gilroy hover:text-[#001A96] transition-colors">
              Blog
            </Link>
          )}
        </div>

        {/* CTA Button */}
        <Link
          href={navbarData?.buttonLink || "#contact-form"}
          className="hidden md:flex h-[42px] px-[24px] justify-center items-center rounded-[28px] bg-[#001A96] text-white text-[14px] font-medium leading-[140%] hover:bg-[#001A96]/90 transition-colors font-gilroy"
        >
          {navbarData?.buttonText || 'Hire a tutor'}
        </Link>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 ${MOBILE_ONLY_CLASS}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="#171D23"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-white z-50 md:hidden">
            {/* Mobile Header */}
            <div className="flex w-full max-w-[1440px] mx-auto px-[16px] py-[24px] justify-between items-center">
              {/* Logo - Same as main header */}
              <Link href={navbarData?.logoLink || "/"} className="flex items-center">
                {navbarData?.logo ? (
                  <Image
                    src={urlFor(navbarData.logo).width(376).height(82).quality(95).url()}
                    alt="Company Logo"
                    width={188}
                    height={41}
                    className="object-contain"
                    sizes="188px"
                  />
                ) : (
                  <div className="relative w-[188px] h-[41px]">
                    <Image
                      src="https://api.builder.io/api/v1/image/assets/TEMP/2bd75eea4781d78fa262562983b8251170bea168?width=297"
                      alt="TutorChase Logo"
                      width={149}
                      height={18}
                      className="absolute left-[39px] top-[3px]"
                    />
                    <Image
                      src="https://api.builder.io/api/v1/image/assets/TEMP/92785eb93ccb208978e339aa7f50908bac820333?width=64"
                      alt="Logo Icon"
                      width={32}
                      height={41}
                      className="absolute left-0 top-0"
                    />
                    <div className="absolute left-[41px] top-[25px] w-[75px] h-[13px]">
                      <span className="text-[#0D2854] text-[10px] italic font-medium leading-[100%] font-gilroy">
                        Dubai Tutors
                      </span>
                    </div>
                  </div>
                )}
              </Link>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setMobileSubmenuView('main');
                }}
                className="w-6 h-6 flex items-center justify-center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_14011_125636)">
                    <path
                      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                      fill={navbarData?.mobileMenu?.closeButtonColor || '#000000'}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_14011_125636">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between items-start px-4 pt-3 pb-16" style={{ height: 'calc(100vh - 72px)' }}>
              
              {/* Main Menu View */}
              {mobileSubmenuView === 'main' && (
                <div className="flex flex-col items-start w-full">
                  {/* Direct Curriculum Links */}
                  <div className="w-full">
                    {curriculums.map((curriculum, index) => {
                      const curriculumPath = generateSubjectLink(curriculum.slug.current);
                      return (
                        <Link
                          key={curriculum.slug.current}
                          href={curriculumPath}
                          onClick={() => setIsOpen(false)}
                          className={`flex w-full py-4 px-4 justify-between items-center bg-white hover:bg-gray-50 ${
                            index === 0 ? 'border-t border-b' : 'border-b'
                          }`}
                          style={{ borderColor: navbarData?.mobileMenu?.borderColor || '#F7F7FC' }}
                        >
                          <span className="text-[#171D23] font-gilroy text-base font-normal leading-[140%]">
                            {curriculum.curriculum}
                          </span>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.5 11L8.49886 6L3.5 1"
                              stroke={navbarData?.mobileMenu?.dropdownArrowColor || '#001A96'}
                              strokeWidth="1.6"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Blog Link */}
                  {hasBlog && (
                    <Link
                      href="/blog"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full py-4 px-4 justify-between items-center border-b bg-white hover:bg-gray-50"
                      style={{ borderColor: navbarData?.mobileMenu?.borderColor || '#F7F7FC' }}
                    >
                      <span className="text-[#171D23] font-gilroy text-base font-normal leading-[140%]">Blog</span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.5 11L8.49886 6L3.5 1"
                          stroke={navbarData?.mobileMenu?.dropdownArrowColor || '#001A96'}
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  )}

                  {/* All Subjects Button - hidden if no subjects */}
                  {hasSubjects && (
                    <div className="w-full">
                      <button
                        onClick={() => setMobileSubmenuView('subjects')}
                        className="flex w-full py-4 px-4 justify-between items-center border-b bg-white"
                        style={{ borderColor: navbarData?.mobileMenu?.borderColor || '#F7F7FC' }}
                      >
                        <span className="text-[#171D23] font-gilroy text-base font-normal leading-[140%]">
                          {navbarData?.navigation?.subjectsText || 'All Subjects'}
                        </span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.5 11L8.49886 6L3.5 1"
                            stroke={navbarData?.mobileMenu?.dropdownArrowColor || '#001A96'}
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}



              {/* Subjects Submenu View - hidden if no subjects */}
              {mobileSubmenuView === 'subjects' && hasSubjects && (
                <div className="flex flex-col items-start w-full">
                  {/* Back button with title */}
                  <div className="flex items-center gap-4 py-4 px-4 w-full border-b" style={{ borderColor: navbarData?.mobileMenu?.borderColor || '#F7F7FC' }}>
                    <button
                      onClick={() => setMobileSubmenuView('main')}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.5 1L3.50114 6L8.5 11"
                          stroke="white"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <h2 className="text-[#001A96] font-gilroy text-base font-medium leading-[140%]">
                      {navbarData?.navigation?.subjectsText || 'All Subjects'}
                    </h2>
                  </div>
                  
                  {/* Subjects list */}
                  <div className="w-full">
                    {/* Individual subject links */}
                    {subjects.map((subject) => (
                      <Link
                        key={subject.slug.current}
                        href={generateSubjectLink(subject.slug.current)}
                        onClick={() => setIsOpen(false)}
                        className="flex py-4 px-4 justify-between items-center text-[#171D23] font-gilroy text-base leading-[140%] border-b hover:bg-gray-50"
                        style={{ borderColor: navbarData?.mobileMenu?.borderColor || '#F7F7FC' }}
                      >
                        <span>{subject.subject}</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.5 11L8.49886 6L3.5 1"
                            stroke={navbarData?.mobileMenu?.dropdownArrowColor || '#001A96'}
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Hire a tutor Button */}
              <div className="flex w-full flex-col justify-center items-start gap-3">
                <Link
                  href={navbarData?.buttonLink || "#contact-form"}
                  onClick={() => setIsOpen(false)}
                  className="flex h-12 px-4 justify-center items-center w-full rounded-[28px] bg-primary text-white text-center text-base font-normal leading-[140%] font-gilroy"
                >
                  {navbarData?.buttonText || 'Hire a tutor'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
