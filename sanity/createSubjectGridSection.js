const { createClient } = require('@sanity/client');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
});

async function createSubjectGridSection() {
  try {
    // Check if a subjectGridSection document already exists
    const existingSection = await client.fetch('*[_type == "subjectGridSection"][0]');
    
    if (existingSection) {
      console.log('SubjectGrid section already exists:', existingSection._id);
      return existingSection;
    }

    // Default subjects list
    const defaultSubjects = [
      { name: "Maths", slug: "maths", displayOrder: 1, enabled: true },
      { name: "Further Maths", slug: "further-maths", displayOrder: 2, enabled: true },
      { name: "Biology", slug: "biology", displayOrder: 3, enabled: true },
      { name: "Chemistry", slug: "chemistry", displayOrder: 4, enabled: true },
      { name: "Physics", slug: "physics", displayOrder: 5, enabled: true },
      { name: "Psychology", slug: "psychology", displayOrder: 6, enabled: true },
      { name: "Computer Science", slug: "computer-science", displayOrder: 7, enabled: true },
      { name: "English", slug: "english", displayOrder: 8, enabled: true },
      { name: "History", slug: "history", displayOrder: 9, enabled: true },
      { name: "Geography", slug: "geography", displayOrder: 10, enabled: true },
      { name: "Economics", slug: "economics", displayOrder: 11, enabled: true },
      { name: "Business Studies", slug: "business-studies", displayOrder: 12, enabled: true },
      { name: "French", slug: "french", displayOrder: 13, enabled: true },
      { name: "Spanish", slug: "spanish", displayOrder: 14, enabled: true },
      { name: "German", slug: "german", displayOrder: 15, enabled: true },
      { name: "Law", slug: "law", displayOrder: 16, enabled: true },
      { name: "Accounting", slug: "accounting", displayOrder: 17, enabled: true },
      { name: "EPQ", slug: "epq", displayOrder: 18, enabled: true },
    ];

    // Create the subject grid section document
    const sectionDoc = {
      _type: 'subjectGridSection',
      title: 'Popular IB Subjects',
      description: 'Our team of specialist tutors are here to help you excel all areas. Take a closer look at our expert tutors for each A-Level subject.',
      splitDescription: false,
      subjects: defaultSubjects,
      backgroundColor: '#F4F6F9',
      enabled: true,
      isActive: true,
    };

    const result = await client.create(sectionDoc);
    console.log('Created SubjectGrid section:', result._id);
    return result;
  } catch (error) {
    console.error('Error creating SubjectGrid section:', error);
    throw error;
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  createSubjectGridSection()
    .then(() => {
      console.log('SubjectGrid section setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to setup SubjectGrid section:', error);
      process.exit(1);
    });
}

module.exports = { createSubjectGridSection }; 