import React from "react";
import Link from "next/link";
import { getSubjectGridData } from "../lib/getSubjectGridData";

interface SubjectGridProps {
  sectionData?: any;
}

const SubjectGrid = async ({ sectionData }: SubjectGridProps) => {
  // Prefer clone-only subjects when the schema asks to hide when none exist
  const cloneOnly = sectionData?.hideWhenNoSubjects === true;
  const subjects = await getSubjectGridData(undefined, { cloneOnly });

  // Use Sanity data when available, otherwise fall back to static list
  const sectionTitle = sectionData?.title || "Popular IB Subjects";
  const sectionDescription = sectionData?.description || "Our team of specialist tutors are here to help you excel all areas. Take a closer look at our expert tutors for each A-Level subject.";
  const splitDescription = sectionData?.splitDescription || false;
  const backgroundColor = sectionData?.backgroundColor || "#f2f4fa";

  // Filter subject grid to only include subjects that actually have live pages
  const availableSlugs = new Set((subjects || []).map((s: any) => s?.slug?.current).filter(Boolean));

  // Sanity-configured subject chips (optional) → filter to those that exist as pages
  const sanitySubjects = (sectionData?.subjects || [])
    .filter((s: any) => s && s.enabled !== false)
    .filter((s: any) => {
      // If explicit URL is provided, allow it without page existence check
      if (s.url) return true;
      const slug = typeof s.slug === 'string' ? s.slug : s.slug?.current;
      return slug ? availableSlugs.has(slug) : false;
    });

  // If the section specifies subjects and at least one exists, use them (sorted)
  // Otherwise, build the grid from the actual subject pages fetched for this clone
  const displaySubjects = sanitySubjects.length > 0
    ? sanitySubjects.sort((a: any, b: any) => (a.displayOrder || 100) - (b.displayOrder || 100))
    : (subjects || [])
        .sort((a: any, b: any) => (a.displayOrder || 100) - (b.displayOrder || 100))
        .map((s: any) => ({ name: s.subject || s.title, slug: s.slug.current }));

  // If requested, hide the entire section when no clone-specific subjects exist and there are no configured subjects
  if (cloneOnly && sanitySubjects.length === 0 && (subjects?.length || 0) === 0) {
    return null;
  }

  // All subjects have consistent styling with hover effects and responsive padding
  const getSubjectStyle = (subject: any) => {
    return "flex items-center px-[10px] py-[7px] sm:px-[12px] sm:py-[8px] lg:px-[13px] lg:py-[9px] rounded bg-white text-primary hover:bg-primary hover:text-white transition-colors duration-200";
  };

  const getSubjectHref = (subject: any) => {
    // Prefer explicit URL when present
    if (typeof subject === 'object' && subject.url) {
      return subject.url;
    }
    // Backward compatibility: if a slug is present, build from it
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
      {/* Container with truly dynamic height based on content */}
      <div className="relative max-w-[1386px] mx-auto">
        {/* Background with dynamic color and border radius - follows content height */}
        <div className="rounded-[21px]" style={{ backgroundColor }}>

          {/* Content container with responsive padding */}
          <div className="px-[25px] py-[34px] sm:px-[50px] lg:px-[63px] lg:py-[44px]">
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
              {/* Subjects grid with responsive gaps and better mobile layout */}
              <div className="flex flex-wrap items-start justify-start gap-x-[12px] gap-y-[10px] sm:gap-x-[15px] sm:gap-y-[12px] lg:gap-x-[17px] lg:gap-y-[13px] max-w-full lg:max-w-[1260px]">
                {displaySubjects.map((subject: any, index: number) => {
                  const subjectName = typeof subject === 'string' ? subject : subject.name;
                  const subjectKey = typeof subject === 'string' ? subject : `${subject.name}-${index}`;
                  
                  return (
                  <Link
                      key={subjectKey}
                    href={getSubjectHref(subject)}
                      className={getSubjectStyle(subject)}
                  >
                      <span className="font-gilroy text-[13px] sm:text-[14px] lg:text-[15px] font-light leading-[140%] whitespace-nowrap" style={{ fontWeight: 300 }}>
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
