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
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-3/5 mb-8 lg:mb-0 flex justify-center">
            <div className="relative w-full">
              {/* Platform image - enlarged for desktop */}
              <div className="w-full px-4 sm:px-8 md:px-12 lg:px-0">
                      <img 
                  src="/images/tutoring-platform.jpg" 
                  alt="Online tutoring platform"
                  className="rounded-lg w-full h-[350px] sm:h-[450px] lg:h-[650px] object-contain"
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5 lg:pl-16 px-4 sm:px-8 mx-auto">
            <div className="mb-6 text-left">
              <p className="font-gilroy text-[20px] uppercase tracking-wide mb-2" style={{ color: "#F57C40", fontWeight: 200 }}>{subtitle}</p>
              <h2 className="font-gilroy text-[42px] font-medium leading-tight">{title}</h2>
            </div>
            
            <p className="font-gilroy text-[20px] text-gray-700 text-left leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutoringPlatformBanner; 