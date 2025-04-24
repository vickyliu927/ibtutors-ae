'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface PlatformBannerData {
  _id: string;
  platformImage: any;
  whiteBoardImage: any;
  documentSharingImage: any;
}

const TutoringPlatformBanner = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gray-600 uppercase tracking-wide mb-3">ONLINE TUTORING PLATFORM</p>
          <h2 className="text-3xl font-bold">Engaging Lessons with our Online Platform</h2>
        </div>

        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <div className="relative">
              {/* Decorative dots */}
              <div className="absolute -top-4 -left-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
              </div>
              
              {/* Platform interface mockups */}
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg h-32"></div>
                <div className="bg-blue-50 rounded-lg h-32"></div>
              </div>

              {/* Control icons */}
              <div className="flex justify-center mt-4 space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">⌘</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">⌥</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 lg:pl-12">
            <p className="text-gray-700 mb-8">
              Our online platform brings lessons to life, allowing students to draw diagrams, 
              solve equations, edit essays, and annotate work. We deliver elite tutoring worldwide, 
              matching students with the best tutors available.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Interactive whiteboard for real-time collaboration</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>HD video and crystal-clear audio</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Document sharing and annotation tools</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Rating section */}
        <div className="mt-16 text-center bg-pink-50 py-12 rounded-lg">
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            ))}
          </div>
          <h3 className="text-2xl font-bold mb-2">Rated 4.92/5 based on 480 reviews</h3>
          <p className="text-gray-600">
            We're part of{' '}
            <a href="https://tutorchase.com" className="text-orange-500 hover:underline">
              TutorChase
            </a>
            , the world's #1 IB tutoring provider
          </p>
        </div>
      </div>
    </section>
  );
};

export default TutoringPlatformBanner; 