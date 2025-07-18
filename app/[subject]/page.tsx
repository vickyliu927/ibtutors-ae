import React from 'react';
import { client } from '@/sanity/lib/client';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import TutorProfiles from '../components/TutorProfiles';
import TestimonialSection, { TestimonialSectionData } from '../components/TestimonialSection';
import FAQSection from '../components/FAQSection';
import FaqAccordion from '../components/FaqAccordion';
import { Metadata } from 'next';
import { getSeoData, SeoData } from '../lib/getSeoData';
import { notFound } from 'next/navigation';

// Import enhanced clone-aware utilities
import { 
  getCloneAwarePageData, 
  resolveContentSafely, 
  CloneAwarePageData,
  getCloneIndicatorData,
  mergeCloneContent
} from '../lib/clonePageUtils';
import CloneIndicatorBanner from '../components/CloneIndicatorBanner';

// Disable static page generation and enable revalidation
export const revalidate = 0;

// Generate static params for common subjects at build time
export async function generateStaticParams() {
  // Get all subject and curriculum slugs
  const subjectQuery = `*[_type == "subjectPage"].slug.current`;
  const curriculumQuery = `*[_type == "curriculumPage"].slug.current`;
  
  const subjectSlugs = await client.fetch<string[]>(subjectQuery);
  const curriculumSlugs = await client.fetch<string[]>(curriculumQuery);
  
  // Combine both types of slugs
  const allSlugs = [...subjectSlugs, ...curriculumSlugs];
  
  return allSlugs.map((subject) => ({
    subject,
  }));
}

interface SubjectPageData {
  subject: string;
  title: string;
  firstSection: {
    title: string;
    highlightedWords?: string[];
    description: string;
  };
  tutorsListSectionHead?: {
    smallTextBeforeTitle?: string;
    sectionTitle?: string;
    description?: string;
    ctaLinkText?: string;
    ctaLink?: string;
  };
  tutorsList: any[];
  testimonials: any[];
  faqSection?: {
    _id: string;
    title: string;
    subtitle?: string;
    faqs: {
      _id: string;
      question: string;
      answer: string;
      displayOrder: number;
    }[];
  };
  seo: {
    pageTitle: string;
    description: string;
  };
}

interface CurriculumPageData {
  curriculum: string;
  title: string;
  firstSection: {
    title: string;
    highlightedWords?: string[];
    description: string;
  };
  tutorsListSectionHead?: {
    smallTextBeforeTitle?: string;
    sectionTitle?: string;
    description?: string;
    ctaLinkText?: string;
    ctaLink?: string;
  };
  tutorsList: any[];
  testimonials: any[];
  faqSection?: {
    _id: string;
    title: string;
    subtitle?: string;
    faqs: {
      _id: string;
      question: string;
      answer: string;
    }[];
  };
  seo: {
    pageTitle: string;
    description: string;
  };
}

/**
 * Enhanced clone-aware curriculum page data fetcher
 */
async function getCurriculumPageDataWithCloneContext(
  subject: string, 
  cloneId: string | null = null
): Promise<{ pageData: CurriculumPageData | null; testimonialSection: any | null; type: string | null }> {
  try {
    console.log(`[CurriculumPage] Fetching data for subject: ${subject}, clone: ${cloneId || 'none'}`);
    
    // Base curriculum page query - this can be enhanced to support clone-specific curriculum pages in the future
    const query = `
      *[_type == "curriculumPage" && slug.current == $subject][0] {
        title,
        curriculum,
        slug,
        firstSection,
        tutorsListSectionHead,
        tutorsList[] -> {
          _id,
          name,
          slug,
          profilePhoto,
          professionalTitle,
          experience,
          specialization,
          hireButtonLink,
          price,
          rating,
          reviewCount,
          activeStudents,
          totalLessons,
          languagesSpoken,
          profilePDF
        },
        testimonials[] -> {
          _id,
          reviewerName,
          reviewerType,
          testimonialText,
          rating,
          order
        },
        faqSection -> {
          title,
          subtitle,
          faqs[] -> {
            _id,
            question,
            answer
          }
        },
        seo
      }
    `;

    // Enhanced testimonial section query with clone support
    const testimonialsQuery = `
      *[_type == "testimonialSection"][0] {
        maxDisplayCount,
        rating,
        subtitle,
        totalReviews,
        tutorChaseLink
      }
    `;

    const [pageData, testimonialSection] = await Promise.all([
      client.fetch(query, { subject }),
      client.fetch(testimonialsQuery)
    ]);
    
    if (!pageData) {
      console.log(`[CurriculumPage] No curriculum page found for: ${subject}`);
      return { pageData: null, testimonialSection: null, type: null };
    }
    
    console.log(`[CurriculumPage] Successfully fetched curriculum page data for: ${subject}`);
    return { pageData, testimonialSection, type: 'curriculum' };
  } catch (error) {
    console.error(`[CurriculumPage] Error fetching curriculum page for ${subject}:`, error);
    return { pageData: null, testimonialSection: null, type: null };
  }
}

/**
 * Enhanced clone-aware subject page data fetcher  
 */
