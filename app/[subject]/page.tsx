import React from 'react';
import { client } from '@/sanity/lib/client';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import TutorProfiles from '../components/TutorProfiles';
import TestimonialSection, { TestimonialSectionData } from '../components/TestimonialSection';
import { Metadata } from 'next';

// Disable static page generation and enable revalidation
export const revalidate = 0;

interface SubjectPageData {
  subject: string;
  title: string;
  firstSection: {
    title: string;
    description: string;
  };
  tutorsListSectionHead?: {
    smallTextBeforeTitle?: string;
    sectionTitle?: string;
    description?: string;
  };
  tutorsList: any[];
  testimonials: any[];
  seo: {
    pageTitle: string;
    description: string;
  };
}

async function getSubjectPageData(subject: string) {
  const query = `*[_type == "subjectPage" && slug.current == $subject][0]{
    subject,
    title,
    firstSection,
    tutorsListSectionHead,
    tutorsList[]->{
      _id,
      name,
      professionalTitle,
      personallyInterviewed,
      education,
      experience,
      profilePhoto,
      specialization,
      yearsOfExperience,
      hireButtonLink
    },
    testimonials[]->{
      _id,
      reviewerName,
      reviewerType,
      testimonialText,
      rating,
      order
    },
    seo
  }`;
  
  const testimonialSectionQuery = `*[_type == "testimonialSection"][0]`;

  const [pageData, testimonialSection] = await Promise.all([
    client.fetch<SubjectPageData>(query, { subject }, { next: { revalidate: 0 } }),
    client.fetch<TestimonialSectionData>(testimonialSectionQuery, {}, { next: { revalidate: 0 } })
  ]);

  return { pageData, testimonialSection };
}

export async function generateMetadata({ params }: { params: { subject: string } }): Promise<Metadata> {
  const { pageData } = await getSubjectPageData(params.subject);

  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The requested subject page could not be found.',
    };
  }

  return {
    title: pageData.seo.pageTitle,
    description: pageData.seo.description,
  };
}

export default async function SubjectPage({ params }: { params: { subject: string } }) {
  const { pageData, testimonialSection } = await getSubjectPageData(params.subject);

  if (!pageData) {
    // Handle 404 case
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-3xl font-bold">Subject page not found</h1>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      
      {/* First Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-bold mb-8">{pageData.firstSection.title}</h1>
          <p className="text-xl text-gray-600">{pageData.firstSection.description}</p>
        </div>
      </section>

      {/* Tutors Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {pageData.tutorsListSectionHead?.smallTextBeforeTitle && (
            <p className="text-sm text-gray-500 mb-2">
              {pageData.tutorsListSectionHead.smallTextBeforeTitle}
            </p>
          )}
          
          {pageData.tutorsListSectionHead?.sectionTitle && (
            <h2 className="text-3xl font-bold mb-4">
              {pageData.tutorsListSectionHead.sectionTitle}
            </h2>
          )}
          
          {pageData.tutorsListSectionHead?.description && (
            <p className="text-gray-600 mb-8">
              {pageData.tutorsListSectionHead.description}
            </p>
          )}

          <TutorProfiles tutors={pageData.tutorsList} />
        </div>
      </section>

      {/* Testimonials Section */}
      {pageData.testimonials && pageData.testimonials.length > 0 && testimonialSection && (
        <TestimonialSection 
          sectionData={testimonialSection} 
          testimonials={pageData.testimonials} 
        />
      )}

      <ContactForm />
      <Footer />
    </main>
  );
} 