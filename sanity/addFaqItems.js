// Script to add FAQ items to the FAQ section
const { createClient } = require('@sanity/client');

// Create a client with the provided token
const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  token: 'sktNp54VRzW4dt7e6pRZRwHsW1ODzBFZyCmTSVMOHBZPLHgEUooNWDeMNumY0VGNwmViJnTNSfaH0Pyx6nBloA4Ezv4y3gSTjK7GsIIV7PMhWijCB8TGkbxYUrBLhLZTxROQPo2Rv8go1l2rKFctQczXQPq3QQ14WqbBxdhxCNEWAt6gcoJ2',
  apiVersion: '2023-06-20',
  useCdn: false
});

// The ID of the FAQ section we just created
const FAQ_SECTION_ID = 'zKcOR0n6ZKYjC28BBhf3lY';

// Function to find existing FAQ items or create new ones
const setupFaqItems = async () => {
  try {
    // First, check if we have any existing FAQ items
    const existingFaqs = await client.fetch(`*[_type == "faq"] | order(displayOrder asc)`);
    console.log('Existing FAQs:', existingFaqs.length ? existingFaqs : 'None');

    // Sample FAQ items to create if they don't exist
    const faqItems = [
      {
        question: 'What subjects do you offer tutoring for?',
        answer: 'We offer tutoring for a wide range of subjects including Math, Science, English, and more. Our tutors are experts in IB, A-Level, and IGCSE curricula.',
        displayOrder: 0
      },
      {
        question: 'How much does tutoring cost?',
        answer: 'Our tutoring rates range from AED 140-390 per hour depending on the subject, level, and tutor experience. Contact us for a personalized quote based on your specific requirements.',
        displayOrder: 1
      },
      {
        question: 'How do online tutoring sessions work?',
        answer: 'Our online tutoring sessions are conducted through a secure platform that allows for real-time video conferencing, screen sharing, and collaborative whiteboarding. All you need is a computer with internet access and a webcam.',
        displayOrder: 2
      }
    ];

    // Create or locate FAQ items
    const faqReferences = [];
    for (const item of faqItems) {
      // Check if a similar FAQ already exists
      const existingFaq = existingFaqs.find(faq => 
        faq.question === item.question || 
        faq.displayOrder === item.displayOrder
      );

      if (existingFaq) {
        console.log(`Using existing FAQ: ${existingFaq.question} (${existingFaq._id})`);
        faqReferences.push({
          _key: new Date().getTime().toString() + Math.random().toString(36).substring(2, 7),
          _ref: existingFaq._id,
          _type: 'reference'
        });
      } else {
        // Create a new FAQ item
        const newFaq = await client.create({
          _type: 'faq',
          ...item
        });
        console.log(`Created new FAQ: ${newFaq.question} (${newFaq._id})`);
        
        faqReferences.push({
          _key: new Date().getTime().toString() + Math.random().toString(36).substring(2, 7),
          _ref: newFaq._id,
          _type: 'reference'
        });
      }
    }

    // Update the FAQ section with references to the FAQ items
    const updatedFaqSection = await client.patch(FAQ_SECTION_ID)
      .set({ faqReferences: faqReferences })
      .commit();

    console.log('FAQ section updated successfully:', updatedFaqSection._id);
    console.log('Number of FAQs added:', faqReferences.length);
    
    return updatedFaqSection;
  } catch (error) {
    console.error('Error setting up FAQ items:', error);
  }
};

// Run the function
setupFaqItems(); 