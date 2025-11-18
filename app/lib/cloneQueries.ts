import { client } from '@/sanity/lib/client';

/**
 * Content source types for the fallback hierarchy
 */
export type ContentSource = 'cloneSpecific' | 'baseline' | 'default';

/**
 * Result interface that includes both data and source information
 */
export interface ContentResult<T> {
  data: T | null;
  source: ContentSource | null;
  cloneId?: string;
  isBaseline?: boolean;
}

/**
 * Generic 3-tier fallback query builder
 */
export function buildFallbackQuery(
  contentType: string,
  cloneId: string,
  additionalFields: string = '',
  additionalFilter: string = ''
): string {
  const baseFilter = additionalFilter ? ` && ${additionalFilter}` : '';
  const fields = additionalFields || `
    _id,
    _type,
    _createdAt,
    _updatedAt,
    isActive,
    cloneReference,
    cloneSpecificData
  `;

  return `{
    "cloneSpecific": *[_type == "${contentType}" && cloneReference->cloneId.current == "${cloneId}" && (!defined(isActive) || isActive == true)${baseFilter}] | order(_updatedAt desc, _createdAt desc)[0] {
      ${fields},
      "sourceInfo": {
        "source": "cloneSpecific",
        "cloneId": "${cloneId}",
        "isBaseline": cloneReference->baselineClone
      }
    },
    "baseline": *[_type == "${contentType}" && cloneReference->baselineClone == true && (!defined(isActive) || isActive == true)${baseFilter}] | order(_updatedAt desc, _createdAt desc)[0] {
      ${fields},
      "sourceInfo": {
        "source": "baseline",
        "cloneId": cloneReference->cloneId.current,
        "isBaseline": true
      }
    },
    "default": *[_type == "${contentType}" && !defined(cloneReference) && (!defined(isActive) || isActive == true)${baseFilter}] | order(_updatedAt desc, _createdAt desc)[0] {
      ${fields},
      "sourceInfo": {
        "source": "default",
        "cloneId": null,
        "isBaseline": false
      }
    }
  }`;
}

/**
 * Resolve content using fallback hierarchy: cloneSpecific -> baseline -> default
 */
export function resolveContent<T>(fallbackResult: {
  cloneSpecific: T | null;
  baseline: T | null;
  default: T | null;
}): ContentResult<T> {
  if (fallbackResult.cloneSpecific) {
    return {
      data: fallbackResult.cloneSpecific,
      source: 'cloneSpecific',
      cloneId: (fallbackResult.cloneSpecific as any)?.sourceInfo?.cloneId,
      isBaseline: (fallbackResult.cloneSpecific as any)?.sourceInfo?.isBaseline,
    };
  }

  if (fallbackResult.baseline) {
    return {
      data: fallbackResult.baseline,
      source: 'baseline',
      cloneId: (fallbackResult.baseline as any)?.sourceInfo?.cloneId,
      isBaseline: true,
    };
  }

  if (fallbackResult.default) {
    return {
      data: fallbackResult.default,
      source: 'default',
      cloneId: undefined,
      isBaseline: false,
    };
  }

  return {
    data: null,
    source: null,
  };
}

/**
 * HERO SECTION QUERIES
 */
export const heroQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'hero',
    cloneId,
    `
    _id,
    titleFirstRow,
    titleSecondRow,
    subtitle,
    mainImage,
    primaryButton,
    features,
    rating,
    isActive,
    cloneReference,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = heroQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * SEO SETTINGS QUERIES
 */
export const seoQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'seoSettings',
    cloneId,
    `
    _id,
    title,
    description,
    isActive,
    cloneReference,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = seoQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * FOOTER SECTION QUERIES
 */
