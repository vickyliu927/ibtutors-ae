import React from "react";
import Link from "next/link";
import { getSubjectGridData } from "../lib/getSubjectGridData";

const SubjectGrid = async () => {
  const subjects = await getSubjectGridData();

  // Static subjects list to match the Figma design exactly
  const displaySubjects = [
    "Maths",
    "Further Maths",
    "Biology",
    "Chemistry",
    "Physics",
    "Psychology",
    "Computer Science",
    "English",
    "History",
    "Geography",
    "Economics",
    "Business Studies",
    "French",
    "Spanish",
    "German",
    "Law",
    "Accounting",
    "EPQ",
  ];

  // Check if "Chemistry" should be highlighted (4th item in the design)
  const getSubjectStyle = (subject: string, index: number) => {
    if (subject === "Chemistry") {
      return "flex items-center px-3 py-2 rounded bg-primary text-white hover:bg-blue-700 transition-colors duration-200";
    }
    return "flex items-center px-3 py-2 rounded bg-white text-primary hover:bg-primary hover:text-white transition-colors duration-200";
  };

  const getSubjectHref = (subject: string) => {
    // Find matching subject from fetched data
    const matchedSubject = subjects?.find(
      (s) => s.subject.toLowerCase() === subject.toLowerCase(),
    );
    return matchedSubject
      ? `/${matchedSubject.slug.current}`
      : `/${subject.toLowerCase().replace(/\s+/g, "-")}`;
  };

  return (
    <section className="relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      {/* Container with wider design dimensions and styling */}
      <div className="relative max-w-[1400px] mx-auto min-h-[301px]">
        {/* Background with exact color and border radius */}
        <div className="absolute inset-0 bg-greyBlueLight rounded-[20px]">
          {/* Background illustration SVG - hidden on mobile for performance */}
          <div className="hidden lg:block">
            <svg
              className="absolute left-6 top-[-372px]"
              style={{ width: "1224px", height: "896px" }}
              viewBox="0 0 1097 301"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1186 -84.1055L688 459.191" stroke="#E6E7ED" />
              <path
                opacity="0.5"
                d="M1224.55 -262.417L678.045 297.977C667.117 309.183 661 324.216 661 339.868V523.749"
                stroke="#E6E7ED"
              />
              <path
                opacity="0.5"
                d="M564.549 -372.417L18.0446 187.977C7.1165 199.183 1 214.216 1 229.868V413.749"
                stroke="#E6E7ED"
              />
              <rect
                x="0.451098"
                y="0.572833"
                width="7"
                height="7"
                rx="3.5"
                transform="matrix(0.988774 0.149421 -0.0865768 0.996245 976.309 136.192)"
                fill="#E6E7ED"
                stroke="#E6E7ED"
              />
            </svg>
          </div>

          {/* Content container with responsive padding */}
          <div className="relative z-10 px-6 py-8 sm:px-12 lg:px-[60px] lg:py-[42px]">
            {/* Header section */}
            <div className="mb-8 lg:mb-[44px]">
              <h2 className="font-gilroy text-xl sm:text-2xl font-medium leading-[120%] text-textDark mb-3" style={{ fontWeight: 500 }}>
                Popular IB Subjects
              </h2>
              <p className="font-gilroy text-sm sm:text-base font-light leading-[140%] text-textDark max-w-[500px]" style={{ fontWeight: 300 }}>
                Our team of specialist tutors are here to help you excel all
                areas. Take a closer look at our expert tutors for each A-Level
                subject.
              </p>
            </div>

            {/* Subjects container */}
            <div className="relative">
              {/* Subjects grid with responsive behavior - wider for larger container */}
              <div className="flex flex-wrap items-start gap-3 sm:gap-4 max-w-full lg:max-w-[1200px]">
                {displaySubjects.map((subject, index) => (
                  <Link
                    key={subject}
                    href={getSubjectHref(subject)}
                    className={getSubjectStyle(subject, index)}
                  >
                    <span className="font-gilroy text-sm font-medium leading-[140%] whitespace-nowrap">
                      {subject}
                    </span>
                  </Link>
                ))}
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubjectGrid;
