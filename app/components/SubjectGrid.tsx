import React from "react";
import Link from "next/link";
import { getSubjectGridData } from "../lib/getSubjectGridData";

interface SubjectGridProps {
  sectionData?: any;
}

const SubjectGrid = async ({ sectionData }: SubjectGridProps) => {
  const subjects = await getSubjectGridData();

  // Use Sanity data when available, otherwise fall back to static list
  const sectionTitle = sectionData?.title || "Popular IB Subjects";
  const sectionDescription = sectionData?.description || "Our team of specialist tutors are here to help you excel all areas. Take a closer look at our expert tutors for each A-Level subject.";
  const splitDescription = sectionData?.splitDescription || false;
  const backgroundColor = sectionData?.backgroundColor || "#f2f4fa";

  // Use Sanity subjects when available, otherwise fall back to static list
  const sanitySubjects = sectionData?.subjects?.filter((s: any) => s.enabled !== false) || [];
  const displaySubjects = sanitySubjects.length > 0 
    ? sanitySubjects.sort((a: any, b: any) => (a.displayOrder || 100) - (b.displayOrder || 100))
    : [
        { name: "Maths", slug: "maths" },
        { name: "Further Maths", slug: "further-maths" },
        { name: "Biology", slug: "biology" },
        { name: "Chemistry", slug: "chemistry" },
        { name: "Physics", slug: "physics" },
        { name: "Psychology", slug: "psychology" },
        { name: "Computer Science", slug: "computer-science" },
        { name: "English", slug: "english" },
        { name: "History", slug: "history" },
        { name: "Geography", slug: "geography" },
        { name: "Economics", slug: "economics" },
        { name: "Business Studies", slug: "business-studies" },
        { name: "French", slug: "french" },
        { name: "Spanish", slug: "spanish" },
        { name: "German", slug: "german" },
        { name: "Law", slug: "law" },
        { name: "Accounting", slug: "accounting" },
        { name: "EPQ", slug: "epq" },
      ];

  // All subjects have consistent styling with hover effects
  const getSubjectStyle = (subject: any) => {
    return "flex items-center px-[13px] py-[9px] rounded bg-white text-primary hover:bg-primary hover:text-white transition-colors duration-200";
  };

  const getSubjectHref = (subject: any) => {
    // If it's a Sanity subject object, use the slug directly
    if (typeof subject === 'object' && subject.slug) {
      return `/${subject.slug}`;
    }
    
    // Otherwise handle legacy string subjects
    const subjectName = typeof subject === 'string' ? subject : subject.name;
    const matchedSubject = subjects?.find(
      (s) => s.subject.toLowerCase() === subjectName.toLowerCase(),
    );
    return matchedSubject
      ? `/${matchedSubject.slug.current}`
      : `/${subjectName.toLowerCase().replace(/\s+/g, "-")}`;
  };

  return (
    <section className="relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      {/* Container with optimized design dimensions and styling */}
      <div className="relative max-w-[1386px] mx-auto min-h-[316px]">
        {/* Background with dynamic color and border radius */}
        <div className="absolute inset-0 rounded-[21px]" style={{ backgroundColor }}>

          {/* Content container with responsive padding */}
          <div className="relative z-10 px-[25px] py-[34px] sm:px-[50px] lg:px-[63px] lg:py-[44px]">
            {/* Header section */}
            <div className="mb-[34px] lg:mb-[46px]">
              <h2 className="font-gilroy text-[21px] sm:text-[25px] font-medium leading-[120%] text-textDark mb-[13px]" style={{ fontWeight: 500 }}>
                {sectionTitle}
              </h2>
              <p 
                className={`font-gilroy text-[15px] sm:text-[17px] font-light leading-[140%] text-textDark ${splitDescription ? 'max-w-[525px]' : 'max-w-[714px]'}`} 
                style={{ fontWeight: 300 }}
              >
                {sectionDescription}
              </p>
            </div>

            {/* Subjects container */}
            <div className="relative">
              {/* Subjects grid with more even distribution */}
              <div className="flex flex-wrap items-start justify-start gap-x-[17px] gap-y-[13px] max-w-full lg:max-w-[1260px]">
                {displaySubjects.map((subject: any, index: number) => {
                  const subjectName = typeof subject === 'string' ? subject : subject.name;
                  const subjectKey = typeof subject === 'string' ? subject : `${subject.name}-${index}`;
                  
                  return (
                    <Link
                      key={subjectKey}
                      href={getSubjectHref(subject)}
                      className={getSubjectStyle(subject)}
                    >
                      <span className="font-gilroy text-[15px] font-light leading-[140%] whitespace-nowrap" style={{ fontWeight: 300 }}>
                        {subjectName}
                      </span>
                    </Link>
                  );
                })}
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubjectGrid;
