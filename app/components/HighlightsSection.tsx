import React from "react";
import { Star, Languages, GraduationCap } from "lucide-react";

export interface HighlightItem {
  title: string;
  description: string;
  iconType: "star" | "language" | "education";
  isFeatured: boolean;
}

interface HighlightsSectionProps {
  highlights: HighlightItem[];
}

// Clean icon components using Lucide React
const StarIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <Star
    size={32}
    fill="#F57C40"
    color="#F57C40"
  />
);

const LanguageIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <Languages
    size={32}
    color="#001A96"
    strokeWidth={2}
  />
);

const EducationIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <GraduationCap
    size={32}
    color="#F57C40"
    strokeWidth={2}
  />
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
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
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
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
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