async function getSubjectPageDataWithCloneContext(
  subject: string,
  cloneId: string | null = null
): Promise<{ pageData: SubjectPageData | null; testimonialSection: any | null; type: string | null }> {
  try {
    console.log(`[SubjectPage] Fetching data for subject: ${subject}, clone: ${cloneId || 'none'}`);
    
    // Enhanced query that can support clone-specific content in the future
    const query = `{
      "subjectPage": *[_type == "subjectPage" && slug.current == $subject][0]{
        _id,
        subject,
        title,
        firstSection,
        tutorsListSectionHead,
        testimonials[]->{
          _id,
          reviewerName,
          reviewerType,
          testimonialText,
          rating,
          order
        },
        "faqSection": faqSection->{
          _id,
          title,
          subtitle,
          "faqs": faqReferences[]-> {
            _id,
            question,
            answer,
            displayOrder
          } | order(displayOrder asc)
        },
        seo
      },
      "tutors": *[_type == "tutor" && references(*[_type == "subjectPage" && slug.current == $subject][0]._id)] | order(displayOrder asc) {
        _id,
        name,
        professionalTitle,
        priceTag {
          enabled,
          badgeText
        },
        experience,
        profilePhoto,
        specialization,
        hireButtonLink,
        displayOnSubjectPages,
        displayOrder,
        profilePDF {
          asset-> {
            url
          }
        },
        price,
        rating,
        reviewCount,
        activeStudents,
        totalLessons,
        languagesSpoken
      },
      "testimonialSection": *[_type == "testimonialSection"][0]
    }`;

    // Use server-side caching with Next.js
    const data = await client.fetch(query, { subject }, { next: { revalidate: 300 } });

    if (!data.subjectPage) {
      console.log(`[SubjectPage] No subject page found for: ${subject}`);
      return { pageData: null, testimonialSection: null, type: null };
    }

    console.log(`[SubjectPage] Found subject: ${data.subjectPage._id}, tutors: ${data.tutors.length}`);

    // Combine the data
    const pageData = {
      ...data.subjectPage,
      tutorsList: data.tutors
    };

    return { pageData, testimonialSection: data.testimonialSection, type: 'subject' };
  } catch (error) {
    console.error(`[SubjectPage] Error fetching subject page data for ${subject}:`, error);
    return { pageData: null, testimonialSection: null, type: null };
  }
}

export async function generateMetadata({ params }: { params: { subject: string } }): Promise<Metadata> {
  // First check if it's a curriculum page
  const curriculumResult = await getCurriculumPageDataWithCloneContext(params.subject);
  
  if (curriculumResult.pageData) {
    return {
      title: curriculumResult.pageData.seo?.pageTitle || curriculumResult.pageData.title,
      description: curriculumResult.pageData.seo?.description || `Find expert tutors for ${curriculumResult.pageData.curriculum} in Dubai.`,
    };
  }
  
  // If not, check if it's a subject page
  const { pageData } = await getSubjectPageDataWithCloneContext(params.subject);
  const subjectSeo = await getSeoData();

  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  // Use the page-specific SEO data, falling back to the default subject SEO data
  return {
    title: pageData.seo.pageTitle || `${pageData.title} | IB Tutors UAE`,
    description: pageData.seo.description || subjectSeo.description,
  };
}

