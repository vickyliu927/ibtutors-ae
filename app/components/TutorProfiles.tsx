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
                <div className="flex">
                  <div className="w-64 h-64 bg-gray-200"></div>
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
              <div className="flex">
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