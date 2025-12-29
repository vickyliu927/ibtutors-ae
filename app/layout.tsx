import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DebuggerInitializer from './components/DebuggerInitializer';
import { GTMHead, GTMNoScript } from './components/GTM';
import { getNavigationData } from './lib/getNavigationData';
import { getSeoData } from './lib/getSeoData';
import { getCurrentDomainFromHeaders, getCanonicalDomain } from './lib/sitemapUtils';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';

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
        {/* Google Tag Manager - global for all tenants */}
        <GTMHead />
        {/* Google Analytics 4 (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H9E5WDK5MX"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-H9E5WDK5MX');
        `}</Script>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '489973117202455');
          fbq('track', 'PageView');
        `}</Script>
        {/* Meta Pixel - SPA navigation tracking */}
        <Script id="meta-pixel-route-events" strategy="afterInteractive">{`
          (function() {
            var fire = function() { try { if (window.fbq) window.fbq('track', 'PageView'); } catch (_) {} };
            var origPushState = history.pushState;
            history.pushState = function() {
              var ret = origPushState.apply(this, arguments);
              fire();
              return ret;
            };
            var origReplaceState = history.replaceState;
            history.replaceState = function() {
              var ret = origReplaceState.apply(this, arguments);
              fire();
              return ret;
            };
            window.addEventListener('popstate', fire);
          })();
        `}</Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=489973117202455&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <GTMNoScript />
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
        <Analytics />
      </body>
    </html>
  );
}
