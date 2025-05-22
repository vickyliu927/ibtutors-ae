import React from 'react';
import Navbar from './components/Navbar';
import HeroSection, { HeroData } from './components/HeroSection';
import TutorProfiles, { TutorData } from './components/TutorProfiles';
import SubjectGrid from './components/SubjectGrid';
import TutoringPlatformBanner, { PlatformBannerData } from './components/TutoringPlatformBanner';
import { TestimonialData, TestimonialSectionData } from './components/TestimonialSection';
import Footer from './components/Footer';
import { client } from '@/sanity/lib/client';
import TrustedInstitutionsBanner from './components/TrustedInstitutionsBanner';
import FAQSection from './components/FAQSection';

// Import lazy-loaded components
import { LazyContactForm, LazyTestimonialSection } from './components/LazyComponents';
import HighlightsSection, { HighlightItem } from './components/HighlightsSection';

/**
 * Data Fetching Strategy
 * 
 * This website implements a server-side data fetching approach with several optimizations:
 * 
 * 1. Consolidated Queries: We fetch multiple data types in a single query where possible to reduce API calls
 * 2. Server Components: All data fetching happens on the server side, eliminating client-side API calls
 * 3. Revalidation: Data is cached for 10 minutes (600 seconds) using Next.js revalidation
 * 4. No Client-side Fetching: We've removed all useState/useEffect data fetching
 * 
 * This approach significantly reduces the number of API calls to Sanity, improves performance,
 * and provides a better user experience with instant page loads.
 */

// Set revalidation time to 10 minutes (600 seconds)
export const revalidate = 600;

