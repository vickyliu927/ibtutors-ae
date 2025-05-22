'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSubjectPages, type SubjectPageData } from './NavSubjects';
import { getCurriculumPages, type CurriculumPageData } from './NavCurriculums';
import { client } from '@/sanity/lib/client';
import ExternalLink from './ui/ExternalLink';

// Create a class name with specific meaning to avoid conflicts
const MOBILE_ONLY_CLASS = 'mobile-menu-button';

async function getNavbarSettings() {
  const query = `*[_type == "navbarSettings"][0]{
    buttonText, 
    buttonLink, 
    navigationOrder, 
    navigationButtons[]{
      buttonType,
      displayText,
      curriculumSlug,
      displayOrder,
      isActive
    }
  }`;
  return client.fetch(query);
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subjects, setSubjects] = useState<SubjectPageData[]>([]);
  const [curriculums, setCurriculums] = useState<CurriculumPageData[]>([]);
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  const [navbarSettings, setNavbarSettings] = useState<{ 
    buttonText: string; 
    buttonLink: string;
    navigationOrder?: Array<{
      itemType: 'curriculum' | 'subjectDropdown' | 'button';
      displayOrder: number;
    }>;
    navigationButtons?: Array<{
      buttonType: 'curriculum' | 'subjectDropdown';
      displayText: string;
      curriculumSlug?: string;
      displayOrder: number;
      isActive: boolean;
    }>;
  } | null>(null);
  const subjectsDropdownRef = useRef<HTMLDivElement>(null);
  const subjectsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add global style when component mounts
  useEffect(() => {
    // Create a style element
    const style = document.createElement('style');
    // Add CSS rule that hides mobile menu button on desktop
    style.innerHTML = `
      @media (min-width: 768px) {
        .${MOBILE_ONLY_CLASS} {
          display: none !important;
        }
      }
    `;
    // Append the style to the head
    document.head.appendChild(style);

    // Cleanup function to remove the style when component unmounts
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
    // Add a slight delay before closing the dropdown
    subjectsTimeoutRef.current = setTimeout(() => {
      setShowSubjectsDropdown(false);
    }, 300); // 300ms delay
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
        // Sort by displayOrder to maintain proper order
        const sortedCurriculums = curriculumPages.sort((a, b) => a.displayOrder - b.displayOrder);
        setCurriculums(sortedCurriculums);
      } catch (error) {
        console.error('Error fetching curriculum pages:', error);
      }
    };

    const fetchNavbarSettings = async () => {
      try {
        const settings = await getNavbarSettings();
        setNavbarSettings(settings);
      } catch (error) {
        console.error('Error fetching navbar settings:', error);
      }
    };

    fetchSubjects();
    fetchCurriculums();
    fetchNavbarSettings();

    // Browser-only debugging
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        console.log('Debug curriculums state:', curriculums);
      }, 2000);
    }

    // Clean up timeouts on unmount
    return () => {
      if (subjectsTimeoutRef.current) {
        clearTimeout(subjectsTimeoutRef.current);
      }
    };
  }, []);

  // Check if a link is external (starts with http or https)
  const isExternalLink = (url: string) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex justify-between h-17 md:h-[68px]">
          <div className="flex items-center -ml-8 pl-0">
            <Link href="/" className="flex-shrink-0 pl-0">
              <div className="relative w-[255px] h-[68px] md:w-[255px] md:h-[68px]">
                <Image src="/images/logo.png" alt="TutorChase Logo" fill className="object-contain object-left" priority />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {/* Render customized navigation buttons if available */}
            {navbarSettings?.navigationButtons && navbarSettings.navigationButtons.length > 0 ? (
              // Sort by displayOrder and filter by isActive
              [...navbarSettings.navigationButtons]
                .filter(button => button.isActive)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((button, index) => {
                  if (button.buttonType === 'curriculum') {
                    // Find matching curriculum using slug if provided, otherwise match by name
                    const curriculumSlug = button.curriculumSlug;
                    const matchingCurriculum = curriculumSlug 
                      ? curriculums.find(c => c.slug.current === curriculumSlug)
                      : curriculums.find(c => c.curriculum.toLowerCase() === button.displayText.toLowerCase());
                    
                    if (matchingCurriculum) {
                      return (
                        <Link
                          key={`custom-nav-${index}`}
                          href={`/curriculum/${matchingCurriculum.slug.current}`}
                          className="text-gray-700 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-gray-50"
                        >
                          {button.displayText}
                        </Link>
                      );
                    } else {
                      // If no matching curriculum found, still display the button with default link
                      return (
                        <Link
                          key={`custom-nav-${index}`}
                          href={curriculumSlug ? `/curriculum/${curriculumSlug}` : "#"}
                          className="text-gray-700 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-gray-50"
                        >
                          {button.displayText}
                        </Link>
                      );
                    }
                  } else if (button.buttonType === 'subjectDropdown') {
                    // Render subjects dropdown with custom text
                    return (
                      <div 
                        key={`custom-nav-${index}`}
                        className="relative"
                        ref={subjectsDropdownRef}
                        onMouseEnter={handleSubjectsMouseEnter}
                        onMouseLeave={handleSubjectsMouseLeave}
                      >
                        <button 
                          className={`text-gray-700 hover:text-blue-800 flex items-center px-3 py-1.5 rounded-md ${showSubjectsDropdown ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                        >
                          {button.displayText}
                          <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${showSubjectsDropdown ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {showSubjectsDropdown && (
                          <div 
                            className="absolute left-0 mt-0 pt-1 w-56 z-50" 
                            onMouseEnter={handleSubjectsMouseEnter}
                            onMouseLeave={handleSubjectsMouseLeave}
                          >
                            <div className="py-2 bg-white border border-gray-200 rounded-md shadow-lg">
                              {subjects.map((subject) => (
                                <Link
                                  key={subject.slug.current}
                                  href={`/${subject.slug.current}`}
                                  className="block px-4 py-1.5 text-gray-700 hover:bg-blue-50 hover:text-blue-800 text-sm"
                                >
                                  {subject.subject}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return null;
                })
            ) : (
              // Default rendering when no custom buttons defined
              <>
                {/* Curriculum Pages - Direct Links */}
                {curriculums.map((curriculum) => {
                  return (
                    <Link
                      key={curriculum.slug.current}
                      href={`/curriculum/${curriculum.slug.current}`}
                      className="text-gray-700 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-gray-50"
                    >
                      {curriculum.curriculum}
                    </Link>
                  );
                })}
              </>
            )}

            {/* Always include the All Subjects dropdown if not added via custom navigation */}
            {(!navbarSettings?.navigationButtons || !navbarSettings.navigationButtons.some(btn => btn.buttonType === 'subjectDropdown')) && (
              <div 
                className="relative"
                ref={subjectsDropdownRef}
                onMouseEnter={handleSubjectsMouseEnter}
                onMouseLeave={handleSubjectsMouseLeave}
              >
                <button 
                  className={`text-gray-700 hover:text-blue-800 flex items-center px-3 py-1.5 rounded-md ${showSubjectsDropdown ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                >
                  All Subjects
                  <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${showSubjectsDropdown ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showSubjectsDropdown && (
                  <div 
                    className="absolute left-0 mt-0 pt-1 w-56 z-50" 
                    onMouseEnter={handleSubjectsMouseEnter}
                    onMouseLeave={handleSubjectsMouseLeave}
                  >
                    <div className="py-2 bg-white border border-gray-200 rounded-md shadow-lg">
                      {subjects.map((subject) => (
                        <Link
                          key={subject.slug.current}
                          href={`/${subject.slug.current}`}
                          className="block px-4 py-1.5 text-gray-700 hover:bg-blue-50 hover:text-blue-800 text-sm"
                        >
                          {subject.subject}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Always add the CTA button if it's not included in the navigation */}
            {navbarSettings?.buttonText && navbarSettings?.buttonLink && (
              isExternalLink(navbarSettings.buttonLink) ? (
                <ExternalLink 
                  href={navbarSettings.buttonLink} 
                  className="bg-blue-800 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  rel="nofollow"
                >
                  {navbarSettings.buttonText}
                </ExternalLink>
              ) : (
                <Link 
                  href={navbarSettings.buttonLink} 
                  className="bg-blue-800 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {navbarSettings.buttonText}
                </Link>
              )
            )}
            {!navbarSettings && (
              <Link href="#" className="bg-blue-800 text-white px-5 py-2 rounded-md opacity-50 cursor-not-allowed text-sm font-medium">
                Loading...
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className={`md:hidden flex items-center ${MOBILE_ONLY_CLASS}`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-800"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-1 pb-2 space-y-1 sm:px-3">
            {/* Mobile Navigation based on custom buttons if available */}
            {navbarSettings?.navigationButtons && navbarSettings.navigationButtons.length > 0 ? (
              // Filter active buttons and sort by displayOrder
              [...navbarSettings.navigationButtons]
                .filter(button => button.isActive)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((button, index) => {
                  if (button.buttonType === 'curriculum') {
                    // Find matching curriculum using slug if provided, otherwise match by name
                    const curriculumSlug = button.curriculumSlug;
                    const matchingCurriculum = curriculumSlug 
                      ? curriculums.find(c => c.slug.current === curriculumSlug)
                      : curriculums.find(c => c.curriculum.toLowerCase() === button.displayText.toLowerCase());
                    
                    if (matchingCurriculum) {
                      return (
                        <Link
                          key={`mobile-custom-nav-${index}`}
                          href={`/curriculum/${matchingCurriculum.slug.current}`}
                          className="block px-3 py-2 text-gray-600 hover:text-blue-800 text-sm"
                        >
                          {button.displayText}
                        </Link>
                      );
                    } else {
                      // If no matching curriculum found, still display the button with default link
                      return (
                        <Link
                          key={`mobile-custom-nav-${index}`}
                          href={curriculumSlug ? `/curriculum/${curriculumSlug}` : "#"}
                          className="block px-3 py-2 text-gray-600 hover:text-blue-800 text-sm"
                        >
                          {button.displayText}
                        </Link>
                      );
                    }
                  } else if (button.buttonType === 'subjectDropdown') {
                    // Render subjects section with custom header
                    return (
                      <div key={`mobile-custom-nav-${index}`} className="px-3 py-1.5">
                        <div className="font-medium text-gray-700 mb-1.5 text-sm">{button.displayText}</div>
                        {subjects.map((subject) => (
                          <Link
                            key={subject.slug.current}
                            href={`/${subject.slug.current}`}
                            className="block pl-3 py-1.5 text-gray-600 hover:text-blue-800 text-sm"
                          >
                            {subject.subject}
                          </Link>
                        ))}
                      </div>
                    );
                  }
                  
                  return null;
                })
            ) : (
              // Default rendering when no custom buttons defined
              <>
                {/* Mobile Curriculum Links */}
                <div className="px-3 py-1.5">
                  <div className="font-medium text-gray-700 mb-1.5 text-sm">Curricula</div>
                  {curriculums.map((curriculum) => (
                    <Link
                      key={curriculum.slug.current}
                      href={`/curriculum/${curriculum.slug.current}`}
                      className="block pl-3 py-1.5 text-gray-600 hover:text-blue-800 text-sm"
                    >
                      {curriculum.curriculum}
                    </Link>
                  ))}
                </div>
              </>
            )}
            
            {/* Always include the All Subjects section if not added via custom navigation */}
            {(!navbarSettings?.navigationButtons || !navbarSettings.navigationButtons.some(btn => btn.buttonType === 'subjectDropdown')) && (
              <div className="px-3 py-1.5">
                <div className="font-medium text-gray-700 mb-1.5 text-sm">All Subjects</div>
                {subjects.map((subject) => (
                  <Link
                    key={subject.slug.current}
                    href={`/${subject.slug.current}`}
                    className="block pl-3 py-1.5 text-gray-600 hover:text-blue-800 text-sm"
                  >
                    {subject.subject}
                  </Link>
                ))}
              </div>
            )}

            {/* Always include the CTA button */}
            {navbarSettings?.buttonText && navbarSettings?.buttonLink && (
              isExternalLink(navbarSettings.buttonLink) ? (
                <ExternalLink 
                  href={navbarSettings.buttonLink}
                  className="block px-3 py-2 text-blue-800 text-sm font-medium"
                  rel="nofollow"
                >
                  {navbarSettings.buttonText}
                </ExternalLink>
              ) : (
                <Link 
                  href={navbarSettings.buttonLink} 
                  className="block px-3 py-2 text-blue-800 text-sm font-medium"
                >
                  {navbarSettings.buttonText}
                </Link>
              )
            )}
            {!navbarSettings && (
              <span className="block px-3 py-2 text-blue-800 opacity-50 cursor-not-allowed text-sm font-medium">Loading...</span>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 