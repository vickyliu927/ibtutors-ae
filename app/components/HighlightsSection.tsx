import React from 'react';

export interface HighlightItem {
  icon: string;
  title: string;
  description: string;
}

interface HighlightsSectionProps {
  highlights: HighlightItem[];
}

const iconMap: Record<string, JSX.Element> = {
  globe: (
    <svg className="w-8 h-8 text-blue-800 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none" />
      <path d="M2 12h20M12 2c2.5 2.5 2.5 17.5 0 20M12 2c-2.5 2.5-2.5 17.5 0 20" strokeWidth="2" stroke="currentColor" fill="none" />
    </svg>
  ),
  book: (
    <svg className="w-8 h-8 text-blue-800 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h11V2zM6 6H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2V6z" />
    </svg>
  ),
  check: (
    <svg className="w-8 h-8 text-blue-800 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
};

const HighlightsSection: React.FC<HighlightsSectionProps> = ({ highlights }) => {
  return (
    <section className="pt-2 pb-6 md:py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-16 text-center">
          {highlights.map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center max-w-sm mx-auto bg-white rounded-xl shadow-md p-4 md:p-6 my-3 md:my-4"
            >
              {iconMap[item.icon] || iconMap['globe']}
              <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection; 