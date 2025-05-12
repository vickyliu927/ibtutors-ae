'use client';
import React, { useState } from 'react';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';

export interface TutorData {
  _id: string;
  name: string;
  professionalTitle: string;
  personallyInterviewed?: boolean;
  education?: {
    university?: string;
    degree?: string;
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
        
        <div className="space-y-6">
          {tutors.map((tutor) => (
            <div key={tutor._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              {/* Mobile view (stacked) */}
              <div className="md:hidden">
                <div className="flex">
                  {/* Profile Image - Square format */}
                  <div className="w-32 h-32 relative flex-shrink-0">
                    {tutor.profilePhoto ? (
                      <Image
                        src={urlFor(tutor.profilePhoto).url()}
                        alt={`${tutor.name}`}
                        fill
                        className="object-cover"
                        sizes="128px"
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
                  <div className="flex-1 p-4">
                    <h3 className="text-2xl font-bold">{tutor.name}</h3>
                    
                    {/* Professional Title with diamond icon */}
                    <div className="flex items-center mt-2">
                      <svg className="w-5 h-5 text-orange-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L4 10L12 22L20 10L12 2Z" />
                      </svg>
                      <p className="text-black font-medium">📚 {tutor.professionalTitle}</p>
                    </div>
                    
                    {/* Education with graduation cap icon */}
                    <div className="flex items-start mt-2">
                      <svg className="w-5 h-5 text-black mr-2 mt-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                      </svg>
                      <p className="text-black font-medium">
                        {tutor.education && (tutor.education.university || tutor.education.degree) && (
                          <>
                            {tutor.education.university && tutor.education.university}
                            {tutor.education.university && tutor.education.degree && ' | '}
                            {tutor.education.degree && tutor.education.degree}
                          </>
                        )}
                      </p>
                    </div>
                    
                    {/* Teaching subjects */}
                    <div className="flex items-start mt-2">
                      <svg className="w-5 h-5 text-blue-800 mr-2 mt-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
                      </svg>
                      <p className="text-black font-medium">
                        {tutor.specialization.mainSubject}
                        {tutor.specialization.additionalSubjects && tutor.specialization.additionalSubjects.length > 0 && 
                          ` + ${tutor.specialization.additionalSubjects.length} more`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio - Full width below image and info */}
                <div className="p-4 pt-0">
                  <p className="text-black">
                    {tutor.experience}
                  </p>
                </div>

                {/* Button */}
                <div className="p-4 pt-0">
                  <Link
                    href={tutor.hireButtonLink || "/#contact-form"}
                    className="bg-blue-800 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-all font-medium text-center block w-full md:w-auto md:inline-block"
                  >
                    Hire a Tutor
                  </Link>
                  {tutor.profilePDF?.asset?.url && (
                    <a
                      href={tutor.profilePDF.asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 text-gray-800 px-4 py-3 rounded-md hover:bg-gray-300 transition-all font-medium text-center block w-full mt-2 md:mt-0 md:ml-2 md:w-auto md:inline-block"
                    >
                      View Profile
                    </a>
                  )}
                </div>
              </div>

              {/* Desktop view (side by side) */}
              <div className="hidden md:flex">
                {/* Left side - Profile Image */}
                <div className="w-64 h-64 relative flex-shrink-0">
                  {tutor.profilePhoto ? (
                    <Image
                      src={urlFor(tutor.profilePhoto).url()}
                      alt={`${tutor.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 256px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Right side - Tutor Information */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{tutor.name}</h3>
                        {tutor.personallyInterviewed && (
                        <span className="flex items-center text-orange-500">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Personally Interviewed
                        </span>
                        )}
                      </div>
                      <p className="text-gray-700 font-medium mb-2">📚 {tutor.professionalTitle}</p>
                      {tutor.education && (tutor.education.university || tutor.education.degree) && (
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-blue-800 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                          </svg>
                          <p className="text-gray-700 font-medium">
                            {tutor.education.university && tutor.education.university}
                            {tutor.education.university && tutor.education.degree && ' | '}
                            {tutor.education.degree && tutor.education.degree}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-start gap-1">
                        <p className="font-medium text-gray-600 mt-1">Teaches:</p>
                        <div className="flex flex-wrap gap-2 max-w-md">
                          {/* Main subject always shown */}
                          <span className="text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md">
                            {tutor.specialization.mainSubject}
                          </span>
                          
                          {/* Additional subjects with "Show more" functionality */}
                          {tutor.specialization.additionalSubjects && 
                            (expandedSubjects[tutor._id] 
                              ? tutor.specialization.additionalSubjects.map((subject, index) => (
                                  <span 
                                    key={index} 
                                    className="text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md"
                                  >
                                    {subject}
                                  </span>
                                ))
                              : tutor.specialization.additionalSubjects.slice(0, MAX_VISIBLE_SUBJECTS).map((subject, index) => (
                                  <span 
                                    key={index} 
                                    className="text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md"
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
                      {tutor.price && (
                        <div className="mt-2 text-right">
                          <div className="flex justify-end items-center gap-1">
                            <p className="font-medium text-gray-600 whitespace-nowrap">Rate:</p>
                          <p className="text-blue-800 font-medium">
                              {tutor.price.displayText || `Starting from ${tutor.price.currency} ${tutor.price.amount}/hour`}
                          </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{tutor.experience}</p>

                  <div>
                    <div className="flex gap-3">
                      <Link
                        href={tutor.hireButtonLink || "/#contact-form"}
                        className="bg-blue-800 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-all font-medium"
                      >
                        Hire a tutor
                      </Link>
                      {tutor.profilePDF?.asset?.url && (
                        <a
                          href={tutor.profilePDF.asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-200 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-300 transition-all font-medium"
                        >
                          View Profile
                        </a>
                      )}
                    </div>
                  </div>
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