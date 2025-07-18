import React from "react";

export interface HighlightItem {
  title: string;
  description: string;
  iconType: "star" | "language" | "education";
  isFeatured: boolean;
}

interface HighlightsSectionProps {
  highlights: HighlightItem[];
}

// Simplified icon components matching the screenshot
const StarIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill="#F57C40"
    />
  </svg>
);

const LanguageIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 5H15M9 3V21M10.5 21H7.5M14 13L16.5 18L19 13M14.5 16.5H18.5"
      stroke="#001A96"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EducationIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22 10V6L12 2L2 6L12 10L20 6.5V10M6 12V17C6 17 9 20 12 20C15 20 18 17 18 17V12"
      stroke="#F57C40"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 19.5C4 18.1 5.1 17 6.5 17H12"
      stroke="#F57C40"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const iconMap = {
  star: StarIcon,
  language: LanguageIcon,
  education: EducationIcon,
};

const HighlightsSection: React.FC<HighlightsSectionProps> = ({
  highlights,
}) => {
  return (
    <section className="py-16 bg-white relative">
      {/* Desktop layout - exact match to Figma design */}
      <div className="hidden lg:block">
        <div className="flex items-center gap-8 w-[1544px] h-[400px] mx-auto">
          {highlights.map((item, index) => {
            const IconComponent = iconMap[item.iconType] || iconMap.star;

            return (
              <div
                key={index}
                className={`flex p-10 flex-col items-start gap-8 flex-shrink-0 rounded-[24px] h-[400px] ${
                  index === 0 ? "w-[600px]" : "w-[440px]"
                } ${
                  index === 0
                    ? "bg-[#001A96] text-white"
                    : index === 1
                      ? "bg-[#F2F4FA] text-[#171D23]"
                      : "bg-white border border-[#E6E7ED] text-[#171D23]"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <h3
                    className={`font-gilroy text-3xl font-medium leading-[120%] w-72 ${
                      index === 0 ? "text-white" : "text-[#171D23]"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <div className="w-10 h-10 flex-shrink-0">
                    <IconComponent isFeatured={index === 0} />
                  </div>
                </div>

                <p
                  className={`font-gilroy text-xl font-light leading-[160%] w-full ${
                    index === 0 ? "text-white" : "text-[#171D23]"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile responsive layout */}
      <div className="block lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6">
            {highlights.map((item, index) => {
              const IconComponent = iconMap[item.iconType] || iconMap.star;

              return (
                <div
                  key={index}
                  className={`p-8 flex flex-col items-start gap-6 rounded-[24px] ${
                    index === 0
                      ? "bg-[#001A96] text-white"
                      : index === 1
                        ? "bg-[#F2F4FA] text-[#171D23]"
                        : "bg-white border border-[#E6E7ED] text-[#171D23]"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <h3
                      className={`font-gilroy text-2xl font-medium leading-[120%] flex-1 pr-4 ${
                        index === 0 ? "text-white" : "text-[#171D23]"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <div className="w-10 h-10 flex-shrink-0">
                      <IconComponent isFeatured={index === 0} />
                    </div>
                  </div>

                  <p
                    className={`font-gilroy text-lg font-light leading-[160%] w-full ${
                      index === 0 ? "text-white" : "text-[#171D23]"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
