'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSubjectPages, type SubjectPageData } from './NavSubjects';
import { client } from '@/sanity/lib/client';

// Create a class name with specific meaning to avoid conflicts
const MOBILE_ONLY_CLASS = 'mobile-menu-button';

async function getNavbarSettings() {
  const query = `*[_type == "navbarSettings"][0]{buttonText, buttonLink}`;
  return client.fetch(query);
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subjects, setSubjects] = useState<SubjectPageData[]>([]);
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  const [navbarSettings, setNavbarSettings] = useState<{ buttonText: string; buttonLink: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowSubjectsDropdown(true);
  };

  const handleMouseLeave = () => {
    // Add a slight delay before closing the dropdown
    timeoutRef.current = setTimeout(() => {
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
    const fetchNavbarSettings = async () => {
      try {
        const settings = await getNavbarSettings();
        setNavbarSettings(settings);
      } catch (error) {
        console.error('Error fetching navbar settings:', error);
      }
    };

    fetchSubjects();
    fetchNavbarSettings();

    // Clean up timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-17 md:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="relative w-[255px] h-[68px] md:w-[300px] md:h-[80px]">
                <Image src="/images/logo.png" alt="TutorChase Logo" fill className="object-contain" priority />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Subjects Dropdown */}
            <div 
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`text-gray-700 hover:text-blue-800 flex items-center px-4 py-2 rounded-md ${showSubjectsDropdown ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
              >
                All Subjects
                <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${showSubjectsDropdown ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showSubjectsDropdown && (
                <div 
                  className="absolute left-0 mt-0 pt-1 w-56 z-50" 
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="py-2 bg-white border border-gray-200 rounded-md shadow-lg">
                    {subjects.map((subject) => (
                      <Link
                        key={subject.slug.current}
                        href={`/${subject.slug.current}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                      >
                        {subject.subject}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navbarSettings && navbarSettings.buttonText && navbarSettings.buttonLink && (
              <Link href={navbarSettings.buttonLink} className="bg-blue-800 text-white px-4 py-2 rounded-md">
                {navbarSettings.buttonText}
              </Link>
            )}
            {!navbarSettings && (
              <Link href="#" className="bg-blue-800 text-white px-4 py-2 rounded-md opacity-50 cursor-not-allowed">
                Loading...
            </Link>
            )}
          </div>

          {/* Mobile menu button with both Tailwind classes and custom class */}
          <div className={`flex items-center md:hidden ${MOBILE_ONLY_CLASS}`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 hover:text-blue-800"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-1 pb-2 space-y-1 sm:px-3">
            {/* Mobile Subjects List */}
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

            {navbarSettings && navbarSettings.buttonText && navbarSettings.buttonLink && (
              <Link href={navbarSettings.buttonLink} className="block px-3 py-1.5 text-blue-800 text-sm">
                {navbarSettings.buttonText}
            </Link>
            )}
            {!navbarSettings && (
              <span className="block px-3 py-1.5 text-blue-800 opacity-50 cursor-not-allowed text-sm">Loading...</span>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 