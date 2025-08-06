#!/usr/bin/env node

/**
 * Script to create clone-specific SEO settings in Sanity
 * Run with: node create-clone-seo.js
 */

import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  apiVersion: '2024-03-20',
  useCdn: false,
  perspective: 'published',
  token: process.env.SANITY_API_TOKEN, // Make sure this is set
});

const cloneSeoData = [
  {
    cloneId: 'qatar-tutors',
    title: 'Top Rated Qatar Tutors - Ranked #1 - onlinetutors.qa',
    description: 'Elite Qatar tutoring and revision resources for IB, A-Level, AP, IGCSE, GCSE, and University Admissions. Trusted by 100,000+ parents and students globally.'
  },
  {
    cloneId: 'abu-dhabi',
    title: 'Top Rated Abu Dhabi Tutors - Ranked #1',
    description: 'Elite Abu Dhabi tutoring and revision resources for IB, A-Level, AP, IGCSE, GCSE, and University Admissions. Trusted by 100,000+ parents and students globally.'
  },
  {
    cloneId: 'hong-kong-tutors',
    title: 'Top Rated Hong Kong Tutors - Ranked #1',
    description: 'Elite Hong Kong tutoring and revision resources for IB, A-Level, AP, IGCSE, GCSE, and University Admissions. Trusted by 100,000+ parents and students globally.'
  },
  {
    cloneId: 'singapore-tutors',
    title: 'Top Rated Singapore Tutors - Ranked #1',
    description: 'Elite Singapore tutoring and revision resources for IB, A-Level, AP, IGCSE, GCSE, and University Admissions. Trusted by 100,000+ parents and students globally.'
  },
  {
    cloneId: 'spain-tutors',
    title: 'Top Rated Spain Tutors - Ranked #1',
    description: 'Elite Spain tutoring and revision resources for IB, A-Level, AP, IGCSE, GCSE, and University Admissions. Trusted by 100,000+ parents and students globally.'
  }
];

async function createCloneSeoSettings() {
  console.log('🚀 Creating Clone-Specific SEO Settings');
  console.log('=======================================\n');

  if (!process.env.SANITY_API_TOKEN) {
    console.log('❌ Error: SANITY_API_TOKEN environment variable is required');
    console.log('Please set your Sanity API token with write permissions');
    process.exit(1);
  }

  try {
    // First, get all existing clones to validate clone references
    const clones = await client.fetch(`*[_type == "clone"] {
      cloneId,
      cloneName,
      _id
    }`);

    console.log('📋 Available clones:');
    clones.forEach(clone => {
      console.log(`  - ${clone.cloneName} (${clone.cloneId?.current})`);
    });
    console.log('');

    for (const seoData of cloneSeoData) {
      const matchingClone = clones.find(clone => clone.cloneId?.current === seoData.cloneId);
      
      if (!matchingClone) {
        console.log(`⚠️ Warning: Clone '${seoData.cloneId}' not found in Sanity, skipping...`);
        continue;
      }

      console.log(`📝 Creating SEO settings for ${matchingClone.cloneName}...`);

      const document = {
        _type: 'seoSettings',
        title: seoData.title,
        description: seoData.description,
        cloneReference: {
          _type: 'reference',
          _ref: matchingClone._id
        }
      };

      const result = await client.create(document);
      console.log(`✅ Created SEO document: ${result._id}`);
    }

    console.log('\n🎉 All clone-specific SEO settings created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit your Sanity Studio to verify the documents');
    console.log('2. Test your domains to see the new titles and descriptions');
    console.log('3. Run: node test-seo-metadata.js to verify the changes');

  } catch (error) {
    console.error('❌ Error creating SEO settings:', error);
    
    if (error.message.includes('Insufficient permissions')) {
      console.log('\n💡 Make sure your SANITY_API_TOKEN has write permissions');
      console.log('You can create a token at: https://sanity.io/manage');
    }
  }
}

createCloneSeoSettings();