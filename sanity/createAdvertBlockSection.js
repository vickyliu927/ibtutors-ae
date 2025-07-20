require('dotenv').config();
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
});

async function createAdvertBlockSection() {
  try {
    console.log('Creating default AdvertBlock section...');

    // Default AdvertBlock configuration
    const defaultAdvertBlock = {
      _type: 'advertBlockSection',
      title: 'Voted #1 for IB',
      subtitle: 'by 10,000+ students',
      description: 'We\'re trusted by hundreds of IB schools globally. All tutoring includes FREE access to our',
      highlightText: 'IB Resources Platform',
      pricingText: '- normally £29/month!',
      backgroundColor: '#001A96',
      enabled: true,
      displayOrder: 5,
      isActive: true,
    };

    // Create the document
    const result = await client.create(defaultAdvertBlock);
    
    console.log('✅ AdvertBlock section created successfully!');
    console.log('Document ID:', result._id);
    console.log('Title:', result.title);
    console.log('Subtitle:', result.subtitle);
    console.log('Background Color:', result.backgroundColor);
    console.log('Display Order:', result.displayOrder);
    
    return result;
  } catch (error) {
    console.error('❌ Error creating AdvertBlock section:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  createAdvertBlockSection()
    .then(() => {
      console.log('\n🎉 AdvertBlock section initialization completed!');
      console.log('\nNext steps:');
      console.log('1. Visit Sanity Studio to review the new AdvertBlock section');
      console.log('2. Customize content as needed for different clones');
      console.log('3. The website will now pull content from Sanity instead of hardcoded values');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Failed to initialize AdvertBlock section:', error);
      process.exit(1);
    });
}

module.exports = createAdvertBlockSection; 