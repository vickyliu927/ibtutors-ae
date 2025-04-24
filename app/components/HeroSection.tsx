'use client';
import React from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface HeroData {
  title: string;
  subtitle: string;
  mainImage: any;
  primaryButton: {
    text: string;
    link: string;
  };
  features: string[];
}

const HeroSection = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      const data = await client.fetch<HeroData>(`*[_type == "hero"][0]`);
      setHeroData(data);
    };

    fetchHeroData();
  }, []);

  if (!heroData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold">
              {heroData.title.split(' ').map((word, index, array) => (
                <React.Fragment key={index}>
                  <span className={index === array.length - 2 ? "text-blue-800" : ""}>
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
                  href={heroData.primaryButton.link || "#hire-tutor"}
                  className="inline-block bg-blue-800 text-white px-8 py-3 rounded-md text-lg font-medium"
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
          <div className="relative h-[500px]">
            {heroData.mainImage ? (
              <Image
                src={urlFor(heroData.mainImage).url()}
                alt="Tutor"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Placeholder for tutor image
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 