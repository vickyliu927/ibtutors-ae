import React from "react";
import Navbar from "./components/Navbar";
import HeroSection, { HeroData } from "./components/HeroSection";
import TutorProfiles, { TutorData } from "./components/TutorProfiles";
import SubjectGrid from "./components/SubjectGrid";
import TutoringPlatformBanner, {
  PlatformBannerData,
} from "./components/TutoringPlatformBanner";
import {
  TestimonialData,
  TestimonialSectionData,
} from "./components/TestimonialSection";
import Footer from "./components/Footer";
import TrustedInstitutionsBanner from "./components/TrustedInstitutionsBanner";
import FAQSection from "./components/FAQSection";

// Import lazy-loaded components
import {
  LazyContactForm,
  LazyTestimonialSection,
} from "./components/LazyComponents";
import HighlightsSection, {
  HighlightItem,
} from "./components/HighlightsSection";

// Import enhanced clone-aware utilities
import {
  getCloneAwarePageData,
  resolveContentSafely,
  CloneAwarePageData,
  getCloneIndicatorData,
} from "./lib/clonePageUtils";
import { getHomepageContentForCurrentDomain } from "./lib/cloneContentManager";
import { cloneQueryUtils } from "./lib/cloneQueries";
import CloneIndicatorBanner from "./components/CloneIndicatorBanner";

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

// Enhanced homepage data interface
interface HomepageData {
  heroData: any | null;
  highlightsSection: any | null;
  trustedInstitutionsBanner: any | null;
  tutorProfilesSection: any | null;
  platformBanner: any | null;
  testimonialSection: any | null;
  testimonials: any[];
  faqSection: any | null;
  navbar: any | null;
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

        // Fetch all homepage content with clone-aware fallback hierarchy
        const content = await getHomepageContentForCurrentDomain();

        // Extract data from ContentResult objects and apply customizations
        const heroData = content.hero.data
          ? cloneQueryUtils.getContentWithCustomizations(content.hero)
          : null;

        const highlightsSection = content.highlights.data
          ? cloneQueryUtils.getContentWithCustomizations(content.highlights)
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

        // Extract navbar data
        const navbar = content.navbar?.data
          ? cloneQueryUtils.getContentWithCustomizations(content.navbar)
          : null;

        return {
          heroData,
          highlightsSection,
          trustedInstitutionsBanner,
          tutorProfilesSection: tutorProfilesSectionWithTutors,
          platformBanner,
          testimonialSection,
          testimonials,
          faqSection,
          navbar,
        };
      } catch (error) {
        console.error("Error fetching homepage content:", error);
        // Return default/empty values instead of throwing
        return {
          heroData: null,
          highlightsSection: null,
          trustedInstitutionsBanner: null,
          tutorProfilesSection: null,
          platformBanner: null,
          testimonialSection: null,
          testimonials: [],
          faqSection: null,
          navbar: null,
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

  // Extract homepage data with fallback
  const {
    heroData,
    highlightsSection,
    trustedInstitutionsBanner,
    tutorProfilesSection,
    platformBanner,
    testimonialSection,
    testimonials,
    faqSection,
    navbar,
  } = pageData || {
    heroData: null,
    highlightsSection: null,
    trustedInstitutionsBanner: null,
    tutorProfilesSection: null,
    platformBanner: null,
    testimonialSection: null,
    testimonials: [],
    faqSection: null,
    navbar: null,
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
      {/* Separate Header and Hero Components */}
      <Navbar navbarData={navbar} />
      {heroData && <HeroSection heroData={heroData} />}

      <div className="flex flex-col">
        {/* Trusted Institutions Banner - No spacing between this and hero */}
        {trustedInstitutionsBanner?.enabled &&
        trustedInstitutionsBanner.institutions?.length > 0 ? (
          <TrustedInstitutionsBanner
            title={trustedInstitutionsBanner.title}
            subtitle={trustedInstitutionsBanner.subtitle}
            institutions={trustedInstitutionsBanner.institutions}
            backgroundColor={trustedInstitutionsBanner.backgroundColor}
            carouselSpeed={trustedInstitutionsBanner.carouselSpeed}
          />
        ) : null}
      </div>

      {highlightsSection?.highlights ? (
        <HighlightsSection highlights={highlightsSection.highlights} />
      ) : null}
      {tutorProfilesSection ? (
        <TutorProfiles
          tutors={tutorProfilesSection.tutors}
          sectionTitle={tutorProfilesSection.title}
          sectionSubtitle={tutorProfilesSection.subtitle}
          ctaText={tutorProfilesSection.ctaText}
          ctaLink={tutorProfilesSection.ctaLink}
          useNewCardDesign={true}
        />
      ) : null}
      <SubjectGrid />
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
      <Footer />
    </main>
  );
}
