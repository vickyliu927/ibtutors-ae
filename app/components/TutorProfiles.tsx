'use client';
import React from 'react';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';

export interface TutorData {
  _id: string;
  name: string;
  professionalTitle: string;
  personallyInterviewed?: boolean;
  education: {
    university: string;
    degree: string;
  };
  experience: string;
  profilePhoto: any;
  specialization: {
    mainSubject: string;
    additionalSubjects?: string[];
  };
  yearsOfExperience: number;
  hireButtonLink: string;
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
}

const TutorProfiles = ({ tutors, sectionTitle = "Our Qualified IB Teachers and Examiners" }: TutorProfilesProps) => {
  if (!tutors) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">{sectionTitle}</h2>
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
        <h2 className="text-3xl font-bold mb-8">{sectionTitle}</h2>
        <div className="space-y-6">
          {tutors.map((tutor) => (
            <div key={tutor._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              {/* Mobile view (stacked) */}
              <div className="md:hidden p-4">
                <div className="flex items-start gap-4">
                  {/* Profile Image */}
                  <div className="w-24 h-24 relative flex-shrink-0 rounded-md overflow-hidden">
                    {tutor.profilePhoto ? (
                      <Image
                        src={urlFor(tutor.profilePhoto).url()}
                        alt={`${tutor.name}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Tutor Basic Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{tutor.name}</h3>
                      {tutor.personallyInterviewed && (
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="bg-pink-50 text-pink-800 px-3 py-1 text-sm font-medium rounded-full inline-block mb-2">
                      Super Tutor
                    </div>

                    {/* Rating and Price side by side */}
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        {tutor.rating && (
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <span className="font-bold text-xl">{tutor.rating}</span>
                            <span className="text-gray-500 text-sm ml-2">{tutor.reviewCount || 0} reviews</span>
                          </div>
                        )}
                      </div>
                      {tutor.price && (
                        <div className="text-right">
                          <p className="font-bold text-xl">
                            {tutor.price.currency}{tutor.price.amount}
                          </p>
                          <p className="text-sm text-gray-500">50-min lesson</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Specialization */}
                <div className="mt-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="font-medium">{tutor.specialization.mainSubject}</span>
                  </div>
                </div>

                {/* Student count and lessons */}
                {(tutor.activeStudents || tutor.totalLessons) && (
                  <div className="mt-2">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="font-medium">
                        {tutor.activeStudents ? `${tutor.activeStudents} active students` : ''} 
                        {tutor.activeStudents && tutor.totalLessons ? ' • ' : ''}
                        {tutor.totalLessons ? `${tutor.totalLessons.toLocaleString()} lessons` : ''}
                      </span>
                    </div>
                  </div>
                )}

                {/* Languages */}
                {tutor.languagesSpoken && tutor.languagesSpoken.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span className="font-medium">
                        Speaks {tutor.languagesSpoken.map((lang, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && ', '}
                            {lang.language} ({lang.proficiency})
                          </React.Fragment>
                        ))}
                      </span>
                    </div>
                  </div>
                )}

                {/* Bio */}
                <div className="mt-4">
                  <h4 className="font-bold text-lg">{tutor.professionalTitle}</h4>
                  <p className="text-gray-600 mt-1">
                    {tutor.experience?.substring(0, 100)}{tutor.experience?.length > 100 ? '...' : ''}
                  </p>
                  <Link href="#" className="text-black font-bold mt-1 inline-block underline">
                    Read more
                  </Link>
                </div>

                {/* Button */}
                <div className="mt-4">
                  <Link
                    href={tutor.hireButtonLink || '/contact'}
                    className="w-full bg-pink-500 text-white px-4 py-3 rounded-md hover:bg-pink-600 transition-all font-medium text-center block"
                  >
                    Book trial lesson
                  </Link>
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
                      <p className="text-gray-700 font-medium mb-2">{tutor.professionalTitle}</p>
                    </div>

                    <div>
                      <div className="flex items-start gap-1">
                        <p className="font-medium text-gray-600 mt-1">Teaches:</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md">
                            {tutor.specialization.mainSubject}
                          </span>
                          {tutor.specialization.additionalSubjects?.map((subject, index) => (
                            <span 
                              key={index} 
                              className="text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md"
                            >
                              {subject}
                            </span>
                          ))}
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
                    <Link
                      href={tutor.hireButtonLink || '/contact'}
                      className="bg-blue-800 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-all font-medium"
                    >
                      Hire a tutor
                    </Link>
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