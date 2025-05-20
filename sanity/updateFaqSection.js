// Script to update the existing FAQ section with all FAQs
const { createClient } = require('@sanity/client');

// Create a client with the provided token
const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  token: 'sktNp54VRzW4dt7e6pRZRwHsW1ODzBFZyCmTSVMOHBZPLHgEUooNWDeMNumY0VGNwmViJnTNSfaH0Pyx6nBloA4Ezv4y3gSTjK7GsIIV7PMhWijCB8TGkbxYUrBLhLZTxROQPo2Rv8go1l2rKFctQczXQPq3QQ14WqbBxdhxCNEWAt6gcoJ2',
  apiVersion: '2023-06-20',
  useCdn: false
});

// The ID of the existing FAQ section to update
const FAQ_SECTION_ID = 'faq_section';

// Function to update the existing FAQ section with all available FAQs
const updateFaqSection = async () => {
  try {
    // First, check if the FAQ section exists
    const existingSection = await client.fetch(`*[_id == $id][0]`, { id: FAQ_SECTION_ID });
    
    if (!existingSection) {
      console.error('Error: FAQ section with ID', FAQ_SECTION_ID, 'not found');
      return;
    }
    
    console.log('Found existing FAQ section:', existingSection.title);
    
    // Get all existing FAQ items
    const allFaqs = await client.fetch(`*[_type == "faq"] | order(displayOrder asc)`);
    console.log('Found', allFaqs.length, 'FAQ items in total');
    
    // Create references for all FAQ items
    const faqReferences = allFaqs.map(faq => ({
      _key: new Date().getTime().toString() + Math.random().toString(36).substring(2, 7),
      _ref: faq._id,
      _type: 'reference'
    }));
    
    // Print FAQ details
    allFaqs.forEach(faq => {
      console.log(`- FAQ: "${faq.question}" (ID: ${faq._id}, Order: ${faq.displayOrder})`);
    });
    
    // Update the existing FAQ section with all FAQ references
    // Also ensure title and subtitle are set
    const updatedFaqSection = await client.patch(FAQ_SECTION_ID)
      .set({ 
        faqReferences: faqReferences,
        title: existingSection.title || "Frequently Asked Questions",
        subtitle: existingSection.subtitle || "Common questions about our tutoring services"
      })
      .commit();
    
    console.log('FAQ section updated successfully:', updatedFaqSection._id);
    console.log('Number of FAQs added:', faqReferences.length);
    
    return updatedFaqSection;
  } catch (error) {
    console.error('Error updating FAQ section:', error);
  }
};

// Run the function
updateFaqSection(); 