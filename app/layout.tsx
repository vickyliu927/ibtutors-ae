import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getSeoData } from './lib/getSeoData';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  
  return {
    title: seo.title,
    description: seo.description,
};
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
} 