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
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-gray-600 uppercase tracking-wide mb-2">{subtitle}</p>
          <h2 className="text-3xl font-bold">{title}</h2>
        </div>

        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-1/2 mb-6 lg:mb-0 flex justify-center">
            <div className="relative w-full">
              {/* Platform image - enlarged for desktop */}
              <div className="w-full px-4 sm:px-8 md:px-12 lg:px-0">
                <img 
                  src="/images/tutoring-platform.jpg" 
                  alt="Online tutoring platform"
                  className="rounded-lg w-full h-[300px] sm:h-[350px] lg:h-[550px] object-contain"
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 lg:pl-12 px-4 sm:px-8 mx-auto">
            <p className="text-gray-700 mb-6 text-center lg:text-left">{description}</p>

            <ul className="space-y-3 max-w-md mx-auto lg:mx-0">
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