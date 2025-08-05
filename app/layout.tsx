import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { getNavigationData } from './lib/getNavigationData';
import { getSeoData } from './lib/getSeoData';

// Load Inter font with display: swap for better performance
const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();

  return {
    title: seo.title,
    description: seo.description,
    // Add additional metadata to optimize for performance
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#ffffff',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch navigation data server-side with clone awareness
  const navigationData = await getNavigationData();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Gilroy:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <Navbar 
          navbarData={navigationData.navbarData}
          subjects={navigationData.subjects}
          curriculums={navigationData.curriculums}
          currentDomain={navigationData.currentDomain}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
