import { client } from '@/sanity/lib/client';

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
  formSubtitle: 'Please fill out the form and an academic consultant from {companyName} will find a tutor for you',
  companyName: 'TutorChase',
  formFields: {
    fullNameLabel: 'Full name *',
    fullNamePlaceholder: 'Enter your name here',
    countryLabel: 'Country *',
    countryPlaceholder: 'Enter your country here',
    phoneLabel: 'Your phone (with country code) *',
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

export async function getContactFormData(): Promise<ContactFormData> {
  try {
    const query = `*[_type == "contactFormContent"][0] {
      formHeader,
      formSubtitle,
      companyName,
      formFields,
      submitButtonText,
      submittingText,
      successModal,
      errorMessages
    }`;

    const data = await client.fetch<ContactFormData | null>(query);

    if (!data) {
      console.log('No contact form content found in Sanity, using fallback data');
      return FALLBACK_CONTACT_FORM_DATA;
    }

    // Process the subtitle to replace company name placeholder
    const processedData = {
      ...data,
      formSubtitle: data.formSubtitle.replace('{companyName}', data.companyName || 'TutorChase'),
    };

    return processedData;
  } catch (error) {
    console.error('Error fetching contact form content:', error);
    console.log('Using fallback contact form data');
    return FALLBACK_CONTACT_FORM_DATA;
  }
} 