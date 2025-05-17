import { createDefaultDocuments } from './defaultDocuments';

// Main initialization function
export async function initializeSanity() {
  console.log('Initializing Sanity with default documents...');
  
  try {
    await createDefaultDocuments();
    console.log('Sanity initialization completed successfully.');
  } catch (error) {
    console.error('Error during Sanity initialization:', error);
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeSanity().then(() => {
    console.log('Initialization script completed.');
    process.exit(0);
  }).catch(error => {
    console.error('Initialization script failed:', error);
    process.exit(1);
  });
} 