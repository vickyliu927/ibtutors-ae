import React from 'react';
import { client } from '@/sanity/lib/client';
import ContactForm from '../components/ContactForm';
import TutorProfiles from '../components/TutorProfiles';
import AdvertBlock from '../components/AdvertBlock';
import TutoringPlatformBanner, { PlatformBannerData } from '../components/TutoringPlatformBanner';
import TestimonialSection, { TestimonialSectionData } from '../components/TestimonialSection';
import FAQSection from '../components/FAQSection';
import SubjectHeroSection from '../components/SubjectHeroSection';
import { Metadata } from 'next';
import { getSeoData, SeoData } from '../lib/getSeoData';
import { getCurriculumHeroData } from '../lib/getCurriculumHeroData';
import { notFound, redirect, permanentRedirect } from 'next/navigation';

// Import enhanced clone-aware utilities
import { 
  getCloneAwarePageData, 
  resolveContentSafely, 
  CloneAwarePageData,
  getCloneIndicatorData,
  mergeCloneContent
} from '../lib/clonePageUtils';
import { navbarQueries, tutorProfilesSectionQueries, advertBlockSectionQueries, platformBannerQueries, trustedInstitutionsQueries, cloneQueryUtils } from '../lib/cloneQueries';
import TrustedInstitutionsBanner from '../components/TrustedInstitutionsBanner';
import CloneIndicatorBanner from '../components/CloneIndicatorBanner';
import { getCloneIdForCurrentDomain, getCurrentDomainFromHeaders, getCanonicalDomain } from '../lib/sitemapUtils';

// Enable caching of data fetches (route remains dynamic due to headers usage)
export const revalidate = 300;

// Generate static params for common subjects at build time
export async function generateStaticParams() {
  try {
    // Only include defined string slugs to avoid build-time errors
    const subjectQuery = `*[_type == "subjectPage" && defined(slug.current)].slug.current`;
    const curriculumQuery = `*[_type == "curriculumPage" && defined(slug.current)].slug.current`;

    const [subjectSlugsRaw, curriculumSlugsRaw] = await Promise.all([
      client.fetch<any[]>(subjectQuery),
      client.fetch<any[]>(curriculumQuery),
    ]);

    const isString = (v: any): v is string => typeof v === 'string' && v.trim().length > 0;
    const subjectSlugs = (subjectSlugsRaw || []).filter(isString);
    const curriculumSlugs = (curriculumSlugsRaw || []).filter(isString);

    // Filter out any slugs that contain '/' because `[subject]` is a single-segment route.
    const allSlugs = [...subjectSlugs, ...curriculumSlugs].filter((s) => !s.includes('/'));
    return allSlugs.map((slug) => ({ subject: slug }));
  } catch (e) {
    // On any failure, return no pre-rendered paths (dynamic at runtime)
    return [] as { subject: string }[];
  }
}

interface SubjectPageData {
  subject: string;
  title: string;
  firstSection: {
    title: string;
    highlightedWords?: string[];
    description: string;
  };
  tutorsListSectionHead?: {
    trustedByText?: string;
    smallTextBeforeTitle?: string;
    sectionTitle?: string;
    description?: string;
    ctaRichText?: any[];
    ctaLinkText?: string;
    ctaLink?: string;
    tutorProfileSectionPriceDescription?: string;
    tutorProfileSectionPriceTag?: string;
  };
  tutorsList: any[];
  testimonials: any[];
  faqSection?: {
    _id: string;
    title: string;
    subtitle?: string;
    faqReferences: {
      _id: string;
      question: string;
      answer: any;
      displayOrder: number;
    }[];
  };
  seo: {
    pageTitle: string;
    description: string;
  };
  externalRedirectEnabled?: boolean;
  externalRedirectUrl?: string;
  externalRedirectPermanent?: boolean;
  showAdvertBlockAfterTutors?: boolean;
  showTrustedInstitutionsAfterTutors?: boolean;
  showPlatformBannerAfterTutors?: boolean;
}

interface CurriculumPageData {
  curriculum: string;
  title: string;
  firstSection: {
    title: string;
    highlightedWords?: string[];
    description: string;
  };
  externalRedirectEnabled?: boolean;
  externalRedirectUrl?: string;
  externalRedirectPermanent?: boolean;
  tutorsListSectionHead?: {
    trustedByText?: string;
    smallTextBeforeTitle?: string;
    sectionTitle?: string;
    description?: string;
    ctaRichText?: any[];
    ctaLinkText?: string;
    ctaLink?: string;
    tutorProfileSectionPriceDescription?: string;
    tutorProfileSectionPriceTag?: string;
  };
  tutorsList: any[];
  testimonials: any[];
  faqSection?: {
    _id: string;
    title: string;
    subtitle?: string;
    faqReferences: {
      _id: string;
      question: string;
      answer: any;
      displayOrder: number;
    }[];
  };
  seo: {
    pageTitle: string;
    description: string;
  };
  showAdvertBlockAfterTutors?: boolean;
  showTrustedInstitutionsAfterTutors?: boolean;
  showPlatformBannerAfterTutors?: boolean;
}

/**
 * Enhanced clone-aware curriculum page data fetcher
 */
