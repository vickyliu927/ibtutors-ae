import React from 'react';

export interface HighlightItem {
  title: string;
  description: string;
  iconType: 'star' | 'language' | 'education';
  isFeatured: boolean;
}

interface HighlightsSectionProps {
  highlights: HighlightItem[];
}

// Icon components matching the screenshot design
const StarIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${isFeatured ? 'bg-orange-500' : 'bg-blue-100'}`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L14.09 8.26L20 9.27L15.5 13.14L16.18 19.02L12 16.77L7.82 19.02L8.5 13.14L4 9.27L9.91 8.26L12 2Z"
        fill={isFeatured ? "#FFFFFF" : "#1D4ED8"}
      />
    </svg>
  </div>
);

const LanguageIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${isFeatured ? 'bg-orange-500' : 'bg-blue-100'}`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 5H15M9 3V21M10.5 21H7.5M14 13L16.5 18L19 13M14.5 16.5H18.5"
        stroke={isFeatured ? "#FFFFFF" : "#1D4ED8"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const EducationIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${isFeatured ? 'bg-orange-500' : 'bg-blue-100'}`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
        stroke={isFeatured ? "#FFFFFF" : "#1D4ED8"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
        stroke={isFeatured ? "#FFFFFF" : "#1D4ED8"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const iconMap = {
  star: StarIcon,
  language: LanguageIcon,
  education: EducationIcon,
};

const HighlightsSection: React.FC<HighlightsSectionProps> = ({ highlights }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => {
            const IconComponent = iconMap[item.iconType] || iconMap.star;
            
            return (
              <div
                key={index}
                className={`rounded-3xl p-8 h-full flex flex-col ${
                  item.isFeatured
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                <div className="flex-shrink-0">
                  <IconComponent isFeatured={item.isFeatured} />
                </div>
                
                <div className="flex-grow">
                  <h3 className={`text-2xl font-bold mb-4 leading-tight ${
                    item.isFeatured ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h3>
                  
                  <p className={`text-base leading-relaxed ${
                    item.isFeatured ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection; 