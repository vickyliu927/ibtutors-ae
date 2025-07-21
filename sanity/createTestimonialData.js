require('dotenv').config();
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
});

async function createTestimonialData() {
  try {
    console.log('🚀 Setting up testimonial section and testimonials...');

    // Step 1: Create sample testimonials first
    const testimonialData = [
      {
        _type: 'testimonial',
        reviewerName: 'Sarah Ahmed',
        reviewerType: 'Parent of an IB Maths Student',
        testimonialText: 'The tutoring has been exceptional. My daughter went from struggling with IB Maths to achieving a 7. The online platform made sessions convenient and effective.',
        rating: 5,
        order: 1,
        isActive: true,
      },
      {
        _type: 'testimonial',
        reviewerName: 'Mohamed Al-Rashid',
        reviewerType: 'IB Physics Student',
        testimonialText: 'Amazing tutors who really understand the IB curriculum. The interactive lessons helped me grasp complex physics concepts easily.',
        rating: 5,
        order: 2,
        isActive: true,
      },
      {
        _type: 'testimonial',
        reviewerName: 'Emily Johnson',
        reviewerType: 'Parent of an IB Chemistry Student',
        testimonialText: 'Professional, knowledgeable, and patient tutors. My son\'s confidence in chemistry has improved dramatically since starting sessions.',
        rating: 5,
        order: 3,
        isActive: true,
      },
      {
        _type: 'testimonial',
        reviewerName: 'Ahmed Hassan',
        reviewerType: 'IB Economics Student',
        testimonialText: 'The best tutoring service in Dubai! The tutors are IB examiners who know exactly what\'s needed for success.',
        rating: 5,
        order: 4,
        isActive: true,
      },
      {
        _type: 'testimonial',
        reviewerName: 'Lisa Chen',
        reviewerType: 'Parent of an IB English Student',
        testimonialText: 'Excellent results and great communication. The online platform is user-friendly and the tutors are highly qualified.',
        rating: 5,
        order: 5,
        isActive: true,
      },
      {
        _type: 'testimonial',
        reviewerName: 'Omar Abdullah',
        reviewerType: 'IB Business Student',
        testimonialText: 'Transformed my understanding of IB Business. The step-by-step approach and real exam practice made all the difference.',
        rating: 5,
        order: 6,
        isActive: true,
      },
    ];

    // Check if testimonials already exist
    const existingTestimonials = await client.fetch('*[_type == "testimonial" && isActive == true]');
    console.log(`Found ${existingTestimonials.length} existing active testimonials`);

    let createdTestimonials = [];
    
    if (existingTestimonials.length === 0) {
      console.log('Creating sample testimonials...');
      
      for (const testimonial of testimonialData) {
        const result = await client.create(testimonial);
        createdTestimonials.push(result);
        console.log(`✅ Created testimonial: ${result.reviewerName}`);
      }
    } else {
      console.log('Using existing testimonials');
      createdTestimonials = existingTestimonials;
    }

    // Step 2: Create or update testimonial section
    const existingSection = await client.fetch('*[_type == "testimonialSection"][0]');
    
    if (existingSection) {
      console.log('Testimonial section already exists, updating if needed...');
      
      // Update to ensure it's active
      await client.patch(existingSection._id)
        .set({ 
          isActive: true,
          selectedTestimonials: createdTestimonials.slice(0, 3).map(t => ({ _ref: t._id, _type: 'reference' }))
        })
        .commit();
      
      console.log('✅ Updated existing testimonial section');
    } else {
      console.log('Creating new testimonial section...');
      
      const testimonialSection = {
        _type: 'testimonialSection',
        rating: 4.92,
        totalReviews: 480,
        subtitle: "the world's #1 IB tutoring provider",
        tutorChaseLink: 'https://www.tutorchase.com',
        selectedTestimonials: createdTestimonials.slice(0, 3).map(t => ({ 
          _ref: t._id, 
          _type: 'reference',
          _key: `testimonial-${t._id}`
        })),
        maxDisplayCount: 3,
        isActive: true,
      };

      const result = await client.create(testimonialSection);
      console.log('✅ Created testimonial section:', result._id);
    }

    console.log('\n🎉 Testimonial setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Created/verified ${createdTestimonials.length} testimonials`);
    console.log('- Created/updated testimonial section');
    console.log('- All items set to isActive: true');
    console.log('\n🔄 The testimonials should now appear on your homepage!');
    console.log('\nNext steps:');
    console.log('1. Refresh your website to see the testimonials');
    console.log('2. Visit Sanity Studio to customize the content');
    console.log('3. Check the browser console for debug logs');

  } catch (error) {
    console.error('❌ Error setting up testimonials:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  createTestimonialData()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to setup testimonials:', error);
      process.exit(1);
    });
}

module.exports = createTestimonialData; 