'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
// Remove these imports as we'll pass data as props
// import { getSubjectPages, type SubjectPageData } from './NavSubjects';
// import { getCurriculumPages, type CurriculumPageData } from './NavCurriculums';

// Import types but rename to avoid conflicts
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
}

interface NavbarProps {
  navbarData?: any;
  subjects?: SubjectPageData[];  // Add subjects as prop
  curriculums?: CurriculumPageData[];  // Add curriculums as prop
  currentDomain?: string;  // Add domain context for link generation
}

const Navbar = ({ navbarData, subjects = [], curriculums = [], currentDomain }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  const [showLevelsDropdown, setShowLevelsDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Remove state for subjects and curriculums as they come from props
  // const [subjects, setSubjects] = useState<SubjectPageData[]>([]);
  // const [curriculums, setCurriculums] = useState<CurriculumPageData[]>([]);

  const subjectsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const levelsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to generate proper domain-aware links
  const generateSubjectLink = (slug: string) => {
    if (currentDomain && currentDomain.includes('onlinetutors.qa')) {
      return `https://onlinetutors.qa/${slug}`;
    } else if (currentDomain && currentDomain.includes('dubaitutors.ae')) {
      return `https://dubaitutors.ae/${slug}`;
    }
    // Default to relative link if domain not recognized
    return `/${slug}`;
  };

  // Client-side domain detection function (simplified for link generation only)
  const getCloneIdFromDomain = (): string | null => {
    if (typeof window === 'undefined') return null;
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.includes('onlinetutors.qa')) {
      return 'qatar-tutors';
    } else if (hostname.includes('adtutors.ae')) {
      return 'abu-dhabi';
    } else if (hostname.includes('riyadhtutors.sa')) {
      return 'riyadh-tutors';
    }
    return null; // Default/Dubai
  };

  const handleSubjectsMouseEnter = () => {
    if (subjectsTimeoutRef.current) {
      clearTimeout(subjectsTimeoutRef.current);
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
    }
    setShowLevelsDropdown(true);
  };

  const handleLevelsMouseLeave = () => {
    levelsTimeoutRef.current = setTimeout(() => {
      setShowLevelsDropdown(false);
    }, 300);
  };

  // Remove useEffect completely as data comes from props
  // useEffect(() => { ... });

  // Rest of the component remains the same...
  const logoSrc = navbarData?.logo?.asset?.url || '/images/logo.png';
  const logoAlt = navbarData?.logoAlt || 'Logo';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={120}
                height={40}
                className="h-8 md:h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* All Subjects Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={handleSubjectsMouseEnter}
              onMouseLeave={handleSubjectsMouseLeave}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                <span>All Subjects</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showSubjectsDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showSubjectsDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  {subjects.map((subject) => (
                    <Link
                      key={subject.slug.current}
                      href={generateSubjectLink(subject.slug.current)}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                    >
                      {subject.subject || subject.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* All Levels Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={handleLevelsMouseEnter}
              onMouseLeave={handleLevelsMouseLeave}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                <span>All Levels</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showLevelsDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showLevelsDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  {curriculums.map((curriculum) => (
                    <Link
                      key={curriculum.slug.current}
                      href={generateSubjectLink(curriculum.slug.current)}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                    >
                      {curriculum.curriculum || curriculum.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Link */}
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Contact
            </Link>

            {/* CTA Button */}
            <Link 
              href="/contact" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Subjects */}
              <div className="py-2">
                <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Subjects</h3>
                {subjects.slice(0, 5).map((subject) => (
                  <Link
                    key={subject.slug.current}
                    href={generateSubjectLink(subject.slug.current)}
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                    onClick={() => setIsOpen(false)}
                  >
                    {subject.subject || subject.title}
                  </Link>
                ))}
              </div>

              {/* Mobile Levels */}
              <div className="py-2">
                <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Levels</h3>
                {curriculums.slice(0, 5).map((curriculum) => (
                  <Link
                    key={curriculum.slug.current}
                    href={generateSubjectLink(curriculum.slug.current)}
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                    onClick={() => setIsOpen(false)}
                  >
                    {curriculum.curriculum || curriculum.title}
                  </Link>
                ))}
              </div>

              {/* Mobile Contact */}
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile CTA */}
              <div className="px-3 py-2">
                <Link
                  href="/contact"
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
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
