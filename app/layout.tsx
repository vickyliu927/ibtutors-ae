import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DebuggerInitializer from './components/DebuggerInitializer';
import { getNavigationData } from './lib/getNavigationData';
import { getSeoData } from './lib/getSeoData';
import { getCurrentDomainFromHeaders, getCanonicalDomain } from './lib/sitemapUtils';

// Load Inter font with display: swap for better performance
const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  // Use clone-aware SEO data that will automatically detect clone from middleware headers
  const seo = await getSeoData();

  // Compute canonical base URL for this request
  const currentDomain = getCurrentDomainFromHeaders();
  const canonicalHost = getCanonicalDomain(currentDomain || '');
  const isLocal = canonicalHost.includes('localhost') || canonicalHost.includes('127.0.0.1') || canonicalHost.includes('.local');
  const protocol = isLocal ? 'http' : 'https';
  const baseUrlString = canonicalHost ? `${protocol}://${canonicalHost}` : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dubaitutors.ae');

  return {
    title: seo.title,
    description: seo.description,
    metadataBase: new URL(baseUrlString),
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
  const seo = await getSeoData();

  // Compute canonical base URL for structured data
  const currentDomain = getCurrentDomainFromHeaders();
  const canonicalHost = getCanonicalDomain(currentDomain || '');
  const isLocal = canonicalHost.includes('localhost') || canonicalHost.includes('127.0.0.1') || canonicalHost.includes('.local');
  const protocol = isLocal ? 'http' : 'https';
  const baseUrlString = canonicalHost ? `${protocol}://${canonicalHost}` : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dubaitutors.ae');

  // Derive brand from SEO title (last segment after '|')
  const brandFromSeo = (() => {
    const t = (seo?.title || '').trim();
    if (!t) return 'IB Tutors';
    const parts = t.split('|').map(s => s.trim()).filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  })();

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="v4S2fecY05CWeIbQ6FvCG-5LZv2FvTJa56JfscMhS_Y" />
        {/* Removed render-blocking Google Fonts for Gilroy; Inter is provided via next/font */}
            {/* Google Tag Manager */}
            <Script id="gtm-loader" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-N5624CFQ');
              `}
            </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: brandFromSeo,
              url: baseUrlString,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: brandFromSeo,
              url: baseUrlString,
            }),
          }}
        />
        {/* Google tag (gtag.js) for GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-84X27600SD"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-84X27600SD');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N5624CFQ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <DebuggerInitializer />
        <Navbar 
          navbarData={navigationData.navbarData}
          subjects={navigationData.subjects}
          curriculums={navigationData.curriculums}
          locations={navigationData.locations}
          currentDomain={navigationData.currentDomain}
          hasBlog={navigationData.hasBlog}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
