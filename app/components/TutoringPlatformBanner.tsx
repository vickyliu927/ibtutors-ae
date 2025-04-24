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
  const [bannerData, setBannerData] = useState<PlatformBannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const data = await client.fetch<PlatformBannerData>(`*[_type == "platform_banner"][0] {
          _id,
          platformImage,
          whiteBoardImage,
          documentSharingImage
        }`);
        setBannerData(data);
      } catch (err) {
        console.error('Error fetching platform banner data:', err);
        setError('Failed to load platform banner');
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-gray-500 uppercase tracking-wide">ONLINE TUTORING PLATFORM</span>
          <h2 className="text-3xl font-bold mt-2">
            Engaging Lessons with our Online Platform
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden">
            {bannerData?.platformImage ? (
              <Image
                src={urlFor(bannerData.platformImage).url()}
                alt="Online tutoring platform interface"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-white/90">
                <div className="p-4 space-y-4">
                  {/* Platform Interface Mockup */}
                  <div className="flex space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <div className="bg-gray-100 rounded-lg p-4 mb-4">
                        <div className="h-24 bg-blue-100 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <div className="h-24 bg-blue-100 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="h-64 bg-blue-50 rounded-lg relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3/4 h-px bg-blue-200"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-100/50"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4 mt-4">
                    <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <p className="text-xl text-gray-600">
              Our online platform brings lessons to life, allowing students to draw diagrams,
              solve equations, edit essays, and annotate work. We deliver elite tutoring
              worldwide, matching students with the best tutors available.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-blue-800 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">Interactive whiteboard for real-time collaboration</span>
              </div>
              <div className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-blue-800 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">HD video and crystal-clear audio</span>
              </div>
              <div className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-blue-800 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">Document sharing and annotation tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutoringPlatformBanner; 