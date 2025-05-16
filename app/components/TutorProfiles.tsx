'use client';
import React, { useState, useRef, useEffect } from 'react';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';

export interface TutorData {
  _id: string;
  name: string;
  professionalTitle: string;
  personallyInterviewed?: {
    enabled: boolean;
    badgeText: string;
  };
  experience: string;
  profilePhoto: any;
  specialization: {
    mainSubject: string;
    additionalSubjects?: string[];
  };
  yearsOfExperience?: number;
  hireButtonLink: string;
  displayOrder?: number;
  profilePDF?: {
    asset: {
      url: string;
    }
  };
  price?: {
    amount: number;
    currency: string;
    displayText?: string;
  };
  rating?: number;
  reviewCount?: number;
  activeStudents?: number;
  totalLessons?: number;
  languagesSpoken?: {
    language: string;
    proficiency: string;
  }[];
}

interface TutorProfilesProps {
  tutors?: TutorData[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

// Maximum number of additional subjects to display before showing a "+X more" button
const MAX_VISIBLE_SUBJECTS = 3;

const TutorProfiles = ({ 
  tutors, 
  sectionTitle = "", 
  sectionSubtitle,
  ctaText, 
  ctaLink 
}: TutorProfilesProps) => {
  // State to track which tutors have expanded subject lists
  const [expandedSubjects, setExpandedSubjects] = useState<{[key: string]: boolean}>({});

  // Toggle expanded state for a specific tutor
  const toggleExpandSubjects = (tutorId: string) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [tutorId]: !prev[tutorId]
    }));
  };

  if (!tutors) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionTitle && (
          <h2 className="text-3xl font-bold mb-8">{sectionTitle}</h2>
          )}
          {sectionSubtitle && (
            <p className="text-gray-600 text-lg mb-8">{sectionSubtitle}</p>
          )}
          <div className="space-y-6">
            {[1, 2].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-64 bg-gray-200"></div>
                  <div className="flex-1 p-6">
                    <div className="h-8 bg-gray-200 w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 w-2/3 mb-4"></div>
                    <div className="h-20 bg-gray-200 w-full mb-4"></div>
                    <div className="h-8 bg-gray-200 w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sectionTitle && (
        <h2 className="text-3xl font-bold mb-8">{sectionTitle}</h2>
        )}
        
        {sectionSubtitle && (
          <p className="text-gray-600 text-lg mb-6">{sectionSubtitle}</p>
        )}
        
        {ctaText && ctaLink && (
          <p className="text-orange-500 hover:text-orange-600 mb-8">
            <a 
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
            >
              {ctaText}
            </a>
          </p>
        )}
        
        <div className="space-y-4">
          {tutors.map((tutor) => (
            <div key={tutor._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col" style={{ clipPath: 'inset(0)' }}>
              {/* Mobile view (stacked) */}
              <div className="md:hidden overflow-hidden">
              <div className="flex">
                  {/* Profile Image - Square format */}
                  <div
                    className="relative flex-shrink-0 w-[130px] h-[130px] overflow-hidden z-10"
                    style={{ width: '40%' }}
                    ref={el => {
                      if (el) {
                        const setSquare = () => {
                          el.style.height = `${el.offsetWidth}px`;
                        };
                        setSquare();
                        window.addEventListener('resize', setSquare);
                        // Clean up
                        return () => window.removeEventListener('resize', setSquare);
                      }
                    }}
                  >
                    {tutor.profilePhoto ? (
                      <Image
                        src={urlFor(tutor.profilePhoto).width(260).height(260).url()}
                        alt={`${tutor.name}`}
                        fill
                        className="object-cover object-center"
                        sizes="128px"
                        priority={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Tutor Basic Info - Right of image */}
                  <div className="flex-1 p-4 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{tutor.name}</h3>
                      {tutor.personallyInterviewed?.enabled && (
                        <span className="flex items-center text-orange-500 text-xs">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {tutor.personallyInterviewed.badgeText}
                        </span>
                      )}
                    </div>
                    
                    {/* Professional Title & Education with graduation hat icon */}
                    <div className="flex items-center mt-2 mb-2">
                      <span className="flex-shrink-0 w-5 h-5 min-w-[20px] min-h-[20px] mr-2">
                        <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                        </svg>
                      </span>
                      <p className="text-black font-medium">{tutor.professionalTitle}</p>
                    </div>
                    
                    {/* Add teaches/subjects section for mobile */}
                    <div className="flex flex-nowrap items-start gap-1 mb-1 overflow-hidden">
                      <p className="font-medium text-gray-600 mr-1 whitespace-nowrap flex-shrink-0 mt-0.5">Teaches:</p>
                      <div className="flex flex-wrap gap-1 overflow-hidden">
                        <span className={`text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded-md text-sm inline-flex ${
                          ['IGCSE Business Studies', 'GCSE Computer Science', 'AP US History & World History', 
                           'IB Business Management', 'A Level Further Maths', 'A Level Computer Science', 
                           'A Level English Literature', 'A Level Business Studies', 'IGCSE Computer Science',
                           'GCSE Business Studies', 'AP Calculus AB BC', 'AP Macroeconomics Microeconomics',
                           'AP Computer Science', 'AP English Language', 'AP English Literature', 'AP Human Geography'
                          ].includes(tutor.specialization.mainSubject) ? '' : 'whitespace-nowrap'
                        }`}>
                          {tutor.specialization.mainSubject}
                        </span>
                        {tutor.specialization.additionalSubjects && 
                          tutor.specialization.additionalSubjects.slice(0, 1).map((subject, index) => (
                            <span 
                              key={index} 
                              className={`text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded-md text-sm ${
                                ['IGCSE Business Studies', 'GCSE Computer Science', 'AP US History & World History', 
                                 'IB Business Management', 'A Level Further Maths', 'A Level Computer Science', 
                                 'A Level English Literature', 'A Level Business Studies', 'IGCSE Computer Science',
                                 'GCSE Business Studies', 'AP Calculus AB BC', 'AP Macroeconomics Microeconomics',
                                 'AP Computer Science', 'AP English Language', 'AP English Literature', 'AP Human Geography'
                                ].includes(subject) ? '' : 'whitespace-nowrap'
                              }`}
                            >
                              {subject}
                            </span>
                          ))
                        }
                        {tutor.specialization.additionalSubjects && tutor.specialization.additionalSubjects.length > 1 && (
                          <span className="text-blue-600 font-medium text-sm whitespace-nowrap">
                            +{tutor.specialization.additionalSubjects.length} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Rate info for mobile */}
                    {tutor.price && (
                      <div className="flex items-center mt-0">
                        <p className="font-medium text-gray-600 whitespace-nowrap mr-1">Rate:</p>
                        <p className="text-blue-800 font-medium text-sm">
                          {tutor.price.displayText || `Starting from ${tutor.price.currency} ${tutor.price.amount}/hour`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio - Full width below image and info */}
                <div className="px-2 pt-0 pb-0 mt-1 border-t border-gray-200">
                  <p className="text-black text-sm mb-0 mt-0 pt-1 pb-0 text-justify">{tutor.experience}</p>
                </div>
                
                {/* Hire button for mobile - moved below bio */}
                <div className="mt-3 border-t border-gray-200">
                  <Link
                    href={tutor.hireButtonLink || "/#contact-form"}
                    className="bg-blue-800 text-white py-3 transition-all font-medium text-center block w-full"
                  >
                    Hire a tutor
                  </Link>
                </div>

                {/* View Profile button only */}
                {tutor.profilePDF?.asset?.url && (
                  <div className="p-4 pt-0">
                    <a
                      href={tutor.profilePDF.asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all font-medium text-center block w-full"
                    >
                      View Profile
                    </a>
                  </div>
                )}
              </div>

              {/* Desktop view (side by side) */}
              <div className="hidden md:flex items-stretch overflow-hidden">
                {/* Left side - Profile Image - with negative bottom margin to eliminate gap */}
                <div className="w-[225px] h-[225px] relative flex-shrink-0 overflow-hidden z-10">
                  {tutor.profilePhoto ? (
                    <Image
                      src={urlFor(tutor.profilePhoto).width(450).height(450).url()}
                      alt={`${tutor.name}`}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 225px"
                      priority={true}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Right side - Tutor Information - with negative top margin to close gap */}
                <div className="flex-1 p-5 pt-0 mt-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{tutor.name}</h3>
                        
                        {/* Rate info moved next to name */}
                        {tutor.price && (
                          <div className="flex items-center">
                            <p className="font-medium text-gray-600 whitespace-nowrap mr-1">Rate:</p>
                            <p className="text-blue-800 font-medium">
                              {tutor.price.displayText || `Starting from ${tutor.price.currency} ${tutor.price.amount}/hour`}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Professional Title row with hire button */}
                      <div className="flex justify-between items-center mb-0 pb-0">
                        <div className="flex items-center">
                          <span className="flex-shrink-0 w-5 h-5 min-w-[20px] min-h-[20px] mr-2">
                            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                            </svg>
                          </span>
                          <p className="text-gray-700 font-medium">{tutor.professionalTitle}</p>
                        </div>
                        
                        {/* Hire button moved to align with professional title */}
                        <div className="flex-shrink-0 -mt-4">
                          <Link
                            href={tutor.hireButtonLink || "/#contact-form"}
                            className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all font-medium"
                          >
                            Hire a tutor
                          </Link>
                        </div>
                    </div>

                      {/* Personally interviewed badge moved below, aligned right */}
                      <div className="flex justify-between items-start mb-0 mt-0 pb-0 pt-2">
                        {/* Teaches section moved below professional title */}
                        <div className="flex items-start gap-1">
                          <p className="font-medium text-gray-600 mt-0">Teaches:</p>
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {/* Main subject always shown */}
                            <span className="text-blue-800 font-medium bg-blue-50 px-3 py-0.5 rounded-md">
                            {tutor.specialization.mainSubject}
                          </span>
                            
                            {/* Additional subjects with "Show more" functionality */}
                            {tutor.specialization.additionalSubjects && 
                              (expandedSubjects[tutor._id] 
                                ? tutor.specialization.additionalSubjects.map((subject, index) => (
                                    <span 
                                      key={index} 
                                      className="text-blue-800 font-medium bg-blue-50 px-3 py-0.5 rounded-md"
                                    >
                                      {subject}
                                    </span>
                                  ))
                                : tutor.specialization.additionalSubjects.slice(0, MAX_VISIBLE_SUBJECTS).map((subject, index) => (
                            <span 
                              key={index} 
                              className="text-blue-800 font-medium bg-blue-50 px-3 py-0.5 rounded-md"
                            >
                              {subject}
                            </span>
                                  ))
                              )
                            }
                            
                            {/* Show "more" button if there are more subjects than the maximum visible */}
                            {tutor.specialization.additionalSubjects && tutor.specialization.additionalSubjects.length > MAX_VISIBLE_SUBJECTS && (
                              <button
                                onClick={() => toggleExpandSubjects(tutor._id)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm px-2 py-1 rounded-md border border-blue-200 hover:bg-blue-50 transition-colors"
                              >
                                {expandedSubjects[tutor._id] 
                                  ? 'Show less' 
                                  : `+${tutor.specialization.additionalSubjects.length - MAX_VISIBLE_SUBJECTS} more`
                                }
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {tutor.personallyInterviewed?.enabled && (
                          <span className="flex items-center text-orange-500">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {tutor.personallyInterviewed.badgeText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-0 text-justify mt-0 pt-1 pb-0 px-0">{tutor.experience}</p>

                  {/* View Profile button only */}
                  {tutor.profilePDF?.asset?.url && (
                  <div>
                      <a
                        href={tutor.profilePDF.asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-200 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-300 transition-all font-medium"
                    >
                        View Profile
                      </a>
                  </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TutorProfiles; 