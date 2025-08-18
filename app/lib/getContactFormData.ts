import { cachedFetch } from '@/sanity/lib/queryCache';

export interface ContactFormData {
  formHeader: string;
  formSubtitle: string;
  companyName: string;
  formFields: {
    fullNameLabel: string;
    fullNamePlaceholder: string;
    countryLabel: string;
    countryPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    budgetLabel: string;
    budgetPlaceholder: string;
  };
  submitButtonText: string;
  submittingText: string;
  successModal: {
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    footerText: string;
  };
  errorMessages: {
    genericError: string;
    validationError: string;
  };
}

// Fallback data that matches the current hardcoded values
const FALLBACK_CONTACT_FORM_DATA: ContactFormData = {
  formHeader: 'Hire a tutor',
  formSubtitle: 'Please fill out the form and an academic consultant from TutorChase will find a tutor for you',
  companyName: 'TutorChase',
  formFields: {
    fullNameLabel: 'Full name *',
    fullNamePlaceholder: 'Enter your name here',
    countryLabel: 'Country *',
    countryPlaceholder: 'Enter your country here',
    phoneLabel: 'Your phone (with country code - e.g. +44) *',
    phonePlaceholder: 'Enter your phone here',
    emailLabel: 'Your email *',
    emailPlaceholder: 'Enter your email here',
    detailsLabel: 'Details of tutoring request (e.g. exams, subjects, how long for etc.) *',
    detailsPlaceholder: 'Enter details',
    budgetLabel: 'Hourly budget (including currency) *',
    budgetPlaceholder: 'Enter your budget here',
  },
  submitButtonText: 'Submit',
  submittingText: 'Submitting...',
  successModal: {
    title: 'Thank you for your Enquiry\nWe will be in contact shortly',
    description: 'You can additionally message on WhatsApp now with one of our academic consultants to discuss your tutoring requirements in more detail',
    primaryButtonText: 'View Study Resources',
    primaryButtonLink: '/',
    secondaryButtonText: 'Return Home',
    secondaryButtonLink: '/',
    footerText: 'Please also check your junk email folder if you have not heard from us',
  },
  errorMessages: {
    genericError: 'There was a problem submitting your request. Please try again.',
    validationError: 'Please correct the errors in the form.',
  },
};

export async function getContactFormData(cloneId?: string | null): Promise<ContactFormData> {
  try {
    // If no cloneId provided, try to get it from middleware headers
    let targetCloneId = cloneId;
    if (!targetCloneId) {
      try {
        // Dynamically import next/headers only on server-side
        const { headers } = await import('next/headers');
        const headersList = headers();
        targetCloneId = headersList.get('x-clone-id');
      } catch (error) {
        console.log('[getContactFormData] Could not access headers (client-side call), using fallback');
        // When called client-side, return fallback data immediately
        return FALLBACK_CONTACT_FORM_DATA;
      }
    }

    // Build clone-aware query with 3-tier fallback
    const query = `{
      "cloneSpecific": *[_type == "contactFormContent" && defined($cloneId) && cloneReference->cloneId.current == $cloneId][0] {
        formHeader,
        formSubtitle,
        companyName,
        formFields,
        submitButtonText,
        submittingText,
        successModal,
        errorMessages,
        "sourceInfo": {
          "source": "cloneSpecific",
          "cloneId": $cloneId
        }
      },
      "baseline": *[_type == "contactFormContent" && cloneReference->baselineClone == true][0] {
        formHeader,
        formSubtitle,
        companyName,
        formFields,
        submitButtonText,
        submittingText,
        successModal,
        errorMessages,
        "sourceInfo": {
          "source": "baseline",
          "cloneId": cloneReference->cloneId.current
        }
      },
      "default": *[_type == "contactFormContent" && !defined(cloneReference)][0] {
        formHeader,
        formSubtitle,
        companyName,
        formFields,
        submitButtonText,
        submittingText,
        successModal,
        errorMessages,
        "sourceInfo": {
          "source": "default",
          "cloneId": null
        }
      }
    }`;

    const params = { cloneId: targetCloneId };

    // Using cachedFetch with clone-aware caching
    const result = await cachedFetch<{
      cloneSpecific: (ContactFormData & { sourceInfo?: { source: string; cloneId: string } }) | null;
      baseline: (ContactFormData & { sourceInfo?: { source: string; cloneId: string } }) | null;
      default: (ContactFormData & { sourceInfo?: { source: string; cloneId: string } }) | null;
    }>(
      query,
      params,
      { next: { revalidate: 86400 } }, // 24 hours cache
      24 * 60 * 60 * 1000 // 24 hours TTL
    );

    if (!result) {
      return FALLBACK_CONTACT_FORM_DATA;
    }

    // Apply 3-tier fallback resolution
    const contactFormData = result.cloneSpecific || result.baseline || result.default;
    
    if (!contactFormData) {
      return FALLBACK_CONTACT_FORM_DATA;
    }

    console.log(`[getContactFormData] Resolved contact form data from: ${contactFormData.sourceInfo?.source || 'unknown'} for clone: ${targetCloneId || 'none'}`);
    
    // Return the contact form data (no template processing needed)
    const processedData = {
      formHeader: contactFormData.formHeader,
      formSubtitle: contactFormData.formSubtitle,
      companyName: contactFormData.companyName,
      formFields: contactFormData.formFields,
      submitButtonText: contactFormData.submitButtonText,
      submittingText: contactFormData.submittingText,
      successModal: contactFormData.successModal,
      errorMessages: contactFormData.errorMessages,
    };

    return processedData;
  } catch (error) {
    console.error('Error fetching contact form data:', error);
    return FALLBACK_CONTACT_FORM_DATA;
  }
} 