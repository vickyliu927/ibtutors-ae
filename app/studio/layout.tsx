import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Load Inter font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sanity Studio - IB Tutors',
  description: 'Content management for IB Tutors',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* No navbar, footer, or other components - just the studio */}
        {children}
      </body>
    </html>
  );
}