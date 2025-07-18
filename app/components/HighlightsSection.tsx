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

// Icon components matching the screenshot exactly
const StarIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 2L19.4 12.2L30 12.2L21.8 18.8L25.2 29L16 22.4L6.8 29L10.2 18.8L2 12.2L12.6 12.2L16 2Z"
      fill="#F57C40"
    />
  </svg>
);

const LanguageIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 8H14M8 2V30M9 26H7M20 14L23 24L26 14M21 20H25"
      stroke="#001A96"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 4H28C29.1046 4 30 4.89543 30 6V26C30 27.1046 29.1046 28 28 28H4C2.89543 28 2 27.1046 2 26V6C2 4.89543 2.89543 4 4 4Z"
      stroke="#001A96"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const EducationIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 24C2 22.8954 2.89543 22 4 22H12M16 12L30 6L16 2L2 6L16 12ZM16 12V26M6 8V18C6 18 10 20 16 20C22 20 26 18 26 18V8"
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
        <div className="flex items-center gap-8 w-[1248px] h-[320px] mx-auto">
          {highlights.map((item, index) => {
            const IconComponent = iconMap[item.iconType] || iconMap.star;

            return (
              <div
                key={index}
                className={`flex p-8 flex-col items-start gap-6 flex-shrink-0 rounded-[20px] h-[320px] ${
                  index === 0 ? "w-[480px]" : "w-[352px]"
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
                    className={`font-gilroy text-2xl font-bold leading-[120%] w-60 ${
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
                      className={`font-gilroy text-xl font-bold leading-[120%] flex-1 pr-4 ${
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
