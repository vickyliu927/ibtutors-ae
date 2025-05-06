'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSubjectPages, type SubjectPageData } from './NavSubjects';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subjects, setSubjects] = useState<SubjectPageData[]>([]);
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);

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
              className="relative group"
              onMouseEnter={() => setShowSubjectsDropdown(true)}
              onMouseLeave={() => setShowSubjectsDropdown(false)}
            >
              <button className="text-gray-700 hover:text-blue-800 flex items-center">
                All Subjects
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showSubjectsDropdown && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
                  <div className="py-2">
                    {subjects.map((subject) => (
                      <Link
                        key={subject.slug.current}
                        href={`/${subject.slug.current}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                      >
                        {subject.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="https://tutorchase.com" className="bg-blue-800 text-white px-4 py-2 rounded-md">
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
                  {subject.title}
                </Link>
              ))}
            </div>

            <Link href="https://tutorchase.com" className="block px-3 py-2 text-blue-800">
              View all Tutors on TutorChase
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 