import React from 'react';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import { client } from '@/sanity/lib/client';
import SubjectHeader, { SubjectHeaderData } from '../components/SubjectHeader';
import TutorProfiles, { TutorData } from '../components/TutorProfiles';

// Disable static page generation and enable revalidation
export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface MathsPageData {
  title: string;
  subtitle: string;
  tutorChaseLink: {
    text: string;
    url: string;
  };
}

async function getSubjectHeader() {
  const query = `*[_type == "subjectHeader" && subject == "Maths"][0]`;
  return client.fetch<SubjectHeaderData>(query, {}, { next: { revalidate: 0 } });
}

async function getMathsTutors() {
  const query = `*[_type == "tutor" && (specialization.mainSubject == "IB Mathematics" || "IB Mathematics" in specialization.additionalSubjects[])] | order(yearsOfExperience desc)`;
  return client.fetch<TutorData[]>(query, {}, { next: { revalidate: 0 } });
}

async function getMathsPageContent() {
  const query = `*[_type == "mathsPage"][0]`;
  return client.fetch<MathsPageData>(query, {}, { next: { revalidate: 0 } });
}

async function getTutorProfilesSection() {
  // First try to get page-specific section
  const pageQuery = `*[_type == "tutorProfilesSection" && page == "maths"][0]`;
  const pageSection = await client.fetch(pageQuery, {}, { next: { revalidate: 0 } });
  if (pageSection) return pageSection;

  // If no page-specific section, get the default one
  const defaultQuery = `*[_type == "tutorProfilesSection" && isDefault == true][0]`;
  return client.fetch(defaultQuery, {}, { next: { revalidate: 0 } });
}

export default async function MathsPage() {
  const [header, tutors, content, tutorProfilesSection] = await Promise.all([
    getSubjectHeader(),
    getMathsTutors(),
    getMathsPageContent(),
    getTutorProfilesSection(),
  ]);

  return (
    <main>
      <Navbar />
      <SubjectHeader data={header} defaultTitle="IB Maths Tutors" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold mb-4">
            {content?.title || "Our Professional IB Maths Tutors"}
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            {content?.subtitle || "Our expert IB Maths tutors consistently guide students to top marks in their exams."}
          </p>
          <a 
            href={content?.tutorChaseLink?.url || "https://www.tutorchase.com/subjects/ib-maths"} 
            className="text-orange-500 hover:text-orange-600 font-medium mb-12 block"
          >
            {content?.tutorChaseLink?.text || "View all our IB Maths tutors on TutorChase, the world's #1 IB tutoring provider"}
          </a>
          <TutorProfiles 
            tutors={tutors} 
            sectionTitle={tutorProfilesSection?.title}
          />
        </div>
      </div>
      <ContactForm />
      <Footer />
    </main>
  );
}
