"use client";
import React from "react";
import Image from "next/image";

interface Institution {
  name: string;
  logo: string;
  displayOrder?: number;
}

interface TrustedInstitutionsBannerProps {
  title?: string;
  subtitle?: string;
  institutions?: Institution[];
  backgroundColor?: string;
  carouselSpeed?: number;
}

const TrustedInstitutionsBanner: React.FC<TrustedInstitutionsBannerProps> = ({
  title = "Trusted by 500+ IB Schools Worldwide",
  subtitle,
  institutions = [],
  backgroundColor,
  carouselSpeed,
}) => {
  // Default schools data matching the Figma design
  const defaultSchools = [
    {
      name: "Dr Challoner's Grammar School",
      logo: "https://api.builder.io/api/v1/image/assets/TEMP/9d3687c85a1a65bce197a7913204c9de87b0b091?width=198",
      displayOrder: 1,
    },
    {
      name: "St Olave's School",
      logo: "https://api.builder.io/api/v1/image/assets/TEMP/93eaa4db8208f132fb6ef9fdd3131c063b364e52?width=148",
      displayOrder: 2,
    },
    {
      name: "Eton College",
      logo: "https://api.builder.io/api/v1/image/assets/TEMP/425a6d6dd55a95c9d0bc4eec0ac4119ca1dbe7f1?width=144",
      displayOrder: 3,
    },
    {
      name: "Wimbledon High School GDST",
      logo: "https://api.builder.io/api/v1/image/assets/TEMP/2daa1c882a23a4f27e5f5561f50279ee249dd369?width=156",
      displayOrder: 4,
    },
    {
      name: "St Paul's Girls' School",
      logo: "https://api.builder.io/api/v1/image/assets/TEMP/485046febb639f9a6420d44616c77c34fe72a0b0?width=176",
      displayOrder: 5,
    },
    {
      name: "King Edward High School",
      logo: "https://api.builder.io/api/v1/image/assets/TEMP/316a7626cb7b6a0e3c1eef01cea760d696b51c7e?width=144",
      displayOrder: 6,
    },
  ];

  // Use provided institutions or default schools
  const displaySchools =
    institutions.length > 0 ? institutions : defaultSchools;

  return (
    <div className="w-full py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Container matching Figma dimensions */}
        <div className="w-full max-w-[900px] mx-auto">
          {/* Headline */}
          <div className="text-center mb-[73px]">
            <h2 className="text-textDark font-gilroy text-2xl font-semibold leading-[120%]">
              {title}
            </h2>
          </div>

          {/* Logos grid */}
          <div className="flex items-center justify-center gap-[60px] flex-wrap lg:flex-nowrap">
            {displaySchools.map((school, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1 w-[100px]"
              >
                {/* Logo container */}
                <div className="flex items-center justify-center w-[100px] h-[100px] relative">
                  <Image
                    src={school.logo}
                    alt={school.name}
                    width={100}
                    height={100}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                {/* School name */}
                <div className="text-center text-textDark font-gilroy text-xs font-normal leading-[140%] w-full">
                  {school.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedInstitutionsBanner;
