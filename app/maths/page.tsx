import React from 'react';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import { client } from '@/sanity/lib/client';
import SubjectHeader, { SubjectHeaderData } from '../components/SubjectHeader';

async function getSubjectHeader() {
  const query = `*[_type == "subjectHeader" && subject == "Maths"][0]`;
  return client.fetch<SubjectHeaderData>(query);
}

export default async function MathsPage() {
  const header = await getSubjectHeader();

  return (
    <main>
      <Navbar />
      <SubjectHeader data={header} defaultTitle="IB Maths Tutors" />
      <ContactForm />
      <Footer />
    </main>
  );
}
