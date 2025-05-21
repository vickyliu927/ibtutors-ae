'use client';

import Image from 'next/image';
import React from 'react';
import { urlFor } from '@/sanity/lib/image';

interface TutorCardProps {
  tutor: {
    name: string;
    photo?: any;
    qualifications?: string[];
    hourlyRate?: number;
    specialSubjects?: string[];
    profileSnippet?: string;
  };
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      {/* Tutor Image */}
      <div className="h-64 relative">
        {tutor.photo ? (
          <Image
            src={urlFor(tutor.photo).url()}
            alt={`${tutor.name} - Dubai Tutor`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      
      {/* Tutor Info */}
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2">{tutor.name}</h3>
        
        {/* Qualifications */}
        {tutor.qualifications && tutor.qualifications.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 font-medium">Qualifications:</p>
            <p className="text-sm">{tutor.qualifications.join(', ')}</p>
          </div>
        )}
        
        {/* Rate */}
        {tutor.hourlyRate && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 font-medium">Rate:</p>
            <p className="text-blue-800 font-medium">AED {tutor.hourlyRate}/hour</p>
          </div>
        )}
        
        {/* Subjects */}
        {tutor.specialSubjects && tutor.specialSubjects.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 font-medium mb-1">Subjects:</p>
            <div className="flex flex-wrap gap-1">
              {tutor.specialSubjects.slice(0, 3).map((subject, index) => (
                <span 
                  key={index}
                  className="text-blue-800 bg-blue-50 text-xs px-2 py-1 rounded-md"
                >
                  {subject}
                </span>
              ))}
              {tutor.specialSubjects.length > 3 && (
                <span className="text-gray-500 text-xs">+{tutor.specialSubjects.length - 3} more</span>
              )}
            </div>
          </div>
        )}
        
        {/* Profile Snippet */}
        {tutor.profileSnippet && (
          <p className="text-sm text-gray-600 line-clamp-3">{tutor.profileSnippet}</p>
        )}
      </div>
      
      {/* Button */}
      <div className="px-6 pb-6">
        <button className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
          Contact Tutor
        </button>
      </div>
    </div>
  );
};

export default TutorCard; 