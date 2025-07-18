"use client";
import React from "react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

export interface TutorCardData {
  _id: string;
  name: string;
  professionalTitle?: string;
  experience: string;
  profilePhoto: any;
  specialization: {
    mainSubject: string;
    additionalSubjects?: string[];
  };
  hireButtonLink: string;
  rating?: number;
  activeStudents?: number;
}

interface TutorCardProps {
  tutor: TutorCardData;
}

const TutorCard = ({ tutor }: TutorCardProps) => {
  // Generate star rating display
  const renderStars = () => {
    const rating = tutor.rating || 4.9;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <path
          key={i}
          d="M9 2.125L11.0206 8.34385H17.5595L12.2694 12.1873L14.2901 18.4062L9 14.5627L3.70993 18.4062L5.73056 12.1873L0.440492 8.34385H6.97937L9 2.125Z"
          fill="#FCBD00"
          transform={`translate(${i * 21}, 0.75)`}
        />,
      );
    }

    return stars;
  };

  const rating = tutor.rating || 4.9;
  const studentCount = tutor.activeStudents || 100;

  return (
    <div
      className="flex items-center border border-[#E6E7ED] bg-white relative w-full"
      style={{
        maxWidth: "1300px",
        width: "100%",
        height: "280px",
        borderRadius: "20px",
      }}
    >
      {/* Left side - Tutor Image */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{
          width: "280px",
          height: "280px",
          borderRadius: "20px 0px 0px 20px",
        }}
      >
        {tutor.profilePhoto ? (
          <Image
            src={urlFor(tutor.profilePhoto).width(560).height(560).url()}
            alt={tutor.name}
            fill
            className="object-cover object-center"
            sizes="280px"
            priority={true}
          />
        ) : (
          <Image
            src="https://api.builder.io/api/v1/image/assets/TEMP/84ed7e54bec2d65e3b797735f59c65b58fa4d025?width=560"
            alt={tutor.name}
            fill
            className="object-cover object-center"
            sizes="280px"
            priority={true}
          />
        )}
      </div>

      {/* Right side - Info Panel */}
      <div className="flex flex-col justify-between items-start flex-1 h-full">
        {/* Top section - Name, Rating, Students */}
        <div
          className="flex flex-col items-start gap-3 self-stretch"
          style={{ padding: "24px 32px 0px 32px" }}
        >
          {/* Name Row */}
          <div className="flex items-center self-stretch">
            <div className="flex items-center gap-8">
              {/* Name */}
              <div
                className="text-[#171D23] font-gilroy font-semibold leading-[120%]"
                style={{
                  width: "160px",
                  fontSize: "24px",
                  fontWeight: 600,
                }}
              >
                {tutor.name}
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-2">
                <svg
                  width="131"
                  height="23"
                  viewBox="0 0 131 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex items-center gap-2"
                >
                  {renderStars()}
                  <text
                    fill="#171D23"
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      fontFamily:
                        "Gilroy, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                    x="110"
                    y="16.964"
                  >
                    {rating}
                  </text>
                </svg>
              </div>

              {/* Students Count */}
              <div className="flex items-center gap-1.5">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path
                    d="M4 7.125C4 6.03098 4.4346 4.98177 5.20818 4.20818C5.98177 3.4346 7.03098 3 8.125 3C9.21902 3 10.2682 3.4346 11.0418 4.20818C11.8154 4.98177 12.25 6.03098 12.25 7.125C12.25 8.21902 11.8154 9.26823 11.0418 10.0418C10.2682 10.8154 9.21902 11.25 8.125 11.25C7.03098 11.25 5.98177 10.8154 5.20818 10.0418C4.4346 9.26823 4 8.21902 4 7.125ZM13.75 9.375C13.75 8.93179 13.8373 8.49292 14.0069 8.08344C14.1765 7.67397 14.4251 7.30191 14.7385 6.98851C15.0519 6.67512 15.424 6.42652 15.8334 6.25691C16.2429 6.0873 16.6818 6 17.125 6C17.5682 6 18.0071 6.0873 18.4166 6.25691C18.826 6.42652 19.1981 6.67512 19.5115 6.98851C19.8249 7.30191 20.0735 7.67397 20.2431 8.08344C20.4127 8.49292 20.5 8.93179 20.5 9.375C20.5 10.2701 20.1444 11.1285 19.5115 11.7615C18.8786 12.3944 18.0201 12.75 17.125 12.75C16.2299 12.75 15.3715 12.3944 14.7385 11.7615C14.1056 11.1285 13.75 10.2701 13.75 9.375ZM1 19.875C1 17.9853 1.75067 16.1731 3.08686 14.8369C4.42306 13.5007 6.23533 12.75 8.125 12.75C10.0147 12.75 11.8269 13.5007 13.1631 14.8369C14.4993 16.1731 15.25 17.9853 15.25 19.875V19.878L15.249 19.997C15.2469 20.1242 15.2125 20.2487 15.1489 20.3589C15.0854 20.4691 14.995 20.5614 14.886 20.627C12.8452 21.856 10.5073 22.5036 8.125 22.5C5.653 22.5 3.339 21.816 1.365 20.627C1.25585 20.5615 1.16517 20.4693 1.10149 20.3591C1.03781 20.2489 1.00323 20.1243 1.001 19.997L1 19.875ZM16.75 19.878L16.749 20.022C16.7434 20.3553 16.6638 20.6832 16.516 20.982C18.2617 21.0897 20.0054 20.7416 21.576 19.972C21.6975 19.9126 21.8006 19.8215 21.8745 19.7083C21.9485 19.5951 21.9904 19.4641 21.996 19.329C22.0313 18.4902 21.8494 17.6566 21.4679 16.9088C21.0864 16.1609 20.5183 15.5243 19.8185 15.0605C19.1188 14.5967 18.3111 14.3215 17.4738 14.2615C16.6364 14.2015 15.7977 14.3587 15.039 14.718C16.1522 16.2066 16.7522 18.0162 16.749 19.875L16.75 19.878Z"
                    fill="#4053B0"
                  />
                </svg>
                <div
                  className="text-[#171D23] font-gilroy font-medium leading-[140%]"
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  {studentCount}+ students
                </div>
              </div>
            </div>
          </div>

          {/* University Info */}
          <div className="flex items-center gap-3 self-stretch">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <g clipPath="url(#clip0_14183_13882)">
                <path
                  d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18ZM12 3L1 9L12 15L21 10.09V17H23V9L12 3Z"
                  fill="#F57C40"
                />
              </g>
              <defs>
                <clipPath id="clip0_14183_13882">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <div
              className="flex-1 text-[#171D23] font-gilroy font-medium leading-[120%]"
              style={{
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              {tutor.professionalTitle ||
                "IB Maths Tutor | University of Amsterdam"}
            </div>
          </div>

          {/* Description */}
          <div
            className="self-stretch text-[#171D23] font-gilroy font-light leading-[140%]"
            style={{
              fontSize: "16px",
              fontWeight: 300,
            }}
          >
            {tutor.experience}
          </div>
        </div>

        {/* Bottom section - Tags and Button */}
        <div className="flex justify-between items-end gap-4 self-stretch">
          {/* Tags section */}
          <div
            className="flex items-start content-start gap-2 flex-1 self-stretch flex-wrap"
            style={{ padding: "8px 0px 24px 32px" }}
          >
            <div
              className="flex flex-col justify-center text-[#171D23] text-center font-gilroy font-semibold leading-[140%]"
              style={{
                width: "57px",
                height: "28px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Teaches:
            </div>
            <div
              className="flex justify-center items-center gap-2.5 bg-[#FBFCFD] px-2 py-1.5"
              style={{
                height: "28px",
                borderRadius: "8px",
              }}
            >
              <div
                className="text-center font-gilroy font-semibold leading-[140%]"
                style={{
                  color: "#001A96",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {tutor.specialization.mainSubject}
              </div>
            </div>
          </div>

          {/* Hire Button */}
          <Link
            href={tutor.hireButtonLink || "/#contact-form"}
            className="flex justify-center items-center bg-[#001A96] text-white text-center font-gilroy font-bold leading-[140%] transition-all hover:bg-blue-800"
            style={{
              padding: "16px 36px",
              borderRadius: "16px 0px 20px 0px",
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "0px",
            }}
          >
            Hire a Tutor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
