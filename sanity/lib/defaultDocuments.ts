import { client } from './client';

export async function createDefaultTrustedInstitutionsBanner() {
  // Check if a trustedInstitutionsBanner document already exists
  const existingBanner = await client.fetch('*[_type == "trustedInstitutionsBanner"][0]');
  
  if (!existingBanner) {
    console.log('Creating default Trusted Institutions Banner...');
    
    // Create the default banner
    const defaultBanner = {
      _type: 'trustedInstitutionsBanner',
      title: 'TUTORS FROM AND STUDENTS ACCEPTED INTO',
      subtitle: 'THE WORLD\'S TOP UNIVERSITIES',
      backgroundColor: '#ffffff',
      carouselSpeed: 5,
      enabled: true,
      institutions: [
        // These are placeholders - you'll need to upload actual logos in Sanity Studio
        {
          name: 'Stanford University',
          _type: 'object',
          // Logo will need to be added manually in Studio
        },
        {
          name: 'University of Oxford',
          _type: 'object',
          // Logo will need to be added manually in Studio
        },
        {
          name: 'Harvard University',
          _type: 'object',
          // Logo will need to be added manually in Studio
        },
        {
          name: 'University of Cambridge',
          _type: 'object',
          // Logo will need to be added manually in Studio
        },
        {
          name: 'Massachusetts Institute of Technology',
          _type: 'object',
          // Logo will need to be added manually in Studio
        }
      ],
    };
    
    try {
      await client.create(defaultBanner);
      console.log('Default Trusted Institutions Banner created successfully.');
    } catch (error) {
      console.error('Error creating default Trusted Institutions Banner:', error);
    }
  } else {
    console.log('Trusted Institutions Banner already exists. Skipping creation.');
  }
}

// Add more default document creation functions as needed

// Main function to create all default documents
export async function createDefaultDocuments() {
  await createDefaultTrustedInstitutionsBanner();
  // Add more default document creation calls here
} 