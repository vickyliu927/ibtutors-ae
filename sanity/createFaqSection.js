// Script to create a new FAQ section document
const { createClient } = require('@sanity/client');

// Create a client with the provided token
const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  token: 'sktNp54VRzW4dt7e6pRZRwHsW1ODzBFZyCmTSVMOHBZPLHgEUooNWDeMNumY0VGNwmViJnTNSfaH0Pyx6nBloA4Ezv4y3gSTjK7GsIIV7PMhWijCB8TGkbxYUrBLhLZTxROQPo2Rv8go1l2rKFctQczXQPq3QQ14WqbBxdhxCNEWAt6gcoJ2',
  apiVersion: '2023-06-20',
  useCdn: false
});

// Create a new FAQ section document
const createFaqSection = async () => {
  try {
    const doc = {
      _type: 'faq_section',
      title: 'Frequently Asked Questions',
      subtitle: 'Common questions about our tutoring services',
      faqReferences: [] // Empty array to start with
    };

    const result = await client.create(doc);
    console.log(`FAQ section created with ID: ${result._id}`);
    return result;
  } catch (error) {
    console.error('Error creating FAQ section:', error);
  }
};

// Run the function
createFaqSection(); 