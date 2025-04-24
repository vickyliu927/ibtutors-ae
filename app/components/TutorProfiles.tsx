'use client';
import React from 'react';
import tutorsData from '../../data/tutors.json';

const TutorProfiles = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Our Qualified IB Teachers and Examiners</h2>
        <p className="text-gray-600 mb-12">
          We have a team of expert tutors available at different prices to suit every student. 
          Contact us with your requirements and budget and we'll find the perfect tutor for you!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tutorsData.tutors.map((tutor) => (
            <div key={tutor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-4">
                  <div className="text-gray-400 text-center">
                    <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Tutor Photo</span>
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold">{tutor.name}</h3>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-orange-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 01.832.445l1.71 2.908 3.932.569a1 1 0 01.553 1.705l-2.826 2.756.669 3.902a1 1 0 01-1.451 1.054L10 14.029l-3.419 1.37a1 1 0 01-1.451-1.054l.669-3.902-2.826-2.756a1 1 0 01.553-1.705l3.932-.569 1.71-2.908A1 1 0 0110 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600">{tutor.title}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-orange-500 font-medium">{tutor.specialization}</p>
                  </div>
                  <p className="text-gray-600 mb-6">{tutor.description}</p>
                  <button className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900 transition-colors">
                    Hire a Tutor
                  </button>
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