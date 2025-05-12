import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getSeoData } from './lib/getSeoData';
import { CriticalCssInjector } from './Document';

// Load Inter font with display: swap for better performance
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Use 'swap' to prevent layout shifts
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical CSS */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          as="style"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <CriticalCssInjector>
          {children}
        </CriticalCssInjector>
      </body>
    </html>
  );
} 