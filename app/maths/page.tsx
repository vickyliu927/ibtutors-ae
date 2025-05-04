import React from 'react';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface SubjectHeader {
  subject: string;
  title: string;
  subtitle?: string;
  backgroundImage?: {
    asset: {
      _ref: string;
    };
  };
  callToAction?: {
    text: string;
    link: string;
  };
}

async function getSubjectHeader() {
  const query = `*[_type == "subjectHeader" && subject == "Maths"][0]`;
  return client.fetch<SubjectHeader>(query);
}

export default async function MathsPage() {
  const header = await getSubjectHeader();

  const backgroundImageUrl = header?.backgroundImage 
    ? urlFor(header.backgroundImage).url()
    : undefined;

  const headerStyle = backgroundImageUrl 
    ? { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <main>
      <Navbar />
      <section 
        className="py-32 text-center relative"
        style={headerStyle}
      >
        {/* Add an overlay if there's a background image */}
        {backgroundImageUrl && (
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        )}
        <div className="relative z-10">
          <h1 className={`text-5xl font-bold mb-6 ${backgroundImageUrl ? 'text-white' : ''}`}>
            {header?.title || 'IB Maths Tutors'}
          </h1>
          {header?.subtitle && (
            <p className={`text-xl ${backgroundImageUrl ? 'text-gray-200' : 'text-gray-600'} mb-8`}>
              {header.subtitle}
            </p>
          )}
          {header?.callToAction && (
            <a 
              href={header.callToAction.link}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {header.callToAction.text}
            </a>
          )}
        </div>
      </section>
      <ContactForm />
      <Footer />
    </main>
  );
}
