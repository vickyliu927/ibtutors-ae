'use client';
import React from 'react';
import Link from 'next/link';
import subjectsData from '../../data/subjects.json';

const SubjectGrid = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">Popular IB Subjects</h2>
        <p className="text-gray-600 mb-8">
          Our specialist tutors cover every IB subject, ensuring comprehensive support
          for your entire IB journey.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjectsData.subjects.map((subject) => (
            <Link
              key={subject.id}
              href={subject.link}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center text-blue-800 hover:text-blue-900"
            >
              {subject.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectGrid; 