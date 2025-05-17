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
    const heroQuery = `*[_type == "hero"][0]`;
    const highlightsSectionQuery = `*[_id == "highlightsSection"][0]{ highlights }`;
    const trustedInstitutionsBannerQuery = `*[_type == "trustedInstitutionsBanner"][0]{
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
    }`;
    const tutorProfilesSectionQuery = `*[_type == "tutorProfilesSection"][0]{
      title,
      subtitle,
      ctaText,
      ctaLink,
      "tutors": *[_type == "tutor" && displayOnHomepage == true] | order(displayOrder asc) {
        _id,
        name,
        professionalTitle,
        personallyInterviewed {
          enabled,
          badgeText
        },
        experience,
        profilePhoto,
        specialization,
        yearsOfExperience,
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
    }`;
    const platformBannerQuery = `*[_type == "platformBanner"][0]{
      title,
      subtitle,
      description,
      features[]{
        feature,
        description
      }
    }`;
    const testimonialSectionQuery = `*[_type == "testimonialSection"][0]{
      rating,
      totalReviews,
      subtitle,
      tutorChaseLink,
      maxDisplayCount,
      selectedTestimonials[]-> {
        _id,
        reviewerName
      }
    }`;
    const testimonialsQuery = `*[_type == "testimonial"] | order(order asc)`;

    console.log('Fetching data from Sanity...'); // Debug log

    const [heroData, highlightsSection, trustedInstitutionsBanner, tutorProfilesSection, platformBanner, testimonialSection, testimonials] = await Promise.all([
      client.fetch<HeroData>(heroQuery, {}, { next: { revalidate: 0 } }),
      client.fetch<{ highlights: HighlightItem[] }>(highlightsSectionQuery, {}, { next: { revalidate: 0 } }),
      client.fetch(trustedInstitutionsBannerQuery, {}, { next: { revalidate: 0 } }),
      client.fetch(tutorProfilesSectionQuery, {}, { next: { revalidate: 0 } }),
      client.fetch(platformBannerQuery, {}, { next: { revalidate: 0 } }),
      client.fetch<TestimonialSectionData>(testimonialSectionQuery, {}, { next: { revalidate: 0 } }),
      client.fetch<TestimonialData[]>(testimonialsQuery, {}, { next: { revalidate: 0 } }),
    ]);

    console.log('Data fetched:', { 
      heroData, 
      highlightsSection: highlightsSection?.highlights,
      trustedInstitutionsBanner,
      tutorProfilesSection, 
      platformBanner, 
      testimonialSection: JSON.stringify(testimonialSection, null, 2), 
      testimonials: testimonials.map(t => `${t._id} - ${t.reviewerName}`) 
    }); // More detailed debugging

    return { 
      heroData: heroData || null, 
      highlightsSection: highlightsSection || null,
      trustedInstitutionsBanner: trustedInstitutionsBanner || null,
      tutorProfilesSection: tutorProfilesSection || null,
      platformBanner: platformBanner || null,
      testimonialSection: testimonialSection || null, 
      testimonials: testimonials || [] 
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
      {heroData ? <HeroSection heroData={heroData} /> : null}
      
      {/* Trusted Institutions Banner */}
      {trustedInstitutionsBanner?.enabled && trustedInstitutionsBanner.institutions?.length > 0 ? (
        <TrustedInstitutionsBanner
          title={trustedInstitutionsBanner.title}
          subtitle={trustedInstitutionsBanner.subtitle}
          institutions={trustedInstitutionsBanner.institutions}
          backgroundColor={trustedInstitutionsBanner.backgroundColor}
          carouselSpeed={trustedInstitutionsBanner.carouselSpeed}
        />
      ) : null}
      
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