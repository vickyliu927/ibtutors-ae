// Script to create initial link settings document
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables 
dotenv.config({ path: '../.env.local' });

// Create a client with appropriate project ID and dataset
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
});

// Define the document to create
const linkSettingsDoc = {
  _type: 'linkSettings',
  title: 'Global Link Settings',
  defaultNofollow: false,
  nofollowDomains: ['tutorchase.com'],
  followDomains: [],
};

// Create the document
async function createLinkSettings() {
  try {
    // Check if a linkSettings document already exists
    const existingDocs = await client.fetch('*[_type == "linkSettings"]');
    
    if (existingDocs.length > 0) {
      console.log('Link settings document already exists. Skipping creation.');
      return;
    }
    
    // Create the document if it doesn't exist
    const result = await client.create(linkSettingsDoc);
    console.log(`Link settings document created with ID: ${result._id}`);
  } catch (error) {
    console.error('Error creating link settings document:', error);
  }
}

// Run the function
createLinkSettings(); 