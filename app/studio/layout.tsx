import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Sanity Studio - IB Tutors',
  description: 'Content management for IB Tutors',
};

// Studio layout that completely overrides the root layout
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <div style={{ height: '100vh', width: '100vw' }}>
          {children}
        </div>
      </body>
    </html>
  );
}