// Script to add ALL existing FAQ items to the FAQ section
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

// Function to add ALL existing FAQ items to the FAQ section
const addAllFaqs = async () => {
  try {
    // Get all existing FAQ items
    const existingFaqs = await client.fetch(`*[_type == "faq"] | order(displayOrder asc)`);
    console.log('Found FAQs:', existingFaqs.length);
    
    // Create references for all FAQ items
    const faqReferences = existingFaqs.map(faq => ({
      _key: new Date().getTime().toString() + Math.random().toString(36).substring(2, 7),
      _ref: faq._id,
      _type: 'reference'
    }));

    // Print FAQ details
    existingFaqs.forEach(faq => {
      console.log(`- FAQ: "${faq.question}" (ID: ${faq._id}, Order: ${faq.displayOrder})`);
    });

    // Update the FAQ section with references to ALL FAQ items
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
addAllFaqs(); 