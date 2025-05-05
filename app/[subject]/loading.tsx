import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Loading() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen">
        {/* First Section Skeleton */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-12 w-2/3 bg-gray-200 rounded animate-pulse mb-8"></div>
            <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </section>

        {/* Tutors Section Skeleton */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                  <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse mx-auto mb-3"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section Skeleton */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-lg">
                  <div className="h-24 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
} 