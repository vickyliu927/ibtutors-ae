'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSubjectPages, type SubjectPageData } from './NavSubjects';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subjects, setSubjects] = useState<SubjectPageData[]>([]);
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    fetchSubjects();

    // Clean up timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image src="/images/logo.png" alt="TutorChase Logo" width={300} height={80} priority />
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

            <Link href="https://www.tutorchase.com/tutors" className="bg-blue-800 text-white px-4 py-2 rounded-md">
              View all Tutors on TutorChase
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-800"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Mobile Subjects List */}
            <div className="px-3 py-2">
              <div className="font-medium text-gray-700 mb-2">All Subjects</div>
              {subjects.map((subject) => (
                <Link
                  key={subject.slug.current}
                  href={`/${subject.slug.current}`}
                  className="block pl-3 py-2 text-gray-600 hover:text-blue-800"
                >
                  {subject.subject}
                </Link>
              ))}
            </div>

            <Link href="https://www.tutorchase.com/tutors" className="block px-3 py-2 text-blue-800">
              View all Tutors on TutorChase
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 