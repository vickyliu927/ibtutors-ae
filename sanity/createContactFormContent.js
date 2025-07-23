const { createClient } = require('@sanity/client');

// Create a client with the provided token
const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  token: 'sktNp54VRzW4dt7e6pRZRwHsW1ODzBFZyCmTSVMOHBZPLHgEUooNWDeMNumY0VGNwmViJnTNSfaH0Pyx6nBloA4Ezv4y3gSTjK7GsIIV7PMhWijCB8TGkbxYUrBLhLZTxROQPo2Rv8go1l2rKFctQczXQPq3QQ14WqbBxdhxCNEWAt6gcoJ2',
  apiVersion: '2023-06-20',
  useCdn: false
});

async function createContactFormContent() {
  console.log('Creating contact form content...');

  const contactFormContent = {
    _type: 'contactFormContent',
    _id: 'contact-form-content',
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

  try {
    const result = await client.createOrReplace(contactFormContent);
    console.log('✅ Contact form content created successfully:', result._id);
    return result;
  } catch (error) {
    console.error('❌ Error creating contact form content:', error);
    throw error;
  }
}

// Run the script if called directly
if (require.main === module) {
  createContactFormContent()
    .then(() => {
      console.log('Contact form content creation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to create contact form content:', error);
      process.exit(1);
    });
}

module.exports = { createContactFormContent }; 