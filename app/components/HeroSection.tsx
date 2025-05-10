'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

export interface HeroData {
  title: string;
  highlightedWords?: string[];
  subtitle: string;
  mainImage: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  primaryButton: {
    text: string;
    link: string;
  };
  features?: string[];
}

const LoadingHero = () => (
  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-0 animate-pulse">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="h-14 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded w-40"></div>
            <div className="h-6 bg-gray-200 rounded w-56"></div>
          </div>
        </div>
        <div className="relative h-[500px] bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const HeroSection = ({ heroData }: { heroData?: HeroData }) => {
  const [imageError, setImageError] = React.useState(false);

  if (!heroData) {
    return <LoadingHero />;
  }

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
          <div className="space-y-4 md:space-y-6 self-center pt-12 md:pt-0 pb-0">
            <h1 className="text-5xl font-bold">
              {heroData.title.split(' ').map((word, index) => (
                <React.Fragment key={index}>
                  <span className={
                    heroData.highlightedWords?.includes(word) 
                      ? "text-blue-800" 
                      : ""
                  }>
                    {word}
                  </span>{" "}
                </React.Fragment>
              ))}
            </h1>
            <p className="text-xl text-gray-600">
              {heroData.subtitle}
            </p>
            <div className="space-y-4">
              {heroData.primaryButton && (
              <Link
                  href="#contact-form"
                  className="inline-block bg-blue-800 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                  {heroData.primaryButton.text}
              </Link>
              )}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 15.934L4.618 19.098l1.039-6.054L1.314 8.902l6.068-.881L10 2.666l2.618 5.355 6.068.881-4.343 4.142 1.039 6.054L10 15.934z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-lg">
                  4.92/5 based on <span className="font-medium">480 reviews</span>
                </span>
              </div>
            </div>
            {heroData.features && heroData.features.length > 0 && (
              <ul className="space-y-2">
                {heroData.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 text-blue-800 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative h-[450px] md:h-[540px] mt-0 flex items-end">
            {heroData.mainImage && !imageError ? (
              <Image
                src={urlFor(heroData.mainImage).url()}
                alt="Tutor"
                fill
                className="object-contain object-bottom"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setImageError(true)}
                loading="eager"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                <span className="text-center">
                  {imageError ? "Failed to load image" : "Loading image..."}
                </span>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 