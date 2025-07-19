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
      return "flex items-center px-3 py-2 rounded bg-primary text-white";
    }
    return "flex items-center px-3 py-2 rounded bg-white text-primary";
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
      {/* Container with exact design dimensions and styling */}
      <div className="relative max-w-[1120px] mx-auto min-h-[301px]">
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
              <h2 className="font-gilroy text-xl sm:text-2xl font-bold leading-[120%] text-textDark mb-3">
                Popular IB Subjects
              </h2>
              <p className="font-gilroy text-sm sm:text-base font-normal leading-[140%] text-textDark max-w-[500px]">
                Our team of specialist tutors are here to help you excel all
                areas. Take a closer look at our expert tutors for each A-Level
                subject.
              </p>
            </div>

            {/* Subjects container */}
            <div className="relative">
              {/* Subjects grid with responsive behavior */}
              <div className="flex flex-wrap items-start gap-3 sm:gap-4 max-w-full lg:max-w-[1000px]">
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

              {/* Pointing hand icon - positioned exactly as in design, hidden on mobile */}
              <div className="hidden lg:block absolute left-[366px] top-[32px]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_13941_15702)">
                    <path
                      d="M3.29928 12.4005C2.99928 12.0005 2.69928 11.3005 2.09928 10.4005C1.79928 9.90054 0.899279 8.90054 0.599279 8.50054C0.399279 8.10054 0.399279 7.90054 0.499279 7.50054C0.599279 6.90054 1.19928 6.40054 1.89928 6.40054C2.39928 6.40054 2.89928 6.80054 3.29928 7.10054C3.49928 7.30054 3.79928 7.70054 3.99928 7.90054C4.19928 8.10054 4.19928 8.20054 4.39928 8.40054C4.59928 8.70054 4.69928 8.90054 4.59928 8.50054C4.49928 8.00054 4.39928 7.20054 4.19928 6.40054C4.09928 5.80054 3.99928 5.70054 3.89928 5.30054C3.79928 4.80054 3.69928 4.50054 3.59928 4.00054C3.49928 3.70054 3.39928 2.90054 3.29928 2.50054C3.19928 2.00054 3.19928 1.10054 3.59928 0.700536C3.89928 0.400536 4.49928 0.300536 4.89928 0.500536C5.39928 0.800536 5.69928 1.50054 5.79928 1.80054C5.99928 2.30054 6.19928 3.00054 6.29928 3.80054C6.49928 4.80054 6.79928 6.30054 6.79928 6.60054C6.79928 6.20054 6.69928 5.50054 6.79928 5.10054C6.89928 4.80054 7.09928 4.40054 7.49928 4.30054C7.79928 4.20054 8.09928 4.20054 8.39928 4.20054C8.69928 4.30054 8.99928 4.50054 9.19928 4.70054C9.59928 5.30054 9.59928 6.60054 9.59928 6.50054C9.69928 6.10054 9.69928 5.30054 9.89928 4.90054C9.99928 4.70054 10.3993 4.50054 10.5993 4.40054C10.8993 4.30054 11.2993 4.30054 11.5993 4.40054C11.7993 4.40054 12.1993 4.70054 12.2993 4.90054C12.4993 5.20054 12.5993 6.20054 12.6993 6.60054C12.6993 6.70054 12.7993 6.20054 12.9993 5.90054C13.3993 5.30054 14.7993 5.10054 14.8993 6.50054C14.8993 7.20054 14.8993 7.10054 14.8993 7.60054C14.8993 8.10054 14.8993 8.40054 14.8993 8.80054C14.8993 9.20053 14.7993 10.1005 14.6993 10.5005C14.5993 10.8005 14.2993 11.5005 13.9993 11.9005C13.9993 11.9005 12.8993 13.1005 12.7993 13.7005C12.6993 14.3005 12.6993 14.3005 12.6993 14.7005C12.6993 15.1005 12.7993 15.6005 12.7993 15.6005C12.7993 15.6005 11.9993 15.7005 11.5993 15.6005C11.1993 15.5005 10.6993 14.8005 10.5993 14.5005C10.3993 14.2005 10.0993 14.2005 9.89928 14.5005C9.69928 14.9005 9.19928 15.6005 8.79928 15.6005C8.09928 15.7005 6.69928 15.6005 5.69928 15.6005C5.69928 15.6005 5.89928 14.6005 5.49928 14.2005C5.19928 13.9005 4.69928 13.4005 4.39928 13.1005L3.29928 12.4005Z"
                      fill="white"
                    />
                    <path
                      d="M3.29928 12.4005C2.99928 12.0005 2.69928 11.3005 2.09928 10.4005C1.79928 9.90054 0.899279 8.90054 0.599279 8.50054C0.399279 8.10054 0.399279 7.90054 0.499279 7.50054C0.599279 6.90054 1.19928 6.40054 1.89928 6.40054C2.39928 6.40054 2.89928 6.80054 3.29928 7.10054C3.49928 7.30054 3.79928 7.70054 3.99928 7.90054C4.19928 8.10054 4.19928 8.20054 4.39928 8.40054C4.59928 8.70054 4.69928 8.90054 4.59928 8.50054C4.49928 8.00054 4.39928 7.20054 4.19928 6.40054C4.09928 5.80054 3.99928 5.70054 3.89928 5.30054C3.79928 4.80054 3.69928 4.50054 3.59928 4.00054C3.49928 3.70054 3.39928 2.90054 3.29928 2.50054C3.19928 2.00054 3.19928 1.10054 3.59928 0.700536C3.89928 0.400536 4.49928 0.300536 4.89928 0.500536C5.39928 0.800536 5.69928 1.50054 5.79928 1.80054C5.99928 2.30054 6.19928 3.00054 6.29928 3.80054C6.49928 4.80054 6.79928 6.30054 6.79928 6.60054C6.79928 6.20054 6.69928 5.50054 6.79928 5.10054C6.89928 4.80054 7.09928 4.40054 7.49928 4.30054C7.79928 4.20054 8.09928 4.20054 8.39928 4.20054C8.69928 4.30054 8.99928 4.50054 9.19928 4.70054C9.59928 5.30054 9.59928 6.60054 9.59928 6.50054C9.69928 6.10054 9.69928 5.30054 9.89928 4.90054C9.99928 4.70054 10.3993 4.50054 10.5993 4.40054C10.8993 4.30054 11.2993 4.30054 11.5993 4.40054C11.7993 4.40054 12.1993 4.70054 12.2993 4.90054C12.4993 5.20054 12.5993 6.20054 12.6993 6.60054C12.6993 6.70054 12.7993 6.20054 12.9993 5.90054C13.3993 5.30054 14.7993 5.10054 14.8993 6.50054C14.8993 7.20054 14.8993 7.10054 14.8993 7.60054C14.8993 8.10054 14.8993 8.40054 14.8993 8.80054C14.8993 9.20054 14.7993 10.1005 14.6993 10.5005C14.5993 10.8005 14.2993 11.5005 13.9993 11.9005C13.9993 11.9005 12.8993 13.1005 12.7993 13.7005C12.6993 14.3005 12.6993 14.3005 12.6993 14.7005C12.6993 15.1005 12.7993 15.6005 12.7993 15.6005C12.7993 15.6005 11.9993 15.7005 11.5993 15.6005C11.1993 15.5005 10.6993 14.8005 10.5993 14.5005C10.3993 14.2005 10.0993 14.2005 9.89928 14.5005C9.69928 14.9005 9.19928 15.6005 8.79928 15.6005C8.09928 15.7005 6.69928 15.6005 5.69928 15.6005C5.69928 15.6005 5.89928 14.6005 5.49928 14.2005C5.19928 13.9005 4.69928 13.4005 4.39928 13.1005L3.29928 12.4005Z"
                      stroke="#171D23"
                      strokeWidth="0.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.5996 12.7003V9.30029"
                      stroke="#171D23"
                      strokeWidth="0.75"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9.59902 12.7003L9.49902 9.30029"
                      stroke="#171D23"
                      strokeWidth="0.75"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7.59961 9.30029V12.7003"
                      stroke="#171D23"
                      strokeWidth="0.75"
                      strokeLinecap="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_13941_15702">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubjectGrid;
