import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TutorProfiles from './components/TutorProfiles';
import SubjectGrid from './components/SubjectGrid';
import TutoringPlatformBanner from './components/TutoringPlatformBanner';
import ReviewBanner from './components/ReviewBanner';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <TutorProfiles />
      <SubjectGrid />
      <TutoringPlatformBanner />
      <ReviewBanner />
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
} 