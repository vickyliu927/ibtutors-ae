import React from 'react';
import { client } from '@/sanity/lib/client';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import TutorProfiles from '../components/TutorProfiles';
import TestimonialSection, { TestimonialSectionData } from '../components/TestimonialSection';
import FAQSection from '../components/FAQSection';
import FaqAccordion from '../components/FaqAccordion';
import SubjectHeroSection from '../components/SubjectHeroSection';
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
import { subjectPageFaqQueries, navbarQueries } from '../lib/cloneQueries';
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
    faqReferences: {
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
    faqReferences: {
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

/**
 * Enhanced clone-aware curriculum page data fetcher
 */
async function getCurriculumPageDataWithCloneContext(
  subject: string, 
  cloneId: string | null = null
): Promise<{ pageData: CurriculumPageData | null; testimonialSection: any | null; navbarData: any | null; type: string | null }> {
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

    const [pageData, testimonialSection, navbarResult] = await Promise.all([
      client.fetch(query, { subject }),
      client.fetch(testimonialsQuery),
      navbarQueries.fetch(cloneId || 'global')
    ]);
    
    if (!pageData) {
      console.log(`[CurriculumPage] No curriculum page found for: ${subject}`);
      return { pageData: null, testimonialSection: null, navbarData: null, type: null };
    }
    
    console.log(`[CurriculumPage] Successfully fetched curriculum page data for: ${subject}`);
    return { pageData, testimonialSection, navbarData: navbarResult?.data || null, type: 'curriculum' };
  } catch (error) {
    console.error(`[CurriculumPage] Error fetching curriculum page for ${subject}:`, error);
    return { pageData: null, testimonialSection: null, navbarData: null, type: null };
  }
}

/**
 * Enhanced clone-aware subject page data fetcher  
 */
async function getSubjectPageDataWithCloneContext(
  subject: string,
  cloneId: string | null = null
): Promise<{ pageData: SubjectPageData | null; testimonialSection: any | null; navbarData: any | null; type: string | null }> {
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
        faqSection,
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

    // Use server-side caching with Next.js and fetch clone-aware FAQ and navbar
    const [data, faqSectionResult, navbarResult] = await Promise.all([
      client.fetch(query, { subject }, { next: { revalidate: 300 } }),
      subjectPageFaqQueries.fetch(cloneId || 'global', subject),
      navbarQueries.fetch(cloneId || 'global')
    ]);

    if (!data.subjectPage) {
      console.log(`[SubjectPage] No subject page found for: ${subject}`);
      return { pageData: null, testimonialSection: null, navbarData: null, type: null };
    }

    console.log(`[SubjectPage] Found subject: ${data.subjectPage._id}, tutors: ${data.tutors.length}, FAQ source: ${faqSectionResult?.source || 'direct-reference'}`);

    // Use clone-aware FAQ section if available, otherwise fall back to direct reference
    const faqSection = faqSectionResult?.data || data.subjectPage.faqSection;

    // Combine the data
    const pageData = {
      ...data.subjectPage,
      tutorsList: data.tutors,
      faqSection: faqSection
    };

    return { 
      pageData, 
      testimonialSection: data.testimonialSection, 
      navbarData: navbarResult?.data || null,
      type: 'subject' 
    };
      } catch (error) {
      console.error(`[SubjectPage] Error fetching subject page data for ${subject}:`, error);
      return { pageData: null, testimonialSection: null, navbarData: null, type: null };
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
        {/* Navigation */}
        <Navbar navbarData={curriculumResult.navbarData} />
        
        {/* Enhanced Clone Debug Panel - Development Only */}
        <CloneIndicatorBanner {...cloneIndicatorProps} />
        
        {/* New Hero Section */}
        <SubjectHeroSection subjectSlug={params.subject} />

        {/* Tutors Section */}
        <TutorProfiles 
          tutors={curriculumResult.pageData.tutorsList} 
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
                {curriculumResult.pageData.faqSection.faqReferences &&
                  curriculumResult.pageData.faqSection.faqReferences.map((faq: any) => (
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
  const { pageData, testimonialSection, navbarData } = await getSubjectPageDataWithCloneContext(
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
      {/* Navigation */}
      <Navbar navbarData={navbarData} />
      
      {/* Enhanced Clone Debug Panel - Development Only */}
      <CloneIndicatorBanner {...cloneIndicatorProps} />
      
      {/* New Hero Section */}
      <SubjectHeroSection subjectSlug={params.subject} />

      {/* Tutors Section */}
      <TutorProfiles tutors={pageData.tutorsList} useNewCardDesign={true} />

      {/* Testimonials Section */}
      {pageData.testimonials && pageData.testimonials.length > 0 && testimonialSection && (
        <TestimonialSection 
          sectionData={testimonialSection} 
          testimonials={pageData.testimonials} 
        />
      )}

      {/* FAQ Section - Optional */}
      {pageData.faqSection && pageData.faqSection.faqReferences && pageData.faqSection.faqReferences.length > 0 && (
        <FAQSection 
          sectionData={{
            title: pageData.faqSection.title,
            subtitle: pageData.faqSection.subtitle
          }}
          faqs={pageData.faqSection.faqReferences}
        />
      )}

      <ContactForm />
      <Footer />
    </main>
  );
} 
