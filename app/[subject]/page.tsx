import React from 'react';
import { client } from '@/sanity/lib/client';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import TutorProfiles from '../components/TutorProfiles';
import TestimonialSection, { TestimonialSectionData } from '../components/TestimonialSection';
import FAQSection from '../components/FAQSection';
import { Metadata } from 'next';
import { getSeoData, SeoData } from '../lib/getSeoData';

// Disable static page generation and enable revalidation
export const revalidate = 0;

// Generate static params for common subjects at build time
export async function generateStaticParams() {
  const query = `*[_type == "subjectPage"].slug.current`;
  const slugs = await client.fetch<string[]>(query);
  
  return slugs.map((subject) => ({
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
  };
  tutorsList: any[];
  testimonials: any[];
  faqSection?: {
    _id: string;
    title: string;
    subtitle?: string;
    faqs: {
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

async function getSubjectPageData(subject: string) {
  const subjectPageQuery = `*[_type == "subjectPage" && slug.current == $subject][0]{
    _id,
    subject,
    title,
    firstSection,
    tutorsListSectionHead
  }`;

  // First fetch just the subject page data
  const subjectPage = await client.fetch(subjectPageQuery, { subject }, { next: { revalidate: 0 } });
  
  if (!subjectPage) {
    return { pageData: null, testimonialSection: null };
  }

  // Then use the subject page ID to fetch tutors that reference this subject page
  const tutorsQuery = `*[_type == "tutor" && $subjectPageId in displayOnSubjectPages[]._ref] | order(displayOrder asc) {
    _id,
    name,
    professionalTitle,
    personallyInterviewed,
    education,
    experience,
    profilePhoto,
    specialization,
    yearsOfExperience,
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
  }`;
  
  console.log('Tutors query:', tutorsQuery);
  
  // Get additional subject page data and testimonials
  const additionalDataQuery = `*[_type == "subjectPage" && slug.current == $subject][0]{
    testimonials[]->{
      _id,
      reviewerName,
      reviewerType,
      testimonialText,
      rating,
      order
    },
    "faqSection": faqSection->{
      _id,
      title,
      subtitle,
      "faqs": faqReferences[]-> {
        _id,
        question,
        answer,
        displayOrder
      } | order(displayOrder asc)
    },
    seo
  }`;
  
  const testimonialSectionQuery = `*[_type == "testimonialSection"][0]`;

  // Fetch all data in parallel
  const [tutors, additionalData, testimonialSection] = await Promise.all([
    client.fetch(tutorsQuery, { subjectPageId: subjectPage._id }, { next: { revalidate: 0 } }),
    client.fetch(additionalDataQuery, { subject }, { next: { revalidate: 0 } }),
    client.fetch<TestimonialSectionData>(testimonialSectionQuery, {}, { next: { revalidate: 0 } })
  ]);

  // Debug logs
  console.log('Subject ID:', subjectPage._id);
  console.log('Tutors found:', tutors.length);
  console.log('Tutor data:', JSON.stringify(tutors));

  // Combine the data
  const pageData = {
    ...subjectPage,
    ...additionalData,
    tutorsList: tutors
  };

  return { pageData, testimonialSection };
}

export async function generateMetadata({ params }: { params: { subject: string } }): Promise<Metadata> {
  const { pageData } = await getSubjectPageData(params.subject);
  const subjectSeo = await getSeoData();
  
  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The requested subject page could not be found.',
    };
  }

  // Use the page-specific SEO data, falling back to the default subject SEO data
  return {
    title: pageData.seo.pageTitle || `${pageData.title} | IB Tutors UAE`,
    description: pageData.seo.description || subjectSeo.description,
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
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stars and Reviews */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="h-7 w-7 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15.934L4.618 19.098l1.039-6.054L1.314 8.902l6.068-.881L10 2.666l2.618 5.355 6.068.881-4.343 4.142 1.039 6.054L10 15.934z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
            <div className="text-xl font-medium">
              4.92/5 based on <span className="font-bold">480 reviews</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-8 text-center">
            {pageData.firstSection.title.split(' ').map((word: string, index: number) => (
              <React.Fragment key={index}>
                <span className={
                  pageData.firstSection.highlightedWords?.includes(word) 
                    ? "text-blue-800" 
                    : ""
                }>
                  {word}
                </span>{" "}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-xl text-gray-600 text-center">{pageData.firstSection.description}</p>
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

          {pageData.tutorsListSectionHead?.ctaLinkText && pageData.tutorsListSectionHead?.ctaLink && (
            <p className="text-orange-500 hover:text-orange-600 mb-8">
              <a 
                href={pageData.tutorsListSectionHead.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
              >
                {pageData.tutorsListSectionHead.ctaLinkText}
              </a>
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

      {/* FAQ Section - Optional */}
      {pageData.faqSection && pageData.faqSection.faqs && pageData.faqSection.faqs.length > 0 && (
        <FAQSection 
          sectionData={{
            title: pageData.faqSection.title,
            subtitle: pageData.faqSection.subtitle
          }}
          faqs={pageData.faqSection.faqs}
        />
      )}

      <ContactForm />
      <Footer />
    </main>
  );
} 