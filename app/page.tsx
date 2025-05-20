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

// Import lazy-loaded components
import { LazyContactForm, LazyFAQ, LazyTestimonialSection } from './components/LazyComponents';
import HighlightsSection, { HighlightItem } from './components/HighlightsSection';

// Disable static page generation and enable revalidation
export const revalidate = 0;

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
      "testimonials": *[_type == "testimonial"] | order(order asc)
    }`;

    console.log('Fetching data from Sanity...'); // Debug log

    // Fetch all data in a single request with Next.js caching
    const data = await client.fetch(query, {}, { next: { revalidate: 300 } }); // Cache for 5 minutes

    console.log('Data fetched:', { 
      heroData: data.heroData, 
      highlightsSection: data.highlightsSection?.highlights,
      trustedInstitutionsBanner: data.trustedInstitutionsBanner,
      tutorProfilesSection: data.tutorProfilesSection, 
      platformBanner: data.platformBanner, 
      testimonialSection: JSON.stringify(data.testimonialSection, null, 2), 
      testimonials: data.testimonials?.map((t: TestimonialData) => `${t._id} - ${t.reviewerName}`) 
    }); // More detailed debugging

    return { 
      heroData: data.heroData || null, 
      highlightsSection: data.highlightsSection || null,
      trustedInstitutionsBanner: data.trustedInstitutionsBanner || null,
      tutorProfilesSection: data.tutorProfilesSection || null,
      platformBanner: data.platformBanner || null,
      testimonialSection: data.testimonialSection || null, 
      testimonials: data.testimonials || [] 
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
      testimonials: []
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
    testimonials 
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
      <LazyFAQ />
      <LazyContactForm />
      <Footer />
    </main>
  );
} 