async function getCurriculumPageDataWithCloneContext(
  subject: string, 
  cloneId: string | null = null
): Promise<{ pageData: CurriculumPageData | null; testimonialSection: any | null; navbarData: any | null; type: string | null }> {
  try {
    console.log(`[CurriculumPage] Fetching data for subject: ${subject}, clone: ${cloneId || 'none'}`);
    
    // Clone-aware curriculum page query with 3-tier fallback
    const query = `{
      "cloneSpecific": *[_type == "curriculumPage" && (
        slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
      ) && cloneReference->cloneId.current == $cloneId && (isActive == true || !defined(isActive))][0] {
        title,
        curriculum,
        slug,
        externalRedirectEnabled,
        externalRedirectUrl,
        externalRedirectPermanent,
        firstSection,
        tutorsListSectionHead{
          trustedByText,
          smallTextBeforeTitle,
          sectionTitle,
          description,
          ctaRichText,
          ctaLinkText,
          ctaLink,
          tutorProfileSectionPriceDescription,
          tutorProfileSectionPriceTag
        },
        showTrustedInstitutionsAfterTutors,
        showAdvertBlockAfterTutors,
        showPlatformBannerAfterTutors,
        tutorsList[] -> {
          _id,
          name,
          slug,
          profilePhoto,
          professionalTitle,
          experience,
          specialization,
          hireButtonLink,
          price,
          rating,
          reviewCount,
          activeStudents,
          totalLessons,
          languagesSpoken,
          profilePDF
        },
        testimonials[] -> {
          _id,
          reviewerName,
          reviewerType,
          testimonialText,
          rating,
          order
        },
        faqSection -> {
          title,
          subtitle,
          faqReferences[] -> {
            _id,
            question,
            answer
          }
        },
        seo,
        "sourceInfo": {
          "source": "cloneSpecific",
          "cloneId": $cloneId
        }
      },
      "baseline": *[_type == "curriculumPage" && (
        slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
      ) && cloneReference->baselineClone == true && (isActive == true || !defined(isActive))][0] {
        title,
        curriculum,
        slug,
        externalRedirectEnabled,
        externalRedirectUrl,
        externalRedirectPermanent,
        firstSection,
        tutorsListSectionHead{
          trustedByText,
          smallTextBeforeTitle,
          sectionTitle,
          description,
          ctaRichText,
          ctaLinkText,
          ctaLink,
          tutorProfileSectionPriceDescription,
          tutorProfileSectionPriceTag
        },
        showTrustedInstitutionsAfterTutors,
        showAdvertBlockAfterTutors,
        showPlatformBannerAfterTutors,
        tutorsList[] -> {
          _id,
          name,
          slug,
          profilePhoto,
          professionalTitle,
          experience,
          specialization,
          hireButtonLink,
          price,
          rating,
          reviewCount,
          activeStudents,
          totalLessons,
          languagesSpoken,
          profilePDF
        },
        testimonials[] -> {
          _id,
          reviewerName,
          reviewerType,
          testimonialText,
          rating,
          order
        },
        faqSection -> {
          title,
          subtitle,
          faqReferences[] -> {
            _id,
            question,
            answer
          }
        },
        seo,
        "sourceInfo": {
          "source": "baseline",
          "cloneId": cloneReference->cloneId.current
        }
      },
      "default": *[_type == "curriculumPage" && (
        slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
      ) && !defined(cloneReference) && (isActive == true || !defined(isActive))][0] {
        title,
        curriculum,
        slug,
        externalRedirectEnabled,
        externalRedirectUrl,
        externalRedirectPermanent,
        firstSection,
        tutorsListSectionHead{
          trustedByText,
          smallTextBeforeTitle,
          sectionTitle,
          description,
          ctaRichText,
          ctaLinkText,
          ctaLink,
          tutorProfileSectionPriceDescription,
          tutorProfileSectionPriceTag
        },
        showTrustedInstitutionsAfterTutors,
        showAdvertBlockAfterTutors,
        showPlatformBannerAfterTutors,
        tutorsList[] -> {
          _id,
          name,
          slug,
          profilePhoto,
          professionalTitle,
          experience,
          specialization,
          hireButtonLink,
          price,
          rating,
          reviewCount,
          activeStudents,
          totalLessons,
          languagesSpoken,
          profilePDF
        },
        testimonials[] -> {
          _id,
          reviewerName,
          reviewerType,
          testimonialText,
          rating,
          order
        },
        faqSection -> {
          title,
          subtitle,
          faqReferences[] -> {
            _id,
            question,
            answer
          }
        },
        seo,
        "sourceInfo": {
          "source": "default",
          "cloneId": null
        }
      }
    }`;

    // Enhanced testimonial section query with clone support
    const testimonialsQuery = `
      *[_type == "testimonialSection"][0] {
        maxDisplayCount,
        rating,
        subtitle,
        totalReviews,
        tutorChaseLink
      }
    `;

    const [fallbackResult, testimonialSection, navbarResult] = await Promise.all([
      client.fetch(query, { subject, cloneId: cloneId || 'none' }, { next: { revalidate: 300 } }),
      client.fetch(testimonialsQuery, {}, { next: { revalidate: 300 } }),
      navbarQueries.fetch(cloneId || 'global')
    ]);
    
    // Resolve using 3-tier fallback: cloneSpecific → baseline → default
    let pageData: CurriculumPageData | null = null;
    let resolvedSource = 'none';
    
    if (fallbackResult.cloneSpecific) {
      pageData = fallbackResult.cloneSpecific;
      resolvedSource = 'cloneSpecific';
      console.log(`[CurriculumPage] Using clone-specific content for ${subject}, clone: ${cloneId}`);
    } else if (fallbackResult.baseline) {
      pageData = fallbackResult.baseline;
      resolvedSource = 'baseline';
      console.log(`[CurriculumPage] Using baseline content for ${subject}`);
    } else if (fallbackResult.default) {
      pageData = fallbackResult.default;
      resolvedSource = 'default';
      console.log(`[CurriculumPage] Using default content for ${subject}`);
    }
    
    if (!pageData) {
      console.log(`[CurriculumPage] No curriculum page found for subject: ${subject}, clone: ${cloneId || 'none'}`);
      return { pageData: null, testimonialSection: null, navbarData: null, type: null };
    }
    
    console.log(`[CurriculumPage] Successfully fetched curriculum page data for: ${subject} (source: ${resolvedSource})`);
    return { pageData, testimonialSection, navbarData: navbarResult?.data || null, type: 'curriculum' };
  } catch (error) {
    console.error(`[CurriculumPage] Error fetching curriculum page for ${subject}:`, error);
    return { pageData: null, testimonialSection: null, navbarData: null, type: null };
  }
}

