'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface PlatformBannerData {
  _id: string;
  platformImage: any;
  whiteBoardImage: any;
}

const TutoringPlatformBanner = () => {
  const [bannerData, setBannerData] = useState<PlatformBannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        console.log('Fetching platform banner data...');
        const data = await client.fetch<PlatformBannerData>(`*[_type == "platform_banner"][0] {
          _id,
          platformImage,
          whiteBoardImage
        }`);
        console.log('Raw platform banner response:', JSON.stringify(data, null, 2));
        
        if (!data) {
          console.log('No platform banner document found');
          return;
        }

        if (data.platformImage) {
          const imageUrl = urlFor(data.platformImage).url();
          console.log('Platform image data:', data.platformImage);
          console.log('Generated platform image URL:', imageUrl);
        } else {
          console.log('No platform image found in data');
        }

        if (data.whiteBoardImage) {
          const whiteboardUrl = urlFor(data.whiteBoardImage).url();
          console.log('Whiteboard image URL:', whiteboardUrl);
        }
        
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
          <div className="space-y-8">
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
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                  <span>Loading...</span>
                </div>
              )}
            </div>
            <div className="relative h-[200px] bg-gray-100 rounded-lg overflow-hidden">
              {bannerData?.whiteBoardImage ? (
                <Image
                  src={urlFor(bannerData.whiteBoardImage).url()}
                  alt="Interactive whiteboard example"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                  <span>Loading...</span>
                </div>
              )}
            </div>
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