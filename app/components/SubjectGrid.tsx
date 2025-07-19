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
    return "flex items-center px-3 py-2 rounded bg-white text-primary hover:bg-primary hover:text-white transition-colors duration-200";
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
      <div className="relative max-w-[1320px] mx-auto min-h-[301px]">
        {/* Background with dynamic color and border radius */}
        <div className="absolute inset-0 rounded-[20px]" style={{ backgroundColor }}>

          {/* Content container with responsive padding */}
          <div className="relative z-10 px-6 py-8 sm:px-12 lg:px-[60px] lg:py-[42px]">
            {/* Header section */}
            <div className="mb-8 lg:mb-[44px]">
              <h2 className="font-gilroy text-xl sm:text-2xl font-medium leading-[120%] text-textDark mb-3" style={{ fontWeight: 500 }}>
                {sectionTitle}
              </h2>
              <p 
                className={`font-gilroy text-sm sm:text-base font-light leading-[140%] text-textDark ${splitDescription ? 'max-w-[500px]' : 'max-w-[680px]'}`} 
                style={{ fontWeight: 300 }}
              >
                {sectionDescription}
              </p>
            </div>

            {/* Subjects container */}
            <div className="relative">
              {/* Subjects grid with more even distribution */}
              <div className="flex flex-wrap items-start justify-start gap-x-4 gap-y-3 max-w-full lg:max-w-[1200px]">
                {displaySubjects.map((subject: any, index: number) => {
                  const subjectName = typeof subject === 'string' ? subject : subject.name;
                  const subjectKey = typeof subject === 'string' ? subject : `${subject.name}-${index}`;
                  
                  return (
                    <Link
                      key={subjectKey}
                      href={getSubjectHref(subject)}
                      className={getSubjectStyle(subject)}
                    >
                      <span className="font-gilroy text-sm font-light leading-[140%] whitespace-nowrap" style={{ fontWeight: 300 }}>
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
