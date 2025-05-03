import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection, { HeroData } from '../components/HeroSection';
import TutorProfiles, { TutorData } from '../components/TutorProfiles';
import TestimonialSection, { TestimonialSectionData, TestimonialData } from '../components/TestimonialSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import { client } from '@/sanity/lib/client';

async function getMathsPageData() {
  const query = `*[_type == "subjectPage" && slug.current == "maths"][0]{
    hero,
    tutorProfiles[]->{
      _id,
      name,
      professionalTitle,
      education,
      experience,
      profilePhoto,
      specialization,
      yearsOfExperience,
      hireButtonLink,
      subjects,
      price
    },
    testimonialSection->{
      rating,
      totalReviews,
      subtitle,
      tutorChaseLink
    },
    "testimonials": *[_type == "testimonial" && references(^.testimonialSection._ref)] | order(order asc) {
      _id,
      reviewerName,
      reviewerType,
      testimonialText,
      rating,
      order
    }
  }`;
  return await client.fetch(query);
}

export default async function MathsPage() {
  const data = await getMathsPageData();
  return (
    <main>
      <Navbar />
      <HeroSection heroData={data.hero as HeroData} />
      <TutorProfiles tutors={data.tutorProfiles as TutorData[]} />
      <TestimonialSection sectionData={data.testimonialSection as TestimonialSectionData} testimonials={data.testimonials as TestimonialData[]} />
      <ContactForm />
      <Footer />
    </main>
  );
}