async function getHomePageData() {
  try {
    // Consolidated GROQ query - fetch all data in a single API call
    const query = `{
      "heroData": *[_type == "hero"][0],
      "highlightsSection": *[_id == "highlightsSection"][0]{ highlights },
      "trustedInstitutionsBanner": *[_type == "trustedInstitutionsBanner"][0]{
        title,
        subtitle,
        backgroundColor,
        carouselSpeed,
        enabled,
        institutions[]{
          name,
          logo,
          displayOrder
        }
      },
      "tutorProfilesSection": *[_type == "tutorProfilesSection"][0]{
        title,
        subtitle,
        ctaText,
        ctaLink,
        "tutors": *[_type == "tutor" && displayOnHomepage == true] | order(displayOrder asc) {
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
      "platformBanner": *[_type == "platformBanner"][0]{
        title,
        subtitle,
        description,
        features[]{
          feature,
          description
        }
      },
      "testimonialSection": *[_type == "testimonialSection"][0]{
        rating,
        totalReviews,
        subtitle,
        tutorChaseLink,
        maxDisplayCount,
        selectedTestimonials[]-> {
          _id,
          reviewerName
        }
      },
      "testimonials": *[_type == "testimonial"] | order(order asc),
      "faqSection": *[_type == "faq_section" && _id == "faq_section"][0]{
        _id,
        title,
        subtitle,
        "faqs": faqReferences[]-> {
          _id,
          question,
          answer,
          displayOrder
        } | order(displayOrder asc)
      }
    }`;

    console.log('Fetching data from Sanity...'); // Debug log

    // Fetch all data in a single request with Next.js caching
    const data = await client.fetch(query, {}, { next: { revalidate: 600 } }); // Cache for 10 minutes

    // Add detailed FAQ debugging
    if (data.faqSection) {
      console.log('FAQ Section Details:', {
        _id: data.faqSection._id,
        title: data.faqSection.title,
        subtitle: data.faqSection.subtitle,
        faqCount: data.faqSection.faqs?.length || 0,
        faqs: data.faqSection.faqs?.map((faq: any) => ({
          _id: faq._id,
          question: faq.question,
          displayOrder: faq.displayOrder
        }))
      });
      
      // Check for additional FAQs in Sanity that might not be in the references
      try {
        const allFaqs = await client.fetch(`*[_type == "faq"] | order(displayOrder asc){
          _id,
          question,
          displayOrder
        }`);
        
        console.log('All available FAQs in Sanity:', allFaqs);
        
        // Compare to see which FAQs are missing from the section
        const sectionFaqIds = data.faqSection.faqs?.map((f: any) => f._id) || [];
        const missingFaqs = allFaqs.filter((f: any) => !sectionFaqIds.includes(f._id));
        
        if (missingFaqs.length > 0) {
          console.log('FAQs not included in the faqSection:', missingFaqs);
        }
      } catch (err) {
        console.error('Error checking for all FAQs:', err);
      }
    } else {
      console.log('FAQ Section not found in Sanity data');
    }

    console.log('Data fetched:', { 
      heroData: data.heroData, 
      highlightsSection: data.highlightsSection?.highlights,
      trustedInstitutionsBanner: data.trustedInstitutionsBanner,
      tutorProfilesSection: data.tutorProfilesSection, 
      platformBanner: data.platformBanner, 
      testimonialSection: JSON.stringify(data.testimonialSection, null, 2), 
      testimonials: data.testimonials?.map((t: TestimonialData) => `${t._id} - ${t.reviewerName}`),
      faqSection: data.faqSection
    }); // More detailed debugging

    return { 
      heroData: data.heroData || null, 
      highlightsSection: data.highlightsSection || null,
      trustedInstitutionsBanner: data.trustedInstitutionsBanner || null,
      tutorProfilesSection: data.tutorProfilesSection || null,
      platformBanner: data.platformBanner || null,
      testimonialSection: data.testimonialSection || null, 
      testimonials: data.testimonials || [],
      faqSection: data.faqSection || null
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    // Return default/empty values instead of throwing
    return {
      heroData: null,
      highlightsSection: null,
      trustedInstitutionsBanner: null,
      tutorProfilesSection: null,
      platformBanner: null,
      testimonialSection: null,
      testimonials: [],
      faqSection: null
    };
  }
}

export default async function Home() {
  const { 
    heroData, 
    highlightsSection, 
    trustedInstitutionsBanner, 
    tutorProfilesSection, 
    platformBanner, 
    testimonialSection, 
    testimonials,
    faqSection
  } = await getHomePageData();

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="flex flex-col">
        {heroData ? <HeroSection heroData={heroData} /> : null}
        
        {/* Trusted Institutions Banner - No spacing between this and hero */}
        {trustedInstitutionsBanner?.enabled && trustedInstitutionsBanner.institutions?.length > 0 ? (
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
        />
      ) : null}
      <SubjectGrid />
      <TutoringPlatformBanner data={platformBanner} />
      {testimonialSection && testimonials.length > 0 ? (
        <LazyTestimonialSection sectionData={testimonialSection} testimonials={testimonials} />
      ) : null}
      
      {/* FAQ Section - now using server-side data */}
      {faqSection && faqSection.faqs && faqSection.faqs.length > 0 ? (
        <FAQSection 
          sectionData={{
            title: faqSection.title,
            subtitle: faqSection.subtitle
          }}
          faqs={faqSection.faqs}
        />
      ) : (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-600 text-center mb-4">
              {!faqSection ? 'FAQ section not configured' : 'No FAQs available at the moment'}
            </p>
            {/* Enhanced debug info in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="mb-2 text-blue-800 font-medium">FAQ Debug Info:</h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify({
                    sectionExists: !!faqSection,
                    sectionId: faqSection?._id,
                    faqsArray: faqSection?.faqs,
                    faqsCount: faqSection?.faqs?.length,
                    individualFaqs: faqSection?.faqs?.map((faq: { _id: string; question: string; displayOrder: number }) => ({
                      id: faq._id,
                      question: faq.question,
                      displayOrder: faq.displayOrder
                    }))
                  }, null, 2)}
                </pre>
                <div className="mt-4">
                  <p className="text-sm text-gray-700 mb-2 font-medium">To fix this issue:</p>
                  <ol className="list-decimal pl-5 text-sm text-gray-700">
                    <li className="mb-1">Go to Sanity Studio</li>
                    <li className="mb-1">Navigate to "FAQ Section"</li>
                    <li className="mb-1">Make sure all FAQs are added to the faqReferences array</li>
                    <li className="mb-1">Publish the document</li>
                  </ol>
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