import React from 'react';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function MathsPage() {
  return (
    <main>
      <Navbar />
      <section className="py-32 text-center">
        <h1 className="text-5xl font-bold mb-6">IB Maths Tutors</h1>
        <p className="text-xl text-gray-600 mb-8">This is a temporary static page for IB Maths. Dynamic content will be added soon.</p>
      </section>
      <ContactForm />
      <Footer />
    </main>
  );
}
