const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const defaultTutorProfilesSection = {
  _type: 'tutorProfilesSection',
  trustedByText: 'Trusted by 15,000+ students across Dubai and globally.',
  title: 'Our Qualified Dubai Teachers and Examiners',
  description: 'We have a team of expert online tutors at prices ranging from AED 140-390/hour.',
  contactText: 'Contact us with your requirements and budget and we\'ll find the perfect tutor for you!',
  subtitle: '', // Legacy field
  ctaText: 'View all our tutors',
  ctaLink: '/tutors',
  isActive: true,
};

async function createTutorProfilesSection() {
  try {
    console.log('Creating default tutor profiles section...');
    
    // Check if any tutor profiles section already exists
    const existing = await client.fetch(`*[_type == "tutorProfilesSection"][0]`);
    
    if (existing) {
      console.log('Tutor profiles section already exists. Updating with new fields...');
      
      // Update existing document with new fields (only if they don't exist)
      const updates = {};
      if (!existing.trustedByText) updates.trustedByText = defaultTutorProfilesSection.trustedByText;
      if (!existing.description) updates.description = defaultTutorProfilesSection.description;
      if (!existing.contactText) updates.contactText = defaultTutorProfilesSection.contactText;
      
      if (Object.keys(updates).length > 0) {
        await client.patch(existing._id).set(updates).commit();
        console.log('Updated existing tutor profiles section with new fields:', updates);
      } else {
        console.log('Existing tutor profiles section already has all required fields.');
      }
    } else {
      const result = await client.create(defaultTutorProfilesSection);
      console.log('Created new tutor profiles section:', result._id);
    }
    
    console.log('✅ Tutor profiles section setup complete!');
  } catch (error) {
    console.error('❌ Error creating tutor profiles section:', error);
  }
}

createTutorProfilesSection(); 