/**
 * Enhanced clone-aware subject page data fetcher  
 */
async function getSubjectPageDataWithCloneContext(
  subject: string,
  cloneId: string | null = null
): Promise<{ pageData: SubjectPageData | null; heroData: any | null; testimonialSection: any | null; navbarData: any | null; type: string | null }> {
  try {
    console.log(`[SubjectPage] Fetching data for subject: ${subject}, clone: ${cloneId || 'none'}`);
    
    // Enhanced clone-aware query with 3-tier fallback
    const query = `{
      "cloneSpecific": {
        "subjectPage": *[_type == "subjectPage" && (
          slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
        ) && cloneReference->cloneId.current == $cloneId && (isActive == true || !defined(isActive))][0]{
          _id,
          subject,
          title,
          firstSection,
          tutorsListSectionHead,
          showTrustedInstitutionsAfterTutors,
          showAdvertBlockAfterTutors,
          showPlatformBannerAfterTutors,
          externalRedirectEnabled,
          externalRedirectUrl,
          externalRedirectPermanent,
          testimonials[]->{
            _id,
            reviewerName,
            reviewerType,
            testimonialText,
            rating,
            order
          },
          faqSection-> {
            _id,
            title,
            subtitle,
            pageType,
            subjectPage-> { slug },
            faqReferences[]-> {
              _id,
              question,
              answer,
              displayOrder
            }
          },
          seo,
          "sourceInfo": {
            "source": "cloneSpecific",
            "cloneId": $cloneId
          }
        },
        "heroData": *[_type == "subjectHeroSection" && (
          subjectPage->slug.current == $subject || replace(subjectPage->slug.current, "^/", "") == $subject || lower(subjectPage->subject) == lower($subject) || lower(replace(subjectPage->subject, /\s+/, '-')) == lower($subject)
        ) && cloneReference->cloneId.current == $cloneId][0]{
          rating {
            score,
            basedOnText,
            reviewCount
          },
          title {
            firstPart,
            secondPart
          },
          subtitle,
          "sourceInfo": {
            "source": "cloneSpecific",
            "cloneId": $cloneId
          }
        },
        // Tutors referencing this subject page
        "tutorsRef": *[_type == "tutor" && references(*[_type == "subjectPage" && (
          slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
        ) && cloneReference->cloneId.current == $cloneId && (isActive == true || !defined(isActive))][0]._id)] | order(displayOrder asc) {
          _id,
          name,
          professionalTitle,
          priceTag {
            enabled,
            badgeText
          },
          experience,
          profilePhoto,
          specialization,
          hireButtonLink,
          displayOnSubjectPages,
          displayOrder,
          profilePDF {
            asset-> {
              url
            }
          },
          price,
          rating,
          reviewCount,
          activeStudents,
          totalLessons,
          languagesSpoken
        },
        // Tutors directly listed on the subject page (tutorsList)
        "tutorsInline": *[_type == "subjectPage" && (
          slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
        ) && cloneReference->cloneId.current == $cloneId && (isActive == true || !defined(isActive))][0].tutorsList[]->| order(displayOrder asc) {
          _id,
          name,
          professionalTitle,
          priceTag { enabled, badgeText },
          experience,
          profilePhoto,
          specialization,
          hireButtonLink,
          displayOnSubjectPages,
          displayOrder,
          profilePDF { asset->{ url } },
          price,
          rating,
          reviewCount,
          activeStudents,
          totalLessons,
          languagesSpoken
        }
      },
      "baseline": {
        "subjectPage": *[_type == "subjectPage" && (
          slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
        ) && cloneReference->baselineClone == true && (isActive == true || !defined(isActive))][0]{
          _id,
          subject,
          title,
          firstSection,
          tutorsListSectionHead,
          showTrustedInstitutionsAfterTutors,
          showAdvertBlockAfterTutors,
          showPlatformBannerAfterTutors,
          externalRedirectEnabled,
          externalRedirectUrl,
          externalRedirectPermanent,
          testimonials[]->{
            _id,
            reviewerName,
            reviewerType,
            testimonialText,
            rating,
            order
          },
          faqSection-> {
            _id,
            title,
            subtitle,
            pageType,
            subjectPage-> { slug },
            faqReferences[]-> {
              _id,
              question,
              answer,
              displayOrder
            }
          },
          seo,
          "sourceInfo": {
            "source": "baseline",
            "cloneId": cloneReference->cloneId.current
          }
        },
        "heroData": *[_type == "subjectHeroSection" && (
          subjectPage->slug.current == $subject || replace(subjectPage->slug.current, "^/", "") == $subject || lower(subjectPage->subject) == lower($subject) || lower(replace(subjectPage->subject, /\s+/, '-')) == lower($subject)
        ) && cloneReference->baselineClone == true][0]{
          rating {
            score,
            basedOnText,
            reviewCount
          },
          title {
            firstPart,
            secondPart
          },
          subtitle,
          "sourceInfo": {
            "source": "baseline",
            "cloneId": cloneReference->cloneId.current
          }
        },
        "tutorsRef": *[_type == "tutor" && references(*[_type == "subjectPage" && (
          slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
        ) && cloneReference->baselineClone == true && (isActive == true || !defined(isActive))][0]._id)] | order(displayOrder asc) {
          _id,
          name,
          professionalTitle,
          priceTag {
            enabled,
            badgeText
          },
          experience,
          profilePhoto,
          specialization,
          hireButtonLink,
          displayOnSubjectPages,
          displayOrder,
          profilePDF {
            asset-> {
              url
            }
          },
          price,
          rating,
          reviewCount,
          activeStudents,
          totalLessons,
          languagesSpoken
        },
        "tutorsInline": *[_type == "subjectPage" && (
          slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
        ) && cloneReference->baselineClone == true && (isActive == true || !defined(isActive))][0].tutorsList[]->| order(displayOrder asc) {
          _id,
          name,
          professionalTitle,
          priceTag { enabled, badgeText },
          experience,
          profilePhoto,
          specialization,
          hireButtonLink,
          displayOnSubjectPages,
          displayOrder,
          profilePDF { asset->{ url } },
          price,
          rating,
          reviewCount,
          activeStudents,
          totalLessons,
          languagesSpoken
        }
      },
      "default": {
        "subjectPage": *[_type == "subjectPage" && (
          slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
        ) && !defined(cloneReference) && (isActive == true || !defined(isActive))][0]{
          _id,
          subject,
          title,
          firstSection,
          tutorsListSectionHead,
          showTrustedInstitutionsAfterTutors,
          showAdvertBlockAfterTutors,
          showPlatformBannerAfterTutors,
          externalRedirectEnabled,
          externalRedirectUrl,
          externalRedirectPermanent,
          testimonials[]->{
            _id,
            reviewerName,
            reviewerType,
            testimonialText,
            rating,
            order
          },
          faqSection-> {
            _id,
            title,
            subtitle,
            pageType,
            subjectPage-> { slug },
            faqReferences[]-> {
              _id,
              question,
              answer,
              displayOrder
            }
          },
          seo,
          "sourceInfo": {
            "source": "default",
            "cloneId": null
          }
        },
        "heroData": *[_type == "subjectHeroSection" && (
          subjectPage->slug.current == $subject || replace(subjectPage->slug.current, "^/", "") == $subject || lower(subjectPage->subject) == lower($subject) || lower(replace(subjectPage->subject, /\s+/, '-')) == lower($subject)
        ) && !defined(cloneReference)][0]{
          rating {
            score,
            basedOnText,
            reviewCount
          },
          title {
            firstPart,
            secondPart
          },
          subtitle,
          "sourceInfo": {
            "source": "default",
            "cloneId": null
          }
        },
        "tutorsRef": *[_type == "tutor" && references(*[_type == "subjectPage" && (
          slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
        ) && !defined(cloneReference) && (isActive == true || !defined(isActive))][0]._id)] | order(displayOrder asc) {
          _id,
          name,
          professionalTitle,
          priceTag {
            enabled,
            badgeText
          },
          experience,
          profilePhoto,
          specialization,
          hireButtonLink,
          displayOnSubjectPages,
          displayOrder,
          profilePDF {
            asset-> {
              url
            }
          },
          price,
          rating,
          reviewCount,
          activeStudents,
          totalLessons,
          languagesSpoken
        },
        "tutorsInline": *[_type == "subjectPage" && (
          slug.current == $subject || replace(slug.current, "^/", "") == $subject || lower(subject) == lower($subject) || lower(replace(subject, /\s+/, '-')) == lower($subject)
        ) && !defined(cloneReference) && (isActive == true || !defined(isActive))][0].tutorsList[]->| order(displayOrder asc) {
          _id,
          name,
          professionalTitle,
          priceTag { enabled, badgeText },
          experience,
          profilePhoto,
          specialization,
          hireButtonLink,
          displayOnSubjectPages,
          displayOrder,
          profilePDF { asset->{ url } },
          price,
          rating,
          reviewCount,
          activeStudents,
          totalLessons,
          languagesSpoken
        }
      },
      "testimonialSection": *[_type == "testimonialSection"][0]
    }`;

    // Use server-side caching with Next.js and fetch clone-aware FAQ and navbar
    const [fallbackResult, navbarResult] = await Promise.all([
      client.fetch(query, { subject, cloneId: cloneId || 'none' }, { next: { revalidate: 300 } }),
      navbarQueries.fetch(cloneId || 'global')
    ]);

    // Resolve using 3-tier fallback: cloneSpecific → baseline → default
    let resolvedData: { subjectPage: any; tutorsRef?: any[]; tutorsInline?: any[] } | null = null;
    let resolvedSource = 'none';
    
    if (fallbackResult.cloneSpecific?.subjectPage) {
      resolvedData = fallbackResult.cloneSpecific;
      resolvedSource = 'cloneSpecific';
      console.log(`[SubjectPage] Using clone-specific content for ${subject}, clone: ${cloneId}`);
    } else if (fallbackResult.baseline?.subjectPage) {
      resolvedData = fallbackResult.baseline;
      resolvedSource = 'baseline';
      console.log(`[SubjectPage] Using baseline content for ${subject}`);
    } else if (fallbackResult.default?.subjectPage) {
      resolvedData = fallbackResult.default;
      resolvedSource = 'default';
      console.log(`[SubjectPage] Using default content for ${subject}`);
    }

    if (!resolvedData?.subjectPage) {
      console.log(`[SubjectPage] No subject page found for subject: ${subject}, clone: ${cloneId || 'none'}`);
      return { pageData: null, heroData: null, testimonialSection: null, navbarData: null, type: null };
    }

    // Merge tutors from inline list and reference-based query, removing duplicates by _id
    const mergedTutorsMap: Record<string, any> = {};
    (resolvedData.tutorsInline || []).forEach((t: any) => { if (t?._id) mergedTutorsMap[t._id] = t; });
    (resolvedData.tutorsRef || []).forEach((t: any) => { if (t?._id) mergedTutorsMap[t._id] = { ...mergedTutorsMap[t._id], ...t }; });
    const mergedTutors = Object.values(mergedTutorsMap).sort((a: any, b: any) => (a.displayOrder || 100) - (b.displayOrder || 100));

    // Only accept FAQ data that truly belongs to this subject page
    const faqData = resolvedData.subjectPage?.faqSection;
    const isSubjectFaqForThisPage = Boolean(
      faqData && faqData.pageType === 'subject' && faqData.subjectPage?.slug?.current === subject
    );

    const pageData: SubjectPageData = {
      ...resolvedData.subjectPage,
      tutorsList: mergedTutors,
      faqSection: isSubjectFaqForThisPage ? faqData : null,
    };

    // Resolve hero data using same fallback logic
    let heroData = null;
    if (fallbackResult.cloneSpecific?.heroData) {
      heroData = fallbackResult.cloneSpecific.heroData;
    } else if (fallbackResult.baseline?.heroData) {
      heroData = fallbackResult.baseline.heroData;
    } else if (fallbackResult.default?.heroData) {
      heroData = fallbackResult.default.heroData;
    }

    console.log(`[SubjectPage] Successfully fetched subject page data for: ${subject} (source: ${resolvedSource})`);
    console.log(`[SubjectPage] Hero data ${heroData ? 'found' : 'not found'} for: ${subject}`);
    
    return { 
      pageData, 
      heroData,
      testimonialSection: fallbackResult.testimonialSection, 
      navbarData: navbarResult?.data || null, 
      type: 'subject' 
    };
  } catch (error) {
    console.error(`[SubjectPage] Error fetching subject page for ${subject}:`, error);
    return { pageData: null, heroData: null, testimonialSection: null, navbarData: null, type: null };
  }
}

