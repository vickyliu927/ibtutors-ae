import React from 'react';
import Navbar from '../../components/Navbar';
import ContactForm from '../../components/ContactForm';
import Footer from '../../components/Footer';
import { client } from '@/sanity/lib/client';
import SubjectHeader, { SubjectHeaderData } from '../../components/SubjectHeader';

// This generates the paths for all subject pages at build time
export async function generateStaticParams() {
  const query = `*[_type == "subjectHeader"] {
    "slug": lower(subject)
  }`;
  const subjects = await client.fetch<{ slug: string }[]>(query);
  
  return subjects.map((subject) => ({
    slug: subject.slug,
  }));
}

async function getSubjectHeader(slug: string) {
  // Convert slug back to subject name format (e.g., "maths" -> "Maths")
  const subject = slug.charAt(0).toUpperCase() + slug.slice(1);
  const query = `*[_type == "subjectHeader" && subject == $subject][0]`;
  return client.fetch<SubjectHeaderData>(query, { subject });
}

export default async function SubjectPage({ params }: { params: { slug: string } }) {
  const header = await getSubjectHeader(params.slug);

  return (
    <main>
      <Navbar />
      <SubjectHeader 
        data={header} 
        defaultTitle={`IB ${params.slug.charAt(0).toUpperCase() + params.slug.slice(1)} Tutors`} 
      />
      <ContactForm />
      <Footer />
    </main>
  );
} 