export const footerQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'footerSection',
    cloneId,
    `
    _id,
    title,
    phone,
    phoneLink,
    whatsapp,
    whatsappLink,
    address,
    addressLink,
    tutorchaseLink,
    isActive,
    cloneReference,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = footerQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * TUTOR QUERIES
 */
export const tutorQueries = {
  buildQuery: (cloneId: string, additionalFilter: string = '') => buildFallbackQuery(
    'tutor',
    cloneId,
    `
    _id,
    name,
    professionalTitle,
    displayOrder,
    priceTag,
    displayOnHomepage,
    displayOnSubjectPages,
    experience,
    profilePhoto,
    specialization,
    yearsOfExperience,
    hireButtonLink,
    profilePDF,
    price,
    rating,
    reviewCount,
    activeStudents,
    totalLessons,
    languagesSpoken,
    isActive,
    cloneReference,
    cloneSpecificData
    `,
    additionalFilter
  ),

  async fetchHomepageTutors(cloneId: string): Promise<ContentResult<any[]>> {
    const query = `{
      "cloneSpecific": *[_type == "tutor" && cloneReference->cloneId.current == "${cloneId}" && isActive == true && displayOnHomepage == true] | order(displayOrder asc) {
        _id,
        name,
        professionalTitle,
        displayOrder,
        priceTag,
        displayOnHomepage,
        experience,
        profilePhoto,
        specialization,
        yearsOfExperience,
        hireButtonLink,
        profilePDF,
        price,
        rating,
        reviewCount,
        activeStudents,
        totalLessons,
        languagesSpoken,
        isActive,
        cloneReference,
        cloneSpecificData,
        "sourceInfo": {
          "source": "cloneSpecific",
          "cloneId": "${cloneId}",
          "isBaseline": cloneReference->baselineClone
        }
      },
      "baseline": *[_type == "tutor" && cloneReference->baselineClone == true && isActive == true && displayOnHomepage == true] | order(displayOrder asc) {
        _id,
        name,
        professionalTitle,
        displayOrder,
        priceTag,
        displayOnHomepage,
        experience,
        profilePhoto,
        specialization,
        yearsOfExperience,
        hireButtonLink,
        profilePDF,
        price,
        rating,
        reviewCount,
        activeStudents,
        totalLessons,
        languagesSpoken,
        isActive,
        cloneReference,
        cloneSpecificData,
        "sourceInfo": {
          "source": "baseline",
          "cloneId": cloneReference->cloneId.current,
          "isBaseline": true
        }
      },
      "default": *[_type == "tutor" && !defined(cloneReference) && isActive == true && displayOnHomepage == true] | order(displayOrder asc) {
        _id,
        name,
        professionalTitle,
        displayOrder,
        priceTag,
        displayOnHomepage,
        experience,
        profilePhoto,
        specialization,
        yearsOfExperience,
        hireButtonLink,
        profilePDF,
        price,
        rating,
        reviewCount,
        activeStudents,
        totalLessons,
        languagesSpoken,
        isActive,
        cloneReference,
        cloneSpecificData,
        "sourceInfo": {
          "source": "default",
          "cloneId": null,
          "isBaseline": false
        }
      }
    }`;

    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    
    // For arrays, return the first non-empty array with highest priority
    if (result.cloneSpecific && result.cloneSpecific.length > 0) {
      return { data: result.cloneSpecific, source: 'cloneSpecific', cloneId };
    }
    if (result.baseline && result.baseline.length > 0) {
      return { data: result.baseline, source: 'baseline', isBaseline: true };
    }
    if (result.default && result.default.length > 0) {
      return { data: result.default, source: 'default' };
    }

    return { data: [], source: null };
  }
};

/**
 * TESTIMONIAL QUERIES
 */
export const testimonialQueries = {
  buildQuery: (cloneId: string) => `{
    "cloneSpecific": *[_type == "testimonial" && cloneReference->cloneId.current == "${cloneId}" && isActive == true] | order(order asc) {
      _id,
      reviewerName,
      reviewerType,
      testimonialText,
      rating,
      order,
      isActive,
      cloneReference,
      cloneSpecificData,
      "sourceInfo": {
        "source": "cloneSpecific",
        "cloneId": "${cloneId}",
        "isBaseline": cloneReference->baselineClone
      }
    },
    "baseline": *[_type == "testimonial" && cloneReference->baselineClone == true && isActive == true] | order(order asc) {
      _id,
      reviewerName,
      reviewerType,
      testimonialText,
      rating,
      order,
      isActive,
      cloneReference,
      cloneSpecificData,
      "sourceInfo": {
        "source": "baseline",
        "cloneId": cloneReference->cloneId.current,
        "isBaseline": true
      }
    },
    "default": *[_type == "testimonial" && !defined(cloneReference) && isActive == true] | order(order asc) {
      _id,
      reviewerName,
      reviewerType,
      testimonialText,
      rating,
      order,
      isActive,
      cloneReference,
      cloneSpecificData,
      "sourceInfo": {
        "source": "default",
        "cloneId": null,
        "isBaseline": false
      }
    }
  }`,

  async fetch(cloneId: string): Promise<ContentResult<any[]>> {
    const query = testimonialQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });

    if (result.cloneSpecific && result.cloneSpecific.length > 0) {
      return { data: result.cloneSpecific, source: 'cloneSpecific', cloneId };
    }
    if (result.baseline && result.baseline.length > 0) {
      return { data: result.baseline, source: 'baseline', isBaseline: true };
    }
    if (result.default && result.default.length > 0) {
      return { data: result.default, source: 'default' };
    }

    return { data: [], source: null };
  }
};

/**
 * PLATFORM BANNER QUERIES
 */
export const platformBannerQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'platformBanner',
    cloneId,
    `
    _id,
    title,
    subtitle,
    description,
    features,
    isActive,
    cloneReference,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = platformBannerQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * NAVBAR SETTINGS QUERIES
 */