export async function generateMetadata({ params }: { params: { subject: string } }): Promise<Metadata> {
  // Get clone-aware SEO data that will automatically detect clone from middleware headers
  const cloneSeoData = await getSeoData();
  const canonicalPath = `/${params.subject}`;
  // Compute absolute canonical URL (domain/subject)
  const currentDomain = getCurrentDomainFromHeaders();
  const canonicalHost = getCanonicalDomain(currentDomain || '');
  const isLocal = canonicalHost.includes('localhost') || canonicalHost.includes('127.0.0.1') || canonicalHost.includes('.local');
  const protocol = isLocal ? 'http' : 'https';
  const baseUrlString = canonicalHost ? `${protocol}://${canonicalHost}` : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dubaitutors.ae');
  const canonicalUrl = new URL(canonicalPath, baseUrlString).toString();
  
  // Resolve cloneId so we fetch clone-specific page SEO (matches page render logic)
  const cloneId = await getCloneIdForCurrentDomain();
  
  // Helper: extract brand from global title (last segment after '|') or fallback
  const brandFromSeo = (() => {
    const t = (cloneSeoData?.title || '').trim();
    if (!t) return 'IB Tutors';
    const parts = t.split('|').map(s => s.trim()).filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  })();
  
  // First check if it's a curriculum page
  const curriculumResult = await getCurriculumPageDataWithCloneContext(params.subject, cloneId);
  
  if (curriculumResult.pageData) {
    // BreadcrumbList JSON-LD
    const breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Curricula', item: '/curricula' },
      { '@type': 'ListItem', position: 3, name: curriculumResult.pageData.curriculum || curriculumResult.pageData.title, item: canonicalPath },
    ];

    // Build dynamic title/description that gracefully omit missing parts
    const curriculumName = curriculumResult.pageData.curriculum || curriculumResult.pageData.title || '';
    const dynamicTitle = [
      curriculumName ? `${curriculumName} Tutors` : '',
      brandFromSeo,
    ].filter(Boolean).join(' | ');
    const dynamicDescription = `${curriculumName ? `Specialist ${curriculumName} tutoring.` : 'Specialist tutoring.'} Online or in-person. Get matched today.`;

    // Prefer page-specific SEO; then dynamic template; then global fallbacks
    return {
      title: curriculumResult.pageData.seo?.pageTitle || dynamicTitle || curriculumResult.pageData.title || cloneSeoData.title,
      description: curriculumResult.pageData.seo?.description || dynamicDescription || cloneSeoData.description || `Find expert tutors${curriculumName ? ` for ${curriculumName}` : ''}.`,
      alternates: { canonical: canonicalUrl },
    };
  }
  
  // If not, check if it's a subject page
  const { pageData } = await getSubjectPageDataWithCloneContext(params.subject, cloneId);

  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  // Subject branch: build dynamic, omission-friendly SEO
  const subjectName = pageData.subject || pageData.title || '';
  const dynamicTitle = [
    subjectName ? `${subjectName} Tutors` : '',
    brandFromSeo,
  ].filter(Boolean).join(' | ');
  const dynamicDescription = `${subjectName ? `Expert ${subjectName} tutoring.` : 'Expert tutoring.'} Online or in-person. Book a free call.`;

  // Prefer page-specific SEO; then dynamic template; then global fallback
  return {
    title: pageData.seo?.pageTitle || dynamicTitle || `${pageData.title} | ${brandFromSeo}`,
    description: pageData.seo?.description || dynamicDescription || cloneSeoData.description || 'Find expert tutors for your subject.',
    alternates: { canonical: canonicalUrl },
  };
}

