// Script to create the FAQ section document with a specific ID
const { createClient } = require('@sanity/client');

// Create a client with the provided token
const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  token: 'sktNp54VRzW4dt7e6pRZRwHsW1ODzBFZyCmTSVMOHBZPLHgEUooNWDeMNumY0VGNwmViJnTNSfaH0Pyx6nBloA4Ezv4y3gSTjK7GsIIV7PMhWijCB8TGkbxYUrBLhLZTxROQPo2Rv8go1l2rKFctQczXQPq3QQ14WqbBxdhxCNEWAt6gcoJ2',
  apiVersion: '2023-06-20',
  useCdn: false
});

// Function to recreate the FAQ section document with the specific ID that Sanity Studio expects
const createSpecificFaqSection = async () => {
  try {
    // First, check if there are any existing FAQs
    const existingFaqs = await client.fetch(`*[_type == "faq"] | order(displayOrder asc)`);
    console.log('Found', existingFaqs.length, 'existing FAQs');

    // Create references for all existing FAQs
    const faqReferences = existingFaqs.map(faq => ({
      _key: new Date().getTime() + Math.random().toString(36).substring(2, 7),
      _ref: faq._id,
      _type: 'reference'
    }));

    // The specific document ID that Sanity Studio is looking for
    const specificDocId = 'faq_section_homepage';

    // Create the document with the specific ID
    const doc = {
      _id: specificDocId,
      _type: 'faq_section',
      title: 'Frequently Asked Questions',
      subtitle: 'Common questions about our tutoring services',
      faqReferences: faqReferences
    };

    // Check if the document exists (including in drafts)
    const existingDoc = await client.fetch(`*[_id == $id || _id == $draftId][0]`, {
      id: specificDocId,
      draftId: `drafts.${specificDocId}`
    });

    let result;
    
    if (existingDoc) {
      console.log('Document exists, attempting to delete it first...');
      try {
        // Delete any existing document with this ID (both published and draft)
        await client.delete(specificDocId);
        await client.delete(`drafts.${specificDocId}`);
        console.log('Successfully deleted existing document');
      } catch (err) {
        console.log('Error deleting document, but continuing:', err.message);
      }
    }
    
    // Create the new document with the specific ID
    result = await client.createOrReplace(doc);
    console.log(`FAQ section created with ID: ${result._id}`);
    console.log('Number of FAQs added:', faqReferences.length);
    
    // List the FAQ questions that were added
    if (faqReferences.length > 0) {
      console.log('Added FAQs:');
      existingFaqs.forEach((faq, index) => {
        console.log(`${index + 1}. ${faq.question} (${faq._id})`);
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error creating FAQ section:', error);
  }
};

// Run the function
createSpecificFaqSection(); 