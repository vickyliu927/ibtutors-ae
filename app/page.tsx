import React from 'react';
import Navbar from './components/Navbar';
import HeroSection, { HeroData } from './components/HeroSection';
import TutorProfiles, { TutorData } from './components/TutorProfiles';
import SubjectGrid from './components/SubjectGrid';
import TutoringPlatformBanner, { PlatformBannerData } from './components/TutoringPlatformBanner';
import TestimonialSection, { TestimonialData, TestimonialSectionData } from './components/TestimonialSection';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { client } from '@/sanity/lib/client';

// Disable static page generation and enable revalidation
export const revalidate = 0;

async function getHomePageData() {
  try {
    const heroQuery = `*[_type == "hero"][0]`;
    const tutorProfilesSectionQuery = `*[_type == "tutorProfilesSection"][0]{
      title,
      subtitle,
      "tutors": tutors[]->
    }`;
    const platformBannerQuery = `*[_type == "platformBanner"][0]{
      title,
      subtitle,
      description,
      features[]{
        feature,
        description
      },
      "images": images[]{
        "url": asset->url,
        "alt": alt,
        "caption": caption,
        hotspot,
        crop
      }
    }`;
    const testimonialSectionQuery = `*[_type == "testimonialSection"][0]{
      rating,
      totalReviews,
      subtitle,
      tutorChaseLink,
      maxDisplayCount,
      "selectedTestimonials": selectedTestimonials[]->._id
    }`;
    const testimonialsQuery = `*[_type == "testimonial"] | order(order asc)`;

    console.log('Fetching data from Sanity...'); // Debug log

    const [heroData, tutorProfilesSection, platformBanner, testimonialSection, testimonials] = await Promise.all([
      client.fetch<HeroData>(heroQuery, {}, { next: { revalidate: 0 } }),
      client.fetch(tutorProfilesSectionQuery, {}, { next: { revalidate: 0 } }),
      client.fetch(platformBannerQuery, {}, { next: { revalidate: 0 } }),
      client.fetch<TestimonialSectionData>(testimonialSectionQuery, {}, { next: { revalidate: 0 } }),
      client.fetch<TestimonialData[]>(testimonialsQuery, {}, { next: { revalidate: 0 } }),
    ]);

    console.log('Data fetched:', { heroData, tutorProfilesSection, platformBanner, testimonialSection, testimonials }); // Debug log

    return { 
      heroData: heroData || null, 
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
      tutorProfilesSection: null,
      platformBanner: null,
      testimonialSection: null,
      testimonials: []
    };
  }
}

export default async function Home() {
  const { heroData, tutorProfilesSection, platformBanner, testimonialSection, testimonials } = await getHomePageData();

  return (
    <main className="min-h-screen">
      <Navbar />
      {heroData ? <HeroSection heroData={heroData} /> : null}
      {tutorProfilesSection ? (
        <TutorProfiles 
          tutors={tutorProfilesSection.tutors} 
          sectionTitle={tutorProfilesSection.title}
        />
      ) : null}
      <SubjectGrid />
      <TutoringPlatformBanner data={platformBanner} />
      {testimonialSection && testimonials.length > 0 ? (
        <TestimonialSection sectionData={testimonialSection} testimonials={testimonials} />
      ) : null}
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
} 