export default async function DynamicPage({ 
  params, 
  searchParams 
}: { 
  params: { subject: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Compute absolute base URL for JSON-LD (domain/*)
  const currentDomain = getCurrentDomainFromHeaders();
  const canonicalHost = getCanonicalDomain(currentDomain || '');
  const isLocal = canonicalHost.includes('localhost') || canonicalHost.includes('127.0.0.1') || canonicalHost.includes('.local');
  const protocol = isLocal ? 'http' : 'https';
  const baseUrlString = canonicalHost ? `${protocol}://${canonicalHost}` : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dubaitutors.ae');
  // Convert searchParams to URLSearchParams for clone detection
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (typeof value === 'string') {
      urlSearchParams.set(key, value);
    } else if (Array.isArray(value)) {
      urlSearchParams.set(key, value[0] || '');
    }
  });



  // Get enhanced clone-aware data for the page
  const { cloneContext, cloneData, debugInfo } = await getCloneAwarePageData(
    urlSearchParams,
    async (cloneId: string | null) => null, // We'll handle page data separately
    `Subject: ${params.subject}`
  );

  // Fetch global/clone-specific Tutor Profiles section to use its Trusted By text as fallback
  const tutorProfilesSectionResult = await tutorProfilesSectionQueries.fetch(cloneContext.cloneId || 'global');
  const globalTrustedByText = tutorProfilesSectionResult?.data?.trustedByText as string | undefined;

  // Fetch Advert Block and Platform Banner content for this clone
  const [advertBlockContent, platformBannerContent] = await Promise.all([
    advertBlockSectionQueries.fetch(cloneContext.cloneId || 'global'),
    platformBannerQueries.fetch(cloneContext.cloneId || 'global'),
  ]);

  const advertBlockSection = advertBlockContent?.data
    ? cloneQueryUtils.getContentWithCustomizations(advertBlockContent)
    : null;
  const platformBanner = platformBannerContent?.data
    ? cloneQueryUtils.getContentWithCustomizations(platformBannerContent)
    : null;

  // Fetch Trusted Institutions banner
  const trustedInstitutionsContent = await trustedInstitutionsQueries.fetch(cloneContext.cloneId || 'global');
  const trustedInstitutionsBanner = trustedInstitutionsContent?.data
    ? cloneQueryUtils.getContentWithCustomizations(trustedInstitutionsContent)
    : null;

  // Generate clone indicator props
  const cloneIndicatorProps = getCloneIndicatorData(
    cloneContext,
    cloneData,
    debugInfo,
    `Subject: ${params.subject}`
  );

  // If clone flags disable this route, block accordingly
  if (cloneContext.clone?.homepageOnly) {
    return notFound();
  }

  // First check if it's a curriculum page (always try; do not block by flags)
  const curriculumResult = await getCurriculumPageDataWithCloneContext(
    params.subject, 
    cloneContext.cloneId
  );
  
  if (curriculumResult.pageData) {
    // If curriculum has external redirect configured, perform it
    if (curriculumResult.pageData.externalRedirectEnabled && curriculumResult.pageData.externalRedirectUrl) {
      const targetUrl = curriculumResult.pageData.externalRedirectUrl;
      if (curriculumResult.pageData.externalRedirectPermanent) {
        permanentRedirect(targetUrl);
      } else {
        redirect(targetUrl);
      }
    }

    // Fetch curriculum-specific hero data with clone context
    const curriculumHeroData = await getCurriculumHeroData(params.subject, cloneContext.cloneId);
    
    // Render curriculum page with clone context
    return (
      <main>
        {/* BreadcrumbList JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrlString}/` },
                { '@type': 'ListItem', position: 2, name: 'Curricula', item: `${baseUrlString}/curricula` },
                { '@type': 'ListItem', position: 3, name: curriculumResult.pageData.curriculum || curriculumResult.pageData.title, item: `${baseUrlString}/${params.subject}` },
              ],
            }),
          }}
        />
        {/* Enhanced Clone Debug Panel - Development Only */}
        <CloneIndicatorBanner {...cloneIndicatorProps} />
        
        {/* New Hero Section - using curriculum hero data */}
        <SubjectHeroSection subjectSlug={params.subject} heroData={curriculumHeroData} />

        {/* Tutors Section */}
        <TutorProfiles 
          tutors={curriculumResult.pageData.tutorsList} 
          useNewCardDesign={true}
          trustedByText={curriculumResult.pageData.tutorsListSectionHead?.trustedByText ?? globalTrustedByText}
          sectionTitle={curriculumResult.pageData.tutorsListSectionHead?.sectionTitle}
          description={curriculumResult.pageData.tutorsListSectionHead?.description}
          ctaRichText={curriculumResult.pageData.tutorsListSectionHead?.ctaRichText}
          ctaText={curriculumResult.pageData.tutorsListSectionHead?.ctaLinkText}
          ctaLink={curriculumResult.pageData.tutorsListSectionHead?.ctaLink}
          tutorProfileSectionPriceDescription={curriculumResult.pageData.tutorsListSectionHead?.tutorProfileSectionPriceDescription}
          tutorProfileSectionPriceTag={curriculumResult.pageData.tutorsListSectionHead?.tutorProfileSectionPriceTag}
        />

        {/* Trusted Institutions Banner (before Advert Block) */}
        {curriculumResult.pageData.showTrustedInstitutionsAfterTutors &&
         trustedInstitutionsBanner?.enabled !== false &&
         Array.isArray(trustedInstitutionsBanner?.institutions) &&
         trustedInstitutionsBanner.institutions.length > 0 ? (
          <TrustedInstitutionsBanner
            title={trustedInstitutionsBanner.title}
            subtitle={trustedInstitutionsBanner.subtitle}
            institutions={trustedInstitutionsBanner.institutions}
            backgroundColor={trustedInstitutionsBanner.backgroundColor}
            carouselSpeed={trustedInstitutionsBanner.carouselSpeed}
          />
        ) : null}

        {/* Advert Block and Platform Banner (in that order) after Tutor Profiles */}
        {curriculumResult.pageData.showAdvertBlockAfterTutors && advertBlockSection?.enabled !== false ? (
          <AdvertBlock sectionData={advertBlockSection} />
        ) : null}
        {curriculumResult.pageData.showPlatformBannerAfterTutors ? (
          <TutoringPlatformBanner data={platformBanner as PlatformBannerData} />
        ) : null}

        {/* Testimonials Section */}
        {curriculumResult.pageData.testimonials && curriculumResult.testimonialSection && (
          <TestimonialSection
            sectionData={{
              rating: curriculumResult.testimonialSection.rating,
              totalReviews: curriculumResult.testimonialSection.totalReviews,
              subtitle: curriculumResult.testimonialSection.subtitle,
              tutorChaseLink: curriculumResult.testimonialSection.tutorChaseLink,
              maxDisplayCount: curriculumResult.testimonialSection.maxDisplayCount
            }} 
            testimonials={curriculumResult.pageData.testimonials}
          />
        )}

        {/* Contact Form */}
        <ContactForm />

        {/* FAQ Section - use shared component for consistent UI */}
        {curriculumResult.pageData.faqSection &&
         curriculumResult.pageData.faqSection.faqReferences &&
         curriculumResult.pageData.faqSection.faqReferences.length > 0 && (
          <FAQSection
            sectionData={{
              title: curriculumResult.pageData.faqSection.title,
              subtitle: curriculumResult.pageData.faqSection.subtitle,
            }}
            faqs={curriculumResult.pageData.faqSection.faqReferences}
          />
        )}

        {/* FAQPage JSON-LD */}
        {curriculumResult.pageData.faqSection && curriculumResult.pageData.faqSection.faqReferences && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: curriculumResult.pageData.faqSection.faqReferences.map((faq: any) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: { 
                    '@type': 'Answer', 
                    text: Array.isArray(faq.answer)
                      ? faq.answer.map((block: any) => {
                          if (block?._type === 'block' && Array.isArray(block.children)) {
                            return block.children.map((c: any) => c.text).join('');
                          }
                          return '';
                        }).join('\n')
                      : faq.answer 
                  },
                })),
              }),
            }}
          />
        )}

        {/* Spacer to prevent footer negative margin from overlapping the last section */}
        <div className="h-32" aria-hidden />

      </main>
    );
  }
  
  // If not a curriculum page, check if it's a subject page (always try; do not block by flags)
  const subjectResult = await getSubjectPageDataWithCloneContext(
    params.subject,
    cloneContext.cloneId
  );

  if (subjectResult.pageData) {
    // Check for external redirect override
    if (subjectResult.pageData.externalRedirectEnabled && subjectResult.pageData.externalRedirectUrl) {
      const targetUrl = subjectResult.pageData.externalRedirectUrl;
      if (subjectResult.pageData.externalRedirectPermanent) {
        permanentRedirect(targetUrl);
      } else {
        redirect(targetUrl);
      }
    }
    // Debug what data we're working with
    console.log(`[SubjectPageRender] Rendering subject page for: ${params.subject}`);
    console.log(`[SubjectPageRender] Clone ID: ${cloneContext.cloneId}`);
    console.log(`[SubjectPageRender] Clone Name: ${cloneContext.clone?.cloneName}`);
    console.log(`[SubjectPageRender] Tutors Section Title: ${subjectResult.pageData.tutorsListSectionHead?.sectionTitle}`);
    console.log(`[SubjectPageRender] Tutors Section Description: ${subjectResult.pageData.tutorsListSectionHead?.description?.substring(0, 80)}...`);
    console.log(`[SubjectPageRender] Hero Data: ${subjectResult.heroData ? 'Present' : 'Missing'}`);
    
    // Render subject page with clone context
    return (
      <main>
        {/* BreadcrumbList JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrlString}/` },
                { '@type': 'ListItem', position: 2, name: 'Subjects', item: `${baseUrlString}/subjects` },
                { '@type': 'ListItem', position: 3, name: subjectResult.pageData.subject || subjectResult.pageData.title, item: `${baseUrlString}/${params.subject}` },
              ],
            }),
          }}
        />
        {/* Enhanced Clone Debug Panel - Development Only */}
        <CloneIndicatorBanner {...cloneIndicatorProps} />
        
        {/* New Hero Section */}
        <SubjectHeroSection 
          subjectSlug={params.subject} 
          heroData={subjectResult.heroData}
          key={`hero-${cloneContext.cloneId}-${params.subject}`} // Force re-render when clone changes
        />

        {/* Tutors Section */}
        <TutorProfiles 
          tutors={subjectResult.pageData.tutorsList} 
          useNewCardDesign={true}
          trustedByText={subjectResult.pageData.tutorsListSectionHead?.trustedByText ?? globalTrustedByText}
          sectionTitle={subjectResult.pageData.tutorsListSectionHead?.sectionTitle}
          description={subjectResult.pageData.tutorsListSectionHead?.description}
          ctaRichText={subjectResult.pageData.tutorsListSectionHead?.ctaRichText}
          ctaText={subjectResult.pageData.tutorsListSectionHead?.ctaLinkText}
          ctaLink={subjectResult.pageData.tutorsListSectionHead?.ctaLink}
          tutorProfileSectionPriceDescription={subjectResult.pageData.tutorsListSectionHead?.tutorProfileSectionPriceDescription}
          tutorProfileSectionPriceTag={subjectResult.pageData.tutorsListSectionHead?.tutorProfileSectionPriceTag}
        />

        {/* Trusted Institutions Banner (before Advert Block) */}
        {subjectResult.pageData.showTrustedInstitutionsAfterTutors &&
         trustedInstitutionsBanner?.enabled !== false &&
         Array.isArray(trustedInstitutionsBanner?.institutions) &&
         trustedInstitutionsBanner.institutions.length > 0 ? (
          <TrustedInstitutionsBanner
            title={trustedInstitutionsBanner.title}
            subtitle={trustedInstitutionsBanner.subtitle}
            institutions={trustedInstitutionsBanner.institutions}
            backgroundColor={trustedInstitutionsBanner.backgroundColor}
            carouselSpeed={trustedInstitutionsBanner.carouselSpeed}
          />
        ) : null}

        {/* Advert Block and Platform Banner (in that order) after Tutor Profiles */}
        {subjectResult.pageData.showAdvertBlockAfterTutors && advertBlockSection?.enabled !== false ? (
          <AdvertBlock sectionData={advertBlockSection} />
        ) : null}
        {subjectResult.pageData.showPlatformBannerAfterTutors ? (
          <TutoringPlatformBanner data={platformBanner as PlatformBannerData} />
        ) : null}

        {/* Testimonials Section */}
        {subjectResult.pageData.testimonials && subjectResult.testimonialSection && (
          <TestimonialSection 
            sectionData={subjectResult.testimonialSection} 
            testimonials={subjectResult.pageData.testimonials} 
          />
        )}

        {/* FAQ Section - Optional (strict subject-only guard) */}
        {(() => {
          const faq = subjectResult.pageData.faqSection as any;
          const shouldRender = Boolean(
            faq &&
            faq.pageType === 'subject' &&
            faq.subjectPage?.slug?.current === params.subject &&
            Array.isArray(faq.faqReferences) &&
            faq.faqReferences.length > 0
          );
          return shouldRender ? (
            <FAQSection
              sectionData={{ title: faq.title, subtitle: faq.subtitle }}
              faqs={faq.faqReferences}
            />
          ) : null;
        })()}

        {/* FAQPage JSON-LD */}
        {subjectResult.pageData.faqSection && subjectResult.pageData.faqSection.faqReferences && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: subjectResult.pageData.faqSection.faqReferences.map((faq: any) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: { 
                    '@type': 'Answer', 
                    text: Array.isArray(faq.answer)
                      ? faq.answer.map((block: any) => {
                          if (block?._type === 'block' && Array.isArray(block.children)) {
                            return block.children.map((c: any) => c.text).join('');
                          }
                          return '';
                        }).join('\n')
                      : faq.answer 
                  },
                })),
              }),
            }}
          />
        )}

        <ContactForm />
      </main>
    );
  }

  // Handle 404 case
  return notFound();
} 
