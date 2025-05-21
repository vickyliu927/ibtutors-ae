import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import TestimonialCard from '@/app/components/TestimonialCard';
import TutorCard from '@/app/components/TutorCard';
import FaqAccordion from '@/app/components/FaqAccordion';
import { Metadata } from 'next';

async function getCurriculumPageData(slug: string) {
  const query = `
    *[_type == "curriculumPage" && slug.current == $slug][0] {
      title,
      curriculum,
      slug,
      firstSection {
        title,
        highlightedWords,
        description
      },
      tutorsListSectionHead {
        smallTextBeforeTitle,
        sectionTitle,
        description,
        ctaLinkText,
        ctaLink
      },
      tutorsList[] -> {
        name,
        slug,
        photo,
        subjects,
        qualifications,
        biography,
        hourlyRate,
        degrees,
        "specialSubjects": subjects,
        "profileSnippet": biography
      },
      testimonials[] -> {
        reviewerName,
        location,
        rating,
        reviewText
      },
      faqSection -> {
        title,
        subtitle,
        faqs[] -> {
          _id,
          question,
          answer
        }
      },
      seo {
        pageTitle,
        description
      }
    }
  `;

  const testimonialsQuery = `
    *[_type == "testimonialSection"][0] {
      maxDisplayCount,
      rating,
      subtitle,
      totalReviews,
      tutorChaseLink,
      "selectedTestimonialsData": selectedTestimonials[] -> {
        reviewerName,
        location,
        rating,
        reviewText
      }
    }
  `;

  const pageData = await client.fetch(query, { slug });
  const testimonialSection = await client.fetch(testimonialsQuery);

  return { pageData, testimonialSection };
}

export async function generateMetadata({ params }: { params: { curriculum: string } }): Promise<Metadata> {
  const { pageData } = await getCurriculumPageData(params.curriculum);

  if (!pageData) {
    return {
      title: 'Curriculum Not Found',
      description: 'The requested curriculum page could not be found.',
    };
  }

  return {
    title: pageData.seo?.pageTitle || pageData.title,
    description: pageData.seo?.description || `Find expert tutors for ${pageData.curriculum} in Dubai.`,
  };
}

export default async function CurriculumPage({ params }: { params: { curriculum: string } }) {
  const { pageData, testimonialSection } = await getCurriculumPageData(params.curriculum);

  if (!pageData) {
    // Handle 404 case
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-3xl font-bold">Curriculum page not found</h1>
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

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {pageData.firstSection.title.split(" ").map((word: string, index: number) => {
                const shouldHighlight = pageData.firstSection.highlightedWords?.includes(word);
                return (
                  <span
                    key={index}
                    className={shouldHighlight ? "text-blue-800" : ""}
                  >
                    {word}{" "}
                  </span>
                );
              })}
            </h1>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
              {pageData.firstSection.description}
            </p>
          </div>
        </div>
      </section>

      {/* Tutors Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {pageData.tutorsListSectionHead && (
            <div className="text-center mb-16">
              {pageData.tutorsListSectionHead.smallTextBeforeTitle && (
                <p className="text-blue-800 font-semibold">
                  {pageData.tutorsListSectionHead.smallTextBeforeTitle}
                </p>
              )}
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {pageData.tutorsListSectionHead.sectionTitle}
              </h2>
              {pageData.tutorsListSectionHead.description && (
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  {pageData.tutorsListSectionHead.description}
                </p>
              )}
              {pageData.tutorsListSectionHead.ctaLinkText && pageData.tutorsListSectionHead.ctaLink && (
                <a
                  href={pageData.tutorsListSectionHead.ctaLink}
                  className="text-blue-800 font-medium inline-block mt-4 hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pageData.tutorsListSectionHead.ctaLinkText}
                </a>
              )}
            </div>
          )}

          {/* Tutors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pageData.tutorsList &&
              pageData.tutorsList.map((tutor: any, index: number) => (
                <TutorCard key={index} tutor={tutor} />
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Read feedback from students who have worked with our {pageData.curriculum} tutors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pageData.testimonials &&
              pageData.testimonials.slice(0, 3).map((testimonial: any, index: number) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {pageData.faqSection && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {pageData.faqSection.title}
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {pageData.faqSection.subtitle}
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {pageData.faqSection.faqs &&
                pageData.faqSection.faqs.map((faq: any) => (
                  <FaqAccordion 
                    key={faq._id} 
                    question={faq.question} 
                    answer={faq.answer} 
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
} 