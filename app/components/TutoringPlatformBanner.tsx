'use client';

export interface PlatformFeature {
  feature: string;
  description?: string;
}

export interface PlatformImage {
  url: string;
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface PlatformBannerData {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: PlatformFeature[];
  images?: PlatformImage[];
  // Legacy fields
  platformImage?: any;
  whiteBoardImage?: any;
  documentSharingImage?: any;
}

interface Props {
  data: PlatformBannerData | null;
}

const TutoringPlatformBanner = ({ data }: Props) => {
  if (!data) return null;

  // Default values if data is missing
  const title = data.title || 'Engaging Lessons with our Online Platform';
  const subtitle = data.subtitle || 'ONLINE TUTORING PLATFORM';
  const description = data.description || 'Our online platform brings lessons to life, allowing students to draw diagrams, solve equations, edit essays, and annotate work. We deliver elite tutoring worldwide, matching students with the best tutors available.';
  
  // Use only the first image or legacy images
  const images = data.images || [
    data.platformImage,
    data.whiteBoardImage,
    data.documentSharingImage
  ].filter(Boolean);
  
  // Get just the first image or undefined
  const mainImage = images.length > 0 ? images[0] : undefined;

  // Default features if none provided
  const features = data.features || [
    { feature: 'Interactive whiteboard for real-time collaboration' },
    { feature: 'HD video and crystal-clear audio' },
    { feature: 'Document sharing and annotation tools' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gray-600 uppercase tracking-wide mb-3">{subtitle}</p>
          <h2 className="text-3xl font-bold">{title}</h2>
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
                
              {/* Single platform image */}
              <div className="w-full">
                {mainImage ? (
                  <img 
                    src={mainImage.url || mainImage.asset?._ref} 
                    alt={mainImage.alt || "Online tutoring platform"}
                    className="rounded-lg object-cover w-full h-[350px]"
                  />
                ) : (
                  <div className="bg-blue-50 rounded-lg h-[350px] w-full"></div>
                )}
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
            <p className="text-gray-700 mb-8">{description}</p>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{feature.feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutoringPlatformBanner; 