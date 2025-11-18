import React from "react";
import type { Metadata } from "next";
import HeroSection, { HeroData } from "./components/HeroSection";
import AdvertBlock from "./components/AdvertBlock";
import TutorProfiles, { TutorData } from "./components/TutorProfiles";
import SubjectGrid from "./components/SubjectGrid";
import TutoringPlatformBanner, {
  PlatformBannerData,
} from "./components/TutoringPlatformBanner";
import {
  TestimonialData,
  TestimonialSectionData,
} from "./components/TestimonialSection";

import TrustedInstitutionsBanner from "./components/TrustedInstitutionsBanner";
import FAQSection from "./components/FAQSection";
import PostTutorMidSection from "./components/PostTutorMidSection";

// Import lazy-loaded components
import {
  LazyContactForm,
  LazyTestimonialSection,
} from "./components/LazyComponents";
import HighlightsSection, {
  HighlightItem,
} from "./components/HighlightsSection";
import LessonStructure from "./components/LessonStructure";

// Import enhanced clone-aware utilities
import {
  getCloneAwarePageData,
  resolveContentSafely,
  CloneAwarePageData,
  getCloneIndicatorData,
} from "./lib/clonePageUtils";
import { getHomepageContentForCurrentDomain } from "./lib/cloneContentManager";
import { cloneQueryUtils, homepageQueries } from "./lib/cloneQueries";
import CloneIndicatorBanner from "./components/CloneIndicatorBanner";
import { notFound } from "next/navigation";
import { shouldRenderHomepage } from "./lib/homepageStrict";

/**
 * Multi-Domain Data Fetching Strategy
 *
 * This website implements a clone-aware data fetching approach with several optimizations:
 *
 * 1. Domain Detection: Automatically detects the current domain and maps to clone configuration
 * 2. 3-Tier Fallback: cloneSpecific → baseline → default content hierarchy
 * 3. Server Components: All data fetching happens on the server side
 * 4. Parallel Queries: All content queries run in parallel for maximum performance
 * 5. Source Tracking: Every piece of content includes metadata about resolution source
 * 6. Customizations: Clone-specific content can override base content fields
 *
 * This approach enables multiple domains to share infrastructure while serving unique content.
 */

// Set revalidation time to 10 minutes (600 seconds)
export const revalidate = 600;

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: '/',
    },
  };
}

// Enhanced homepage data interface
interface HomepageData {
  heroData: any | null;
  highlightsSection: any | null;
  subjectGridSection: any | null;
  advertBlockSection: any | null;
  postTutorMidSection: any | null;
  trustedInstitutionsBanner: any | null;
  tutorProfilesSection: any | null;
  platformBanner: any | null;
  testimonialSection: any | null;
  testimonials: any[];
  faqSection: any | null;
}

/**
 * Enhanced clone-aware homepage data fetcher
 */