export default async function DynamicPage({ 
  params, 
  searchParams 
}: { 
  params: { subject: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Convert searchParams to URLSearchParams for clone detection
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (typeof value === 'string') {
      urlSearchParams.set(key, value);
    } else if (Array.isArray(value)) {
      urlSearchParams.set(key, value[0] || '');
    }
  });

  // Get enhanced clone-aware data for the page
  const { cloneContext, cloneData, debugInfo } = await getCloneAwarePageData(
    urlSearchParams,
    async (cloneId: string | null) => null, // We'll handle page data separately
    `Subject: ${params.subject}`
  );

  // Generate clone indicator props
  const cloneIndicatorProps = getCloneIndicatorData(
    cloneContext,
    cloneData,
    debugInfo,
    `Subject: ${params.subject}`
  );

  // First check if it's a curriculum page
  const curriculumResult = await getCurriculumPageDataWithCloneContext(
    params.subject, 
    cloneContext.cloneId
  );
  
  if (curriculumResult.pageData) {
    // Render curriculum page with clone context
    return (
      <main>
        {/* Enhanced Clone Debug Panel - Development Only */}
        <CloneIndicatorBanner {...cloneIndicatorProps} />
        <Navbar />
        
        {/* First Section */}
        <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stars and Reviews */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-7 w-7 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.934L4.618 19.098l1.039-6.054L1.314 8.902l6.068-.881L10 2.666l2.618 5.355 6.068.881-4.343 4.142 1.039 6.054L10 15.934z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <div className="text-xl font-medium">
                4.92/5 based on <span className="font-bold">480 reviews</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
                {curriculumResult.pageData?.firstSection.title.split(" ").map((word: string, index: number) => {
                  const shouldHighlight = curriculumResult.pageData?.firstSection.highlightedWords?.includes(word);
                  return (
                    <span
                      key={index}
                      className={shouldHighlight ? "text-blue-800" : ""}
                    >
                      {word}{" "}
                    </span>
                  );
                })}
              </h1>
              <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
                {curriculumResult.pageData?.firstSection.description}
              </p>
            </div>
          </div>
        </section>

        {/* Tutors Section */}
        <TutorProfiles 
          tutors={curriculumResult.pageData.tutorsList} 
          sectionTitle={curriculumResult.pageData.tutorsListSectionHead?.sectionTitle}
          sectionSubtitle={curriculumResult.pageData.tutorsListSectionHead?.description}
          ctaText={curriculumResult.pageData.tutorsListSectionHead?.ctaLinkText}
          ctaLink={curriculumResult.pageData.tutorsListSectionHead?.ctaLink}
          useNewCardDesign={true}
        />

        {/* Testimonials Section */}
        {curriculumResult.pageData.testimonials && curriculumResult.testimonialSection && (
          <TestimonialSection
            sectionData={{
              rating: curriculumResult.testimonialSection.rating,
              totalReviews: curriculumResult.testimonialSection.totalReviews,
              subtitle: curriculumResult.testimonialSection.subtitle,
              tutorChaseLink: curriculumResult.testimonialSection.tutorChaseLink,
              maxDisplayCount: curriculumResult.testimonialSection.maxDisplayCount
            }} 
            testimonials={curriculumResult.pageData.testimonials}
          />
        )}

        {/* Contact Form */}
        <ContactForm />

        {/* FAQ Section */}
        {curriculumResult.pageData.faqSection && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  {curriculumResult.pageData.faqSection.title}
                </h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  {curriculumResult.pageData.faqSection.subtitle}
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                {curriculumResult.pageData.faqSection.faqs &&
                  curriculumResult.pageData.faqSection.faqs.map((faq: any) => (
                    <FaqAccordion 
                      key={faq._id} 
                      question={faq.question} 
                      answer={faq.answer} 
                    />
                  ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    );
  }
  
  // If not a curriculum page, check if it's a subject page
  const { pageData, testimonialSection } = await getSubjectPageDataWithCloneContext(
    params.subject,
    cloneContext.cloneId
  );

  if (!pageData) {
    // Handle 404 case
    return notFound();
  }

  // Render subject page with clone context
  return (
    <main>
      {/* Enhanced Clone Debug Panel - Development Only */}
      <CloneIndicatorBanner {...cloneIndicatorProps} />
      <Navbar />
      
      {/* First Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stars and Reviews */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="h-7 w-7 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15.934L4.618 19.098l1.039-6.054L1.314 8.902l6.068-.881L10 2.666l2.618 5.355 6.068.881-4.343 4.142 1.039 6.054L10 15.934z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
            <div className="text-xl font-medium">
              4.92/5 based on <span className="font-bold">480 reviews</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-8 text-center">
            {pageData.firstSection.title.split(' ').map((word: string, index: number) => (
              <React.Fragment key={index}>
                <span className={
                  pageData.firstSection.highlightedWords?.includes(word) 
                    ? "text-blue-800" 
                    : ""
                }>
                  {word}
                </span>{" "}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-xl text-gray-600 text-center">{pageData.firstSection.description}</p>
        </div>
      </section>

      {/* Tutors Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {pageData.tutorsListSectionHead?.smallTextBeforeTitle && (
            <p className="text-sm text-gray-500 mb-2">
              {pageData.tutorsListSectionHead.smallTextBeforeTitle}
            </p>
          )}
          
          {pageData.tutorsListSectionHead?.sectionTitle && (
            <h2 className="text-3xl font-bold mb-4">
              {pageData.tutorsListSectionHead.sectionTitle}
            </h2>
          )}
          
          {pageData.tutorsListSectionHead?.description && (
            <p className="text-gray-600 mb-8">
              {pageData.tutorsListSectionHead.description}
            </p>
          )}

          {pageData.tutorsListSectionHead?.ctaLinkText && pageData.tutorsListSectionHead?.ctaLink && (
            <p className="text-orange-500 hover:text-orange-600 mb-8">
              <a 
                href={pageData.tutorsListSectionHead.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
              >
                {pageData.tutorsListSectionHead.ctaLinkText}
              </a>
            </p>
          )}

          <TutorProfiles tutors={pageData.tutorsList} useNewCardDesign={true} />
        </div>
      </section>

      {/* Testimonials Section */}
      {pageData.testimonials && pageData.testimonials.length > 0 && testimonialSection && (
        <TestimonialSection 
          sectionData={testimonialSection} 
          testimonials={pageData.testimonials} 
        />
      )}

      {/* FAQ Section - Optional */}
      {pageData.faqSection && pageData.faqSection.faqs && pageData.faqSection.faqs.length > 0 && (
        <FAQSection 
          sectionData={{
            title: pageData.faqSection.title,
            subtitle: pageData.faqSection.subtitle
          }}
          faqs={pageData.faqSection.faqs}
        />
      )}

      <ContactForm />
      <Footer />
    </main>
  );
} 