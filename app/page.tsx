import React from 'react';
import Navbar from './components/Navbar';
import HeroSection, { HeroData } from './components/HeroSection';
import TutorProfiles, { TutorData } from './components/TutorProfiles';
import SubjectGrid from './components/SubjectGrid';
import TutoringPlatformBanner from './components/TutoringPlatformBanner';
import TestimonialSection, { TestimonialData, TestimonialSectionData } from './components/TestimonialSection';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { client } from '@/sanity/lib/client';

async function getHomePageData() {
  const heroQuery = `*[_type == "hero"][0]`;
  const tutorsQuery = `*[_type == "tutor"] | order(order asc)`;
  const testimonialSectionQuery = `*[_type == "testimonial_section"][0]`;
  const testimonialsQuery = `*[_type == "testimonial"] | order(order asc)`;

  const [heroData, tutors, testimonialSection, testimonials] = await Promise.all([
    client.fetch<HeroData>(heroQuery),
    client.fetch<TutorData[]>(tutorsQuery),
    client.fetch<TestimonialSectionData>(testimonialSectionQuery),
    client.fetch<TestimonialData[]>(testimonialsQuery),
  ]);

  return { heroData, tutors, testimonialSection, testimonials };
}

export default async function Home() {
  const { heroData, tutors, testimonialSection, testimonials } = await getHomePageData();

  return (
    <main>
      <Navbar />
      <HeroSection heroData={heroData} />
      <TutorProfiles tutors={tutors} />
      <SubjectGrid />
      <TutoringPlatformBanner />
      <TestimonialSection sectionData={testimonialSection} testimonials={testimonials} />
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
} 