'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-800">TutorChase</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/tutors" className="text-gray-700 hover:text-blue-800">
              IB Tutors
            </Link>
            <Link href="/maths" className="text-gray-700 hover:text-blue-800">
              IB Maths Tutors
            </Link>
            <Link href="/english" className="text-gray-700 hover:text-blue-800">
              IB English Tutors
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-800">
                More IB Subjects
              </button>
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
            <Link href="/tutors" className="block px-3 py-2 text-gray-700 hover:text-blue-800">
              IB Tutors
            </Link>
            <Link href="/maths" className="block px-3 py-2 text-gray-700 hover:text-blue-800">
              IB Maths Tutors
            </Link>
            <Link href="/english" className="block px-3 py-2 text-gray-700 hover:text-blue-800">
              IB English Tutors
            </Link>
            <Link href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-800">
              More IB Subjects
            </Link>
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