async function getHomepageDataWithCloneContext(
  searchParams?: URLSearchParams,
): Promise<CloneAwarePageData<HomepageData>> {
  // Use the enhanced clone-aware page data fetcher
  return await getCloneAwarePageData(
    searchParams,
    async (cloneId: string | null) => {
      try {
        console.log("Fetching homepage content with clone context...");

        // Prefer the detected cloneId from headers/URL if available;
        // fall back to domain-based manager otherwise.
        const content = cloneId
          ? await homepageQueries.fetchAll(cloneId)
          : await getHomepageContentForCurrentDomain();

        // Strict requirement: for clone requests, homepage must be clone-specific (no fallbacks)
        if (!shouldRenderHomepage(cloneId, content)) {
          // Return null so caller can trigger 404
          return null;
        }

        // Extract data from ContentResult objects and apply customizations
        const heroData = content.hero.data
          ? cloneQueryUtils.getContentWithCustomizations(content.hero)
          : null;

        const highlightsSection = content.highlights.data
          ? cloneQueryUtils.getContentWithCustomizations(content.highlights)
          : null;

        const subjectGridSection = content.subjectGridSection.data
          ? cloneQueryUtils.getContentWithCustomizations(
              content.subjectGridSection,
            )
          : null;

        const advertBlockSection = content.advertBlockSection.data
          ? cloneQueryUtils.getContentWithCustomizations(
              content.advertBlockSection,
            )
          : null;

        const postTutorMidSection = content.postTutorMidSection?.data
          ? cloneQueryUtils.getContentWithCustomizations(
              content.postTutorMidSection,
            )
          : null;

        const trustedInstitutionsBanner = content.trustedInstitutions.data
          ? cloneQueryUtils.getContentWithCustomizations(
              content.trustedInstitutions,
            )
          : null;

        const tutorProfilesSection = content.tutorProfilesSection.data
          ? cloneQueryUtils.getContentWithCustomizations(
              content.tutorProfilesSection,
            )
          : null;

        const platformBanner = content.platformBanner.data
          ? cloneQueryUtils.getContentWithCustomizations(content.platformBanner)
          : null;

        const testimonialSection = content.testimonialSection.data
          ? cloneQueryUtils.getContentWithCustomizations(
              content.testimonialSection,
            )
          : null;

        const faqSection = content.faqSection.data
          ? cloneQueryUtils.getContentWithCustomizations(content.faqSection)
          : null;

        // Arrays are handled differently - we get the actual array data
        const tutors = content.tutors.data || [];
        const testimonials = content.testimonials.data || [];

        // Transform tutorProfilesSection to include tutors data (maintaining backward compatibility)
        const tutorProfilesSectionWithTutors = tutorProfilesSection
          ? {
              ...tutorProfilesSection,
              tutors: tutors, // Add the tutors array for component compatibility
            }
          : null;

        console.log("Clone-aware homepage data processed successfully");

        return {
          heroData,
          highlightsSection,
          subjectGridSection,
          advertBlockSection,
          postTutorMidSection,
          trustedInstitutionsBanner,
          tutorProfilesSection: tutorProfilesSectionWithTutors,
          platformBanner,
          testimonialSection,
          testimonials,
          faqSection,
        };
      } catch (error) {
        console.error("Error fetching homepage content:", error);
        // Return default/empty values instead of throwing
        return {
          heroData: null,
          highlightsSection: null,
          subjectGridSection: null,
          advertBlockSection: null,
          postTutorMidSection: null,
          trustedInstitutionsBanner: null,
          tutorProfilesSection: null,
          platformBanner: null,
          testimonialSection: null,
          testimonials: [],
          faqSection: null,
        };
      }
    },
    "Homepage",
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Convert searchParams to URLSearchParams
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearchParams.set(key, value);
    } else if (Array.isArray(value)) {
      urlSearchParams.set(key, value[0] || "");
    }
  });

  // Get enhanced clone-aware data
  const { pageData, cloneData, cloneContext, debugInfo } =
    await getHomepageDataWithCloneContext(urlSearchParams);

  // If this is a clone request and no clone-specific homepage content, 404
  if (cloneContext.cloneId && !pageData) {
    return notFound();
  }

  // Extract homepage data with fallback
  const {
    heroData,
    highlightsSection,
    subjectGridSection,
    advertBlockSection,
    postTutorMidSection,
    trustedInstitutionsBanner,
    tutorProfilesSection,
    platformBanner,
    testimonialSection,
    testimonials,
    faqSection,
  } = pageData || {
    heroData: null,
    highlightsSection: null,
    subjectGridSection: null,
    advertBlockSection: null,
    trustedInstitutionsBanner: null,
    tutorProfilesSection: null,
    platformBanner: null,
    testimonialSection: null,
    testimonials: [],
    faqSection: null,
  };

  // Generate clone indicator props
  const cloneIndicatorProps = getCloneIndicatorData(
    cloneContext,
    cloneData,
    debugInfo,
    "Homepage",
  );

  return (
    <main className="min-h-screen">
      {/* FAQPage JSON-LD when FAQ data exists */}
      {faqSection && faqSection.faqReferences && faqSection.faqReferences.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqSection.faqReferences.map((faq: any) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: Array.isArray(faq.answer)
                    ? faq.answer.map((block: any) => {
                        if (block?._type === 'block' && Array.isArray(block.children)) {
                          return block.children.map((c: any) => c.text).join('');
                        }
                        return '';
                      }).join('\n')
                    : faq.answer,
                },
              })),
            }),
          }}
        />
      ) : null}
      {/* Hero Section */}
      {heroData && <HeroSection heroData={heroData} />}

      {highlightsSection?.highlights ? (
        <HighlightsSection highlights={highlightsSection.highlights} />
      ) : null}
      {tutorProfilesSection ? (
        <TutorProfiles
          tutors={tutorProfilesSection.tutors}
          sectionTitle={tutorProfilesSection.title}
          sectionSubtitle={tutorProfilesSection.subtitle}
          trustedByText={tutorProfilesSection.trustedByText}
          description={tutorProfilesSection.description}
          contactText={tutorProfilesSection.contactText}
          ctaRichText={tutorProfilesSection.ctaRichText}
          ctaText={tutorProfilesSection.ctaText}
          ctaLink={tutorProfilesSection.ctaLink}
          tutorProfileSectionPriceDescription={tutorProfilesSection.tutorProfileSectionPriceDescription}
          tutorProfileSectionPriceTag={tutorProfilesSection.tutorProfileSectionPriceTag}
          useNewCardDesign={true}
        />
      ) : null}

      {/* Mid Section - Positioned after TutorProfiles and before Trusted Institutions */}
      {postTutorMidSection?.enabled !== false && postTutorMidSection ? (
        <PostTutorMidSection data={postTutorMidSection} />
      ) : null}

      {/* Trusted Institutions Banner - Now positioned after TutorProfiles */}
      {trustedInstitutionsBanner?.enabled !== false &&
      trustedInstitutionsBanner.institutions?.length > 0 ? (
        <TrustedInstitutionsBanner
          title={trustedInstitutionsBanner.title}
          subtitle={trustedInstitutionsBanner.subtitle}
          institutions={trustedInstitutionsBanner.institutions}
          backgroundColor={trustedInstitutionsBanner.backgroundColor}
          carouselSpeed={trustedInstitutionsBanner.carouselSpeed}
          showDebug={urlSearchParams.get('debug') === '1'}
          debug={{
            source: cloneData?.trustedInstitutions?.source || null,
            cloneId: cloneContext?.cloneId || cloneData?.cloneMetadata?.cloneId,
            count: trustedInstitutionsBanner.institutions?.length,
          }}
        />
      ) : null}

      {subjectGridSection?.enabled !== false ? (
        <SubjectGrid sectionData={subjectGridSection} />
      ) : null}

      {/* Lesson Structure Section */}
      <LessonStructure />

      {/* Advert Block - Positioned after SubjectGrid section */}
      {advertBlockSection?.enabled !== false ? (
        <AdvertBlock sectionData={advertBlockSection} />
      ) : null}
      <TutoringPlatformBanner data={platformBanner} />
      {testimonialSection && testimonials.length > 0 ? (
        <LazyTestimonialSection
          sectionData={testimonialSection}
          testimonials={testimonials}
        />
      ) : null}

      {/* FAQ Section - now using clone-aware server-side data */}
      {faqSection &&
      faqSection.faqReferences &&
      faqSection.faqReferences.length > 0 ? (
        <FAQSection
          sectionData={{
            title: faqSection.title,
            subtitle: faqSection.subtitle,
          }}
          faqs={faqSection.faqReferences}
        />
      ) : (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-600 text-center mb-4">
              {!faqSection
                ? "FAQ section not configured for this domain"
                : "No FAQs available at the moment"}
            </p>
            {/* Enhanced debug info in development */}
            {process.env.NODE_ENV === "development" && (
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="mb-2 text-blue-800 font-medium">
                  Clone-Aware FAQ Debug Info:
                </h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(
                    {
                      sectionExists: !!faqSection,
                      sectionId: faqSection?._id,
                      faqReferencesArray: faqSection?.faqReferences,
                      faqsCount: faqSection?.faqReferences?.length,
                      contentSource: cloneData?.faqSection?.source || "none",
                      currentClone: cloneContext?.clone?.cloneName || "none",
                      cloneId: cloneContext?.cloneId || "none",
                      individualFaqs: faqSection?.faqReferences?.map(
                        (faq: {
                          _id: string;
                          question: string;
                          displayOrder: number;
                        }) => ({
                          id: faq._id,
                          question: faq.question,
                          displayOrder: faq.displayOrder,
                        }),
                      ),
                    },
                    null,
                    2,
                  )}
                </pre>
                <div className="mt-4">
                  <p className="text-sm text-gray-700 mb-2 font-medium">
                    Multi-Domain FAQ Setup:
                  </p>
                  <ol className="list-decimal pl-5 text-sm text-gray-700">
                    <li className="mb-1">Go to Sanity Studio</li>
                    <li className="mb-1">Navigate to "FAQ Section"</li>
                    <li className="mb-1">
                      Create clone-specific FAQ sections or use global ones
                    </li>
                    <li className="mb-1">
                      Set the Clone Reference field appropriately
                    </li>
                    <li className="mb-1">
                      Make sure all FAQs are added to the faqReferences array
                    </li>
                    <li className="mb-1">Publish the document</li>
                  </ol>
                  <p className="text-sm text-blue-700 mt-2">
                    Content Source:{" "}
                    <strong>
                      {cloneData?.faqSection?.source || "None found"}
                    </strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <LazyContactForm />
    </main>
  );
}
