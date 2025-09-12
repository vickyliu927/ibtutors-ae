import React from 'react';
import { client } from '@/sanity/lib/client';
import ContactForm from '../components/ContactForm';
import TutorProfiles from '../components/TutorProfiles';
import TestimonialSection, { TestimonialSectionData } from '../components/TestimonialSection';
import FAQSection from '../components/FAQSection';
import FaqAccordion from '../components/FaqAccordion';
import SubjectHeroSection from '../components/SubjectHeroSection';
import { Metadata } from 'next';
import { getSeoData, SeoData } from '../lib/getSeoData';
import { getCurriculumHeroData } from '../lib/getCurriculumHeroData';
import { notFound, redirect, permanentRedirect } from 'next/navigation';

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
import { getCloneIdForCurrentDomain } from '../lib/sitemapUtils';

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
    tutorProfileSectionPriceDescription?: string;
    tutorProfileSectionPriceTag?: string;
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
  externalRedirectEnabled?: boolean;
  externalRedirectUrl?: string;
  externalRedirectPermanent?: boolean;
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
    tutorProfileSectionPriceDescription?: string;
    tutorProfileSectionPriceTag?: string;
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
    
    // Clone-aware curriculum page query with 3-tier fallback
    const query = `{
      "cloneSpecific": *[_type == "curriculumPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0] {
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
        seo,
        "sourceInfo": {
          "source": "cloneSpecific",
          "cloneId": $cloneId
        }
      },
      "baseline": *[_type == "curriculumPage" && slug.current == $subject && cloneReference->baselineClone == true && isActive == true][0] {
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
        seo,
        "sourceInfo": {
          "source": "baseline",
          "cloneId": cloneReference->cloneId.current
        }
      },
      "default": *[_type == "curriculumPage" && slug.current == $subject && !defined(cloneReference) && isActive == true][0] {
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
        seo,
        "sourceInfo": {
          "source": "default",
          "cloneId": null
        }
      }
    }`;

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

    const [fallbackResult, testimonialSection, navbarResult] = await Promise.all([
      client.fetch(query, { subject, cloneId: cloneId || 'none' }),
      client.fetch(testimonialsQuery),
      navbarQueries.fetch(cloneId || 'global')
    ]);
    
    // Resolve using 3-tier fallback: cloneSpecific → baseline → default
    let pageData: CurriculumPageData | null = null;
    let resolvedSource = 'none';
    
    if (fallbackResult.cloneSpecific) {
      pageData = fallbackResult.cloneSpecific;
      resolvedSource = 'cloneSpecific';
      console.log(`[CurriculumPage] Using clone-specific content for ${subject}, clone: ${cloneId}`);
    } else if (fallbackResult.baseline) {
      pageData = fallbackResult.baseline;
      resolvedSource = 'baseline';
      console.log(`[CurriculumPage] Using baseline content for ${subject}`);
    } else if (fallbackResult.default) {
      pageData = fallbackResult.default;
      resolvedSource = 'default';
      console.log(`[CurriculumPage] Using default content for ${subject}`);
    }
    
    if (!pageData) {
      console.log(`[CurriculumPage] No curriculum page found for subject: ${subject}, clone: ${cloneId || 'none'}`);
      return { pageData: null, testimonialSection: null, navbarData: null, type: null };
    }
    
    console.log(`[CurriculumPage] Successfully fetched curriculum page data for: ${subject} (source: ${resolvedSource})`);
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
): Promise<{ pageData: SubjectPageData | null; heroData: any | null; testimonialSection: any | null; navbarData: any | null; type: string | null }> {
  try {
    console.log(`[SubjectPage] Fetching data for subject: ${subject}, clone: ${cloneId || 'none'}`);
    
    // Enhanced clone-aware query with 3-tier fallback
    const query = `{
      "cloneSpecific": {
        "subjectPage": *[_type == "subjectPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0]{
          _id,
          subject,
          title,
          firstSection,
          tutorsListSectionHead,
          externalRedirectEnabled,
          externalRedirectUrl,
          externalRedirectPermanent,
          testimonials[]->{
            _id,
            reviewerName,
            reviewerType,
            testimonialText,
            rating,
            order
          },
          faqSection,
          seo,
          "sourceInfo": {
            "source": "cloneSpecific",
            "cloneId": $cloneId
          }
        },
        "heroData": *[_type == "subjectHeroSection" && subjectPage->slug.current == $subject && cloneReference->cloneId.current == $cloneId][0]{
          rating {
            score,
            basedOnText,
            reviewCount
          },
          title {
            firstPart,
            secondPart
          },
          subtitle,
          "sourceInfo": {
            "source": "cloneSpecific",
            "cloneId": $cloneId
          }
        },
        "tutors": *[_type == "tutor" && references(*[_type == "subjectPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0]._id)] | order(displayOrder asc) {
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
        }
      },
      "baseline": {
        "subjectPage": *[_type == "subjectPage" && slug.current == $subject && cloneReference->baselineClone == true && isActive == true][0]{
          _id,
          subject,
          title,
          firstSection,
          tutorsListSectionHead,
          externalRedirectEnabled,
          externalRedirectUrl,
          externalRedirectPermanent,
          testimonials[]->{
            _id,
            reviewerName,
            reviewerType,
            testimonialText,
            rating,
            order
          },
          faqSection,
          seo,
          "sourceInfo": {
            "source": "baseline",
            "cloneId": cloneReference->cloneId.current
          }
        },
        "heroData": *[_type == "subjectHeroSection" && subjectPage->slug.current == $subject && cloneReference->baselineClone == true][0]{
          rating {
            score,
            basedOnText,
            reviewCount
          },
          title {
            firstPart,
            secondPart
          },
          subtitle,
          "sourceInfo": {
            "source": "baseline",
            "cloneId": cloneReference->cloneId.current
          }
        },
        "tutors": *[_type == "tutor" && references(*[_type == "subjectPage" && slug.current == $subject && cloneReference->baselineClone == true && isActive == true][0]._id)] | order(displayOrder asc) {
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
        }
      },
      "default": {
        "subjectPage": *[_type == "subjectPage" && slug.current == $subject && !defined(cloneReference) && isActive == true][0]{
          _id,
          subject,
          title,
          firstSection,
          tutorsListSectionHead,
          externalRedirectEnabled,
          externalRedirectUrl,
          externalRedirectPermanent,
          testimonials[]->{
            _id,
            reviewerName,
            reviewerType,
            testimonialText,
            rating,
            order
          },
          faqSection,
          seo,
          "sourceInfo": {
            "source": "default",
            "cloneId": null
          }
        },
        "heroData": *[_type == "subjectHeroSection" && subjectPage->slug.current == $subject && !defined(cloneReference)][0]{
          rating {
            score,
            basedOnText,
            reviewCount
          },
          title {
            firstPart,
            secondPart
          },
          subtitle,
          "sourceInfo": {
            "source": "default",
            "cloneId": null
          }
        },
        "tutors": *[_type == "tutor" && references(*[_type == "subjectPage" && slug.current == $subject && !defined(cloneReference) && isActive == true][0]._id)] | order(displayOrder asc) {
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
        }
      },
      "testimonialSection": *[_type == "testimonialSection"][0]
    }`;

    // Use server-side caching with Next.js and fetch clone-aware FAQ and navbar
    const [fallbackResult, faqSectionResult, navbarResult] = await Promise.all([
      client.fetch(query, { subject, cloneId: cloneId || 'none' }, { next: { revalidate: 300 } }),
      subjectPageFaqQueries.fetch(cloneId || 'global', subject),
      navbarQueries.fetch(cloneId || 'global')
    ]);

    // Resolve using 3-tier fallback: cloneSpecific → baseline → default
    let resolvedData: { subjectPage: any; tutors: any[] } | null = null;
    let resolvedSource = 'none';
    
    if (fallbackResult.cloneSpecific?.subjectPage) {
      resolvedData = fallbackResult.cloneSpecific;
      resolvedSource = 'cloneSpecific';
      console.log(`[SubjectPage] Using clone-specific content for ${subject}, clone: ${cloneId}`);
    } else if (fallbackResult.baseline?.subjectPage) {
      resolvedData = fallbackResult.baseline;
      resolvedSource = 'baseline';
      console.log(`[SubjectPage] Using baseline content for ${subject}`);
    } else if (fallbackResult.default?.subjectPage) {
      resolvedData = fallbackResult.default;
      resolvedSource = 'default';
      console.log(`[SubjectPage] Using default content for ${subject}`);
    }

    if (!resolvedData?.subjectPage) {
      console.log(`[SubjectPage] No subject page found for subject: ${subject}, clone: ${cloneId || 'none'}`);
      return { pageData: null, heroData: null, testimonialSection: null, navbarData: null, type: null };
    }

    const pageData: SubjectPageData = {
      ...resolvedData.subjectPage,
      tutorsList: resolvedData.tutors || [],
      faqSection: faqSectionResult?.data || resolvedData.subjectPage.faqSection,
    };

    // Resolve hero data using same fallback logic
    let heroData = null;
    if (fallbackResult.cloneSpecific?.heroData) {
      heroData = fallbackResult.cloneSpecific.heroData;
    } else if (fallbackResult.baseline?.heroData) {
      heroData = fallbackResult.baseline.heroData;
    } else if (fallbackResult.default?.heroData) {
      heroData = fallbackResult.default.heroData;
    }

    console.log(`[SubjectPage] Successfully fetched subject page data for: ${subject} (source: ${resolvedSource})`);
    console.log(`[SubjectPage] Hero data ${heroData ? 'found' : 'not found'} for: ${subject}`);
    
    return { 
      pageData, 
      heroData,
      testimonialSection: fallbackResult.testimonialSection, 
      navbarData: navbarResult?.data || null, 
      type: 'subject' 
    };
  } catch (error) {
    console.error(`[SubjectPage] Error fetching subject page for ${subject}:`, error);
    return { pageData: null, heroData: null, testimonialSection: null, navbarData: null, type: null };
  }
}