export const navbarQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'navbarSettings',
    cloneId,
    `
    _id,
    logo,
    logoLink,
    navigation,
    mobileMenu,
    buttonText,
    buttonLink,
    isActive,
    cloneReference,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = navbarQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * TESTIMONIAL SECTION QUERIES
 */
export const testimonialSectionQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'testimonialSection',
    cloneId,
    `
    _id,
    rating,
    totalReviews,
    subtitle,
    tutorChaseLink,
    selectedTestimonials,
    maxDisplayCount,
    isActive,
    cloneReference,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = testimonialSectionQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * FAQ SECTION QUERIES
 */
export const faqSectionQueries = {
  buildQuery: (cloneId: string, pageType: string = 'homepage', subjectSlug?: string) => {
    // Build filter conditions
    let additionalFilter = `pageType == "${pageType}"`;
    
    if (pageType === 'subject' && subjectSlug) {
      // For subject pages, filter by specific subject if provided
      additionalFilter += ` && subjectPage->slug.current == "${subjectSlug}"`;
    } else if (pageType === 'subject' && !subjectSlug) {
      // For subject pages without specific subject, get general subject FAQs
      additionalFilter += ` && !defined(subjectPage)`;
    }
    
    return buildFallbackQuery(
      'faq_section',
      cloneId,
      `
      _id,
      title,
      subtitle,
      pageType,
      subjectPage-> {
        _id,
        title,
        subject,
        slug
      },
      faqReferences[]-> {
        _id,
        question,
        answer,
        displayOrder
      },
      isActive,
      cloneReference,
      cloneSpecificData
      `,
      additionalFilter
    );
  },

  async fetch(cloneId: string, pageType: string = 'homepage', subjectSlug?: string): Promise<ContentResult<any>> {
    const query = faqSectionQueries.buildQuery(cloneId, pageType, subjectSlug);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * HIGHLIGHTS SECTION QUERIES
 */
export const highlightsQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'highlightsSection',
    cloneId,
    `
    _id,
    highlights,
    isActive,
    cloneReference,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = highlightsQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * TUTOR PROFILES SECTION QUERIES
 */
export const tutorProfilesSectionQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'tutorProfilesSection',
    cloneId,
    `
    _id,
    title,
    subtitle,
    trustedByText,
    description,
    contactText,
    ctaRichText,
    ctaText,
    ctaLink,
    tutorProfileSectionPriceDescription,
    tutorProfileSectionPriceTag,
    isActive,
    cloneReference,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = tutorProfilesSectionQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * SUBJECT GRID SECTION QUERIES
 */
export const subjectGridSectionQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'subjectGridSection',
    cloneId,
    `
    _id,
    title,
    description,
    splitDescription,
    subjects,
    backgroundColor,
    enabled,
    isActive,
    cloneReference,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = subjectGridSectionQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * ADVERT BLOCK SECTION QUERIES
 */
export const advertBlockSectionQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'advertBlockSection',
    cloneId,
    `
    _id,
    title,
    subtitle,
    description,
    highlightText,
    highlightLink,
    pricingText,
    backgroundColor,
    enabled,
    displayOrder,
    isActive,
    cloneReference,
    customizations,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = advertBlockSectionQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * POST-TUTOR MID SECTION QUERIES
 */
export const postTutorMidSectionQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'postTutorMidSection',
    cloneId,
    `
    _id,
    enabled,
    title,
    subtitle,
    description,
    content,
    image,
    ctaText,
    ctaLink,
    backgroundColor,
    isActive,
    cloneReference,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = postTutorMidSectionQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * TRUSTED INSTITUTIONS BANNER QUERIES
 */
export const trustedInstitutionsQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'trustedInstitutionsBanner',
    cloneId,
    `
    _id,
    title,
    subtitle,
    institutions,
    backgroundColor,
    carouselSpeed,
    enabled,
    isActive,
    cloneReference,
    cloneSpecificData
    `
  ),

  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = trustedInstitutionsQueries.buildQuery(cloneId);
    const result = await client.fetch(query, {}, { next: { revalidate: 300 } });
    return resolveContent(result);
  }
};

/**
 * SUBJECT PAGE FAQ QUERIES
 */
export const subjectPageFaqQueries = {
  async fetch(cloneId: string | null, subjectSlug: string): Promise<ContentResult<any>> {
    // Handle global content (Dubai Tutors) when no cloneId
    if (!cloneId || cloneId === 'global') {
      // For global content, fetch FAQ sections without clone reference
      const globalSubjectSpecificQuery = `
        *[_type == "faq_section" && pageType == "subject" && subjectPage->slug.current == "${subjectSlug}" && !defined(cloneReference)][0] {
          _id,
          title,
          subtitle,
          pageType,
          subjectPage-> {
            _id,
            title,
            subject,
            slug
          },
          faqReferences[]-> {
            _id,
            question,
            answer,
            displayOrder
          } | order(displayOrder asc)
        }
      `;
      
      const subjectSpecificResult = await client.fetch(globalSubjectSpecificQuery, {}, { next: { revalidate: 300 } });
      // Do NOT fall back to general subject FAQs; keep sections separate
      return { data: subjectSpecificResult || null, source: subjectSpecificResult ? 'default' : null };
    }
    
    // For clone-specific content, use the existing logic
    const subjectSpecificResult = await faqSectionQueries.fetch(cloneId, 'subject', subjectSlug);
    
    if (subjectSpecificResult.data) {
      return subjectSpecificResult;
    }
    // Do NOT fall back to general subject FAQs for clone; return null
    return { data: null, source: null };
  }
};

/**
 * COMPREHENSIVE HOMEPAGE DATA QUERY
 * Fetches all homepage content in a single request with fallback hierarchy
 */
export const homepageQueries = {
  async fetchAll(cloneId: string): Promise<{
    hero: ContentResult<any>;
    highlights: ContentResult<any>;
    subjectGridSection: ContentResult<any>;
    advertBlockSection: ContentResult<any>;
    postTutorMidSection: ContentResult<any>;
    trustedInstitutions: ContentResult<any>;
    tutorProfilesSection: ContentResult<any>;
    tutors: ContentResult<any[]>;
    platformBanner: ContentResult<any>;
    testimonialSection: ContentResult<any>;
    testimonials: ContentResult<any[]>;
    faqSection: ContentResult<any>;
    footer: ContentResult<any>;
    navbar: ContentResult<any>;
    seo: ContentResult<any>;
  }> {
    // Execute all queries in parallel for maximum performance
    const [
      hero,
      highlights,
      subjectGridSection,
      advertBlockSection,
      postTutorMidSection,
      trustedInstitutions,
      tutorProfilesSection,
      tutors,
      platformBanner,
      testimonialSection,
      testimonials,
      faqSection,
      footer,
      navbar,
      seo,
    ] = await Promise.all([
      heroQueries.fetch(cloneId),
      highlightsQueries.fetch(cloneId),
      subjectGridSectionQueries.fetch(cloneId),
      advertBlockSectionQueries.fetch(cloneId),
      postTutorMidSectionQueries.fetch(cloneId),
      trustedInstitutionsQueries.fetch(cloneId),
      tutorProfilesSectionQueries.fetch(cloneId),
      tutorQueries.fetchHomepageTutors(cloneId),
      platformBannerQueries.fetch(cloneId),
      testimonialSectionQueries.fetch(cloneId),
      testimonialQueries.fetch(cloneId),
      faqSectionQueries.fetch(cloneId, 'homepage'),
      footerQueries.fetch(cloneId),
      navbarQueries.fetch(cloneId),
      seoQueries.fetch(cloneId),
    ]);

    return {
      hero,
      highlights,
      subjectGridSection,
      advertBlockSection,
      postTutorMidSection,
      trustedInstitutions,
      tutorProfilesSection,
      tutors,
      platformBanner,
      testimonialSection,
      testimonials,
      faqSection,
      footer,
      navbar,
      seo,
    };
  }
};

/**
 * UTILITY FUNCTIONS
 */
export const cloneQueryUtils = {
  /**
   * Apply clone-specific customizations to content
   */
  applyCustomizations<T extends Record<string, any>>(
    content: T,
    customizations?: {
      customTitle?: string;
      customDescription?: string;
      customMetadata?: any;
    }
  ): T {
    if (!customizations) return content;

    const result = { ...content } as any;

    if (customizations.customTitle) {
      result.title = customizations.customTitle;
    }
    if (customizations.customDescription) {
      result.description = customizations.customDescription;
    }
    if (customizations.customMetadata) {
      result.customMetadata = customizations.customMetadata;
    }

    return result;
  },

  /**
   * Get content with customizations applied
   */
  getContentWithCustomizations<T extends Record<string, any>>(
    result: ContentResult<T>
  ): T | null {
    if (!result.data) return null;

    const customizations = (result.data as any)?.cloneSpecificData;
    return cloneQueryUtils.applyCustomizations(result.data, customizations);
  },

  /**
   * Check if content is from a specific source
   */
  isFromSource(result: ContentResult<any>, source: ContentSource): boolean {
    return result.source === source;
  },

  /**
   * Get debug information about content resolution
   */
  getDebugInfo(result: ContentResult<any>): string {
    if (!result.source) return 'No content found';
    
    const sourceLabels = {
      cloneSpecific: 'Clone-Specific',
      baseline: 'Baseline Clone',
      default: 'Global Default'
    };

    return `${sourceLabels[result.source]}${result.cloneId ? ` (${result.cloneId})` : ''}`;
  }
}; 