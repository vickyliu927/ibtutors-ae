'use client';
import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';

interface TutorData {
  _id: string;
  name: string;
  professionalTitle: string;
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
}

const TutorProfiles = () => {
  const [tutors, setTutors] = useState<TutorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        console.log('Starting to fetch tutors...');
        const data = await client.fetch<TutorData[]>(`*[_type == "tutor"] {
          _id,
          name,
          professionalTitle,
          education,
          experience,
          profilePhoto,
          specialization,
          yearsOfExperience,
          hireButtonLink
        }`);
        console.log('Raw tutor data:', JSON.stringify(data, null, 2));
        setTutors(data);
      } catch (err) {
        console.error('Error fetching tutors:', err);
        setError('Failed to load tutors');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Our Qualified IB Teachers and Examiners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((placeholder) => (
              <div key={placeholder} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-gray-200 h-48"></div>
                  <div className="md:w-2/3 p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Our Qualified IB Teachers and Examiners</h2>
        <p className="text-gray-600 mb-12">
          We have a team of expert tutors available at different prices to suit every student. 
          Contact us with your requirements and budget and we'll find the perfect tutor for you!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tutors.map((tutor) => (
            <div key={tutor._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative h-48">
                  {tutor.profilePhoto ? (
                    <Image
                      src={urlFor(tutor.profilePhoto).url()}
                      alt={`${tutor.name}'s profile photo`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold">{tutor.name}</h3>
                    <span className="text-blue-800 font-medium">{tutor.professionalTitle}</span>
                  </div>
                  <div className="mb-4">
                    <p className="text-orange-500 font-medium">{tutor.specialization.mainSubject}</p>
                    <p className="text-gray-600">{tutor.education.university} | {tutor.education.degree}</p>
                  </div>
                  <p className="text-gray-600 mb-6">{tutor.experience}</p>
                  <Link 
                    href={tutor.hireButtonLink || '#contact'}
                    className="inline-block bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900 transition-colors"
                  >
                    Hire a Tutor
                  </Link>
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