export async function generateMetadata({ params }: { params: { subject: string } }): Promise<Metadata> {
  // Get clone-aware SEO data that will automatically detect clone from middleware headers
  const cloneSeoData = await getSeoData();
  const canonicalPath = `/${params.subject}`;
  
  // Resolve cloneId so we fetch clone-specific page SEO (matches page render logic)
  const cloneId = await getCloneIdForCurrentDomain();
  
  // Helper: extract brand from global title (last segment after '|') or fallback
  const brandFromSeo = (() => {
    const t = (cloneSeoData?.title || '').trim();
    if (!t) return 'IB Tutors';
    const parts = t.split('|').map(s => s.trim()).filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  })();
  
  // First check if it's a curriculum page
  const curriculumResult = await getCurriculumPageDataWithCloneContext(params.subject, cloneId);
  
  if (curriculumResult.pageData) {
    // BreadcrumbList JSON-LD
    const breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Curricula', item: '/curricula' },
      { '@type': 'ListItem', position: 3, name: curriculumResult.pageData.curriculum || curriculumResult.pageData.title, item: canonicalPath },
    ];

    // Build dynamic title/description that gracefully omit missing parts
    const curriculumName = curriculumResult.pageData.curriculum || curriculumResult.pageData.title || '';
    const dynamicTitle = [
      curriculumName ? `${curriculumName} Tutors` : '',
      brandFromSeo,
    ].filter(Boolean).join(' | ');
    const dynamicDescription = `${curriculumName ? `Specialist ${curriculumName} tutoring.` : 'Specialist tutoring.'} Online or in-person. Get matched today.`;

    // Prefer page-specific SEO; then dynamic template; then global fallbacks
    return {
      title: curriculumResult.pageData.seo?.pageTitle || dynamicTitle || curriculumResult.pageData.title || cloneSeoData.title,
      description: curriculumResult.pageData.seo?.description || dynamicDescription || cloneSeoData.description || `Find expert tutors${curriculumName ? ` for ${curriculumName}` : ''}.`,
      alternates: { canonical: canonicalPath },
    };
  }
  
  // If not, check if it's a subject page
  const { pageData } = await getSubjectPageDataWithCloneContext(params.subject, cloneId);

  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  // Subject branch: build dynamic, omission-friendly SEO
  const subjectName = pageData.subject || pageData.title || '';
  const dynamicTitle = [
    subjectName ? `${subjectName} Tutors` : '',
    brandFromSeo,
  ].filter(Boolean).join(' | ');
  const dynamicDescription = `${subjectName ? `Expert ${subjectName} tutoring.` : 'Expert tutoring.'} Online or in-person. Book a free call.`;

  // Prefer page-specific SEO; then dynamic template; then global fallback
  return {
    title: pageData.seo?.pageTitle || dynamicTitle || `${pageData.title} | ${brandFromSeo}`,
    description: pageData.seo?.description || dynamicDescription || cloneSeoData.description || 'Find expert tutors for your subject.',
    alternates: { canonical: canonicalPath },
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

  // If clone is homepage-only, do not resolve subject/curriculum pages at all
  if (cloneContext.clone?.homepageOnly) {
    return notFound();
  }

  // First check if it's a curriculum page
  const curriculumResult = await getCurriculumPageDataWithCloneContext(
    params.subject, 
    cloneContext.cloneId
  );
  
  if (curriculumResult.pageData) {
    // Fetch curriculum-specific hero data with clone context
    const curriculumHeroData = await getCurriculumHeroData(params.subject, cloneContext.cloneId);
    
    // Render curriculum page with clone context
    return (
      <main>
        {/* BreadcrumbList JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
                { '@type': 'ListItem', position: 2, name: 'Curricula', item: '/curricula' },
                { '@type': 'ListItem', position: 3, name: curriculumResult.pageData.curriculum || curriculumResult.pageData.title, item: `/${params.subject}` },
              ],
            }),
          }}
        />
        {/* Enhanced Clone Debug Panel - Development Only */}
        <CloneIndicatorBanner {...cloneIndicatorProps} />
        
        {/* New Hero Section - using curriculum hero data */}
        <SubjectHeroSection subjectSlug={params.subject} heroData={curriculumHeroData} />

        {/* Tutors Section */}
        <TutorProfiles 
          tutors={curriculumResult.pageData.tutorsList} 
          useNewCardDesign={true}
          sectionTitle={curriculumResult.pageData.tutorsListSectionHead?.sectionTitle}
          description={curriculumResult.pageData.tutorsListSectionHead?.description}
          tutorProfileSectionPriceDescription={curriculumResult.pageData.tutorsListSectionHead?.tutorProfileSectionPriceDescription}
          tutorProfileSectionPriceTag={curriculumResult.pageData.tutorsListSectionHead?.tutorProfileSectionPriceTag}
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
              {/* FAQPage JSON-LD */}
              {curriculumResult.pageData.faqSection.faqReferences && (
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': 'FAQPage',
                      mainEntity: curriculumResult.pageData.faqSection.faqReferences.map((faq: any) => ({
                        '@type': 'Question',
                        name: faq.question,
                        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                      })),
                    }),
                  }}
                />
              )}
            </div>
          </section>
        )}

      </main>
    );
  }
  
  // If not a curriculum page, check if it's a subject page
  const subjectResult = await getSubjectPageDataWithCloneContext(
    params.subject,
    cloneContext.cloneId
  );

  if (subjectResult.pageData) {
    // Check for external redirect override
    if (subjectResult.pageData.externalRedirectEnabled && subjectResult.pageData.externalRedirectUrl) {
      const targetUrl = subjectResult.pageData.externalRedirectUrl;
      if (subjectResult.pageData.externalRedirectPermanent) {
        permanentRedirect(targetUrl);
      } else {
        redirect(targetUrl);
      }
    }
    // Debug what data we're working with
    console.log(`[SubjectPageRender] Rendering subject page for: ${params.subject}`);
    console.log(`[SubjectPageRender] Clone ID: ${cloneContext.cloneId}`);
    console.log(`[SubjectPageRender] Clone Name: ${cloneContext.clone?.cloneName}`);
    console.log(`[SubjectPageRender] Tutors Section Title: ${subjectResult.pageData.tutorsListSectionHead?.sectionTitle}`);
    console.log(`[SubjectPageRender] Tutors Section Description: ${subjectResult.pageData.tutorsListSectionHead?.description?.substring(0, 80)}...`);
    console.log(`[SubjectPageRender] Hero Data: ${subjectResult.heroData ? 'Present' : 'Missing'}`);
    
    // Render subject page with clone context
    return (
      <main>
        {/* BreadcrumbList JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
                { '@type': 'ListItem', position: 2, name: 'Subjects', item: '/subjects' },
                { '@type': 'ListItem', position: 3, name: subjectResult.pageData.subject || subjectResult.pageData.title, item: `/${params.subject}` },
              ],
            }),
          }}
        />
        {/* Enhanced Clone Debug Panel - Development Only */}
        <CloneIndicatorBanner {...cloneIndicatorProps} />
        
        {/* New Hero Section */}
        <SubjectHeroSection 
          subjectSlug={params.subject} 
          heroData={subjectResult.heroData}
          key={`hero-${cloneContext.cloneId}-${params.subject}`} // Force re-render when clone changes
        />

        {/* Tutors Section */}
        <TutorProfiles 
          tutors={subjectResult.pageData.tutorsList} 
          useNewCardDesign={true}
          sectionTitle={subjectResult.pageData.tutorsListSectionHead?.sectionTitle}
          description={subjectResult.pageData.tutorsListSectionHead?.description}
          tutorProfileSectionPriceDescription={subjectResult.pageData.tutorsListSectionHead?.tutorProfileSectionPriceDescription}
          tutorProfileSectionPriceTag={subjectResult.pageData.tutorsListSectionHead?.tutorProfileSectionPriceTag}
        />

        {/* Testimonials Section */}
        {subjectResult.pageData.testimonials && subjectResult.testimonialSection && (
          <TestimonialSection 
            sectionData={subjectResult.testimonialSection} 
            testimonials={subjectResult.pageData.testimonials} 
          />
        )}

        {/* FAQ Section - Optional */}
        {subjectResult.pageData.faqSection && subjectResult.pageData.faqSection.faqReferences && subjectResult.pageData.faqSection.faqReferences.length > 0 && (
          <FAQSection 
            sectionData={{
              title: subjectResult.pageData.faqSection.title,
              subtitle: subjectResult.pageData.faqSection.subtitle
            }}
            faqs={subjectResult.pageData.faqSection.faqReferences}
          />
        )}

        {/* FAQPage JSON-LD */}
        {subjectResult.pageData.faqSection && subjectResult.pageData.faqSection.faqReferences && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: subjectResult.pageData.faqSection.faqReferences.map((faq: any) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                })),
              }),
            }}
          />
        )}

        <ContactForm />
      </main>
    );
  }

  // Handle 404 case
  return notFound();
} 
