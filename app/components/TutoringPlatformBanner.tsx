'use client';

export interface PlatformFeature {
  feature: string;
  description?: string;
}

export interface PlatformBannerData {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: PlatformFeature[];
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
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 flex justify-center">
            <div className="relative max-w-md mx-auto w-full">
              {/* Decorative dots */}
              <div className="absolute -top-4 -left-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
              </div>
                
              {/* Local platform image - updated for mobile and desktop */}
              <div className="w-full px-4 sm:px-8 md:px-12 lg:px-0">
                <img 
                  src="/images/tutoring-platform.jpg" 
                  alt="Online tutoring platform"
                  className="rounded-lg w-full h-[300px] sm:h-[350px] lg:h-[500px] object-contain"
                />
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

          <div className="w-full lg:w-1/2 lg:pl-12 px-4 sm:px-8 mx-auto">
            <p className="text-gray-700 mb-8 text-center lg:text-left">{description}</p>

            <ul className="space-y-4 max-w-md mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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