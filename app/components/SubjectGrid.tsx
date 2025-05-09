'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { initSlugCache } from '../services/slugManager';

interface SubjectPageData {
  _id: string;
  title: string;
  subject: string;
  slug: {
    current: string;
  };
  firstSection: {
    title: string;
    highlightedWords?: string[];
    description: string;
  };
}

// Initial cache load
initSlugCache().catch(console.error);

const SubjectGrid = () => {
  const [subjects, setSubjects] = useState<SubjectPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await client.fetch<SubjectPageData[]>(`*[_type == "subjectPage"] | order(title asc) {
          _id,
          title,
          subject,
          slug,
          firstSection
        }`);
        setSubjects(data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Popular Subjects</h2>
          <p className="text-gray-600 mb-8">
            Our specialist tutors cover every subject, ensuring comprehensive support
            for your entire education journey.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((placeholder) => (
              <div
                key={placeholder}
                className="bg-white p-4 rounded-lg shadow-sm animate-pulse h-14"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">{error}</p>
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