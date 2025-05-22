import React from 'react';
import Link from 'next/link';
import { getSubjectGridData } from '../lib/getSubjectGridData';

const SubjectGrid = async () => {
  const subjects = await getSubjectGridData();
  
  // If there are no subjects, return a fallback UI
  if (!subjects || subjects.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">No subjects available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">Popular Subjects</h2>
        <p className="text-gray-600 mb-8">
          Our specialist tutors cover every subject, ensuring comprehensive support
          for your entire education journey.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <Link
              key={subject._id}
              href={`/${subject.slug.current}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <h3 className="text-lg font-semibold text-blue-800 group-hover:text-blue-900">
                {subject.subject}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectGrid; 