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

// Clean, simple icon components
const StarIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L14.5 9.5L22 9.5L16.5 14L19 21.5L12 17L5 21.5L7.5 14L2 9.5L9.5 9.5L12 2Z"
      fill="#F57C40"
    />
  </svg>
);

const LanguageIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2"
      stroke="#001A96"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M7 8L7 16M11 8L11 16M17 10L15 14L13 10"
      stroke="#001A96"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EducationIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L22 7.5L12 12L2 7.5L12 3Z"
      fill="#F57C40"
    />
    <path
      d="M6 10.5V16C6 16 9 18.5 12 18.5C15 18.5 18 16 18 16V10.5"
      stroke="#F57C40"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
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
        <div className="flex items-center gap-8 w-[1400px] h-[360px] mx-auto">
          {highlights.map((item, index) => {
            const IconComponent = iconMap[item.iconType] || iconMap.star;

            return (
              <div
                key={index}
                className={`flex p-8 flex-col items-start gap-6 flex-shrink-0 rounded-[20px] h-[360px] ${
                  index === 0 ? "w-[540px]" : "w-[400px]"
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
                    className={`font-gilroy text-2xl font-medium leading-[120%] w-64 ${
                      index === 0 ? "text-white" : "text-[#171D23]"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <div className="w-8 h-8 flex-shrink-0">
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

      {/* Mobile responsive layout */}
      <div className="block lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6">
            {highlights.map((item, index) => {
              const IconComponent = iconMap[item.iconType] || iconMap.star;

              return (
                <div
                  key={index}
                  className={`p-6 flex flex-col items-start gap-4 rounded-[20px] ${
                    index === 0
                      ? "bg-[#001A96] text-white"
                      : index === 1
                        ? "bg-[#F2F4FA] text-[#171D23]"
                        : "bg-white border border-[#E6E7ED] text-[#171D23]"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <h3
                      className={`font-gilroy text-xl font-medium leading-[120%] flex-1 pr-4 ${
                        index === 0 ? "text-white" : "text-[#171D23]"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <div className="w-8 h-8 flex-shrink-0">
                      <IconComponent isFeatured={index === 0} />
                    </div>
                  </div>

                  <p
                    className={`font-gilroy text-base font-light leading-[160%] w-full ${
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
