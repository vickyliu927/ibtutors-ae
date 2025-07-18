'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSubjectPages, type SubjectPageData } from './NavSubjects';
import { getCurriculumPages, type CurriculumPageData } from './NavCurriculums';
import { urlFor } from '@/sanity/lib/image';
import ExternalLink from './ui/ExternalLink';

// Navbar data interface
interface NavbarData {
  logo: any;
  logoLink: string;
  navigation: {
    levelsText: string;
    subjectsText: string;
  };
  buttonText: string;
  buttonLink: string;
}

interface NavbarProps {
  navbarData?: NavbarData | null;
}

// Create a class name with specific meaning to avoid conflicts
const MOBILE_ONLY_CLASS = 'mobile-menu-button';

const Navbar = ({ navbarData }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subjects, setSubjects] = useState<SubjectPageData[]>([]);
  const [curriculums, setCurriculums] = useState<CurriculumPageData[]>([]);
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  const [showLevelsDropdown, setShowLevelsDropdown] = useState(false);

  const subjectsDropdownRef = useRef<HTMLDivElement>(null);
  const levelsDropdownRef = useRef<HTMLDivElement>(null);
  const subjectsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const levelsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    fetchSubjects();
    fetchCurriculums();

    return () => {
      if (subjectsTimeoutRef.current) {
        clearTimeout(subjectsTimeoutRef.current);
      }
      if (levelsTimeoutRef.current) {
        clearTimeout(levelsTimeoutRef.current);
      }
    };
  }, []);

  const isExternalLink = (url: string) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-30 w-full bg-transparent">
      <div className="flex w-full max-w-[1440px] mx-auto px-[16px] py-[24px] justify-between items-center">
        {/* Logo */}
        <Link href={navbarData?.logoLink || "/"} className="flex items-center">
          {navbarData?.logo ? (
            <Image
              src={urlFor(navbarData.logo).height(41).url()}
              alt="Company Logo"
              width={188}
              height={41}
              className="object-contain"
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
        <div className="hidden md:flex items-center gap-[44px]">
          {/* All Levels Dropdown */}
          <div
                        className="relative"
            ref={levelsDropdownRef}
            onMouseEnter={handleLevelsMouseEnter}
            onMouseLeave={handleLevelsMouseLeave}
                      >
            <button className="flex items-center gap-[8px] text-[#171D23] text-[16px] font-medium leading-[140%] font-gilroy">
              {navbarData?.navigation?.levelsText || 'All Levels'}
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

          {/* All Subjects Dropdown */}
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

        {/* Mobile Menu */}
        {isOpen && (
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
                  >
                    {subject.subject}
                  </Link>
                ))}
              </div>
                <Link 
                href={navbarData?.buttonLink || "#contact-form"}
                className="block w-full py-3 px-6 bg-[#001A96] text-white text-center rounded-[28px] font-semibold"
                >
                {navbarData?.buttonText || 'Hire a tutor'}
                </Link>
            </div>
          </div>
        )}
        </div>
    </nav>
  );
};

export default Navbar; 