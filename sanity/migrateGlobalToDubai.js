// Script to duplicate all global content and assign to Dubai Tutors clone
const { createClient } = require('@sanity/client');

// Create a client with the provided token
const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  token: 'sktNp54VRzW4dt7e6pRZRwHsW1ODzBFZyCmTSVMOHBZPLHgEUooNWDeMNumY0VGNwmViJnTNSfaH0Pyx6nBloA4Ezv4y3gSTjK7GsIIV7PMhWijCB8TGkbxYUrBLhLZTxROQPo2Rv8go1l2rKFctQczXQPq3QQ14WqbBxdhxCNEWAt6gcoJ2',
  apiVersion: '2023-06-20',
  useCdn: false
});

// Content types to migrate
const contentTypes = [
  'hero',
  'highlightsSection', 
  'tutorProfilesSection',
  'subjectGridSection',
  'advertBlockSection',
  'platformBanner',
  'trustedInstitutionsBanner',
  'testimonialSection',
  'faq_section',
  'footerSection',
  'tutor',
  'testimonial',
  'faq',
  'navbarSettings',
  'seoSettings',
  'linkSettings',
  'contactFormContent'
];

// Function to find Dubai Tutors clone
const findDubaiClone = async () => {
  const dubaiClone = await client.fetch(`
    *[_type == "clone" && cloneName match "Dubai*"][0] {
      _id,
      cloneName,
      cloneId
    }
  `);
  
  if (!dubaiClone) {
    throw new Error('Dubai Tutors clone not found. Please create it first.');
  }
  
  console.log(`Found Dubai clone: ${dubaiClone.cloneName} (ID: ${dubaiClone._id})`);
  return dubaiClone;
};

// Function to get all global content for a specific type
const getGlobalContent = async (contentType) => {
  const documents = await client.fetch(`
    *[_type == "${contentType}" && !defined(cloneReference)] {
      ...,
      "originalId": _id
    }
  `);
  
  console.log(`Found ${documents.length} global ${contentType} documents`);
  return documents;
};

// Function to create duplicate with Dubai clone reference
const createDubaiDuplicate = async (document, dubaiCloneRef) => {
  // Remove Sanity metadata and add clone reference
  const {
    _id,
    _rev,
    _createdAt,
    _updatedAt,
    originalId,
    ...documentData
  } = document;

  const duplicateData = {
    ...documentData,
    _type: document._type,
    cloneReference: {
      _type: 'reference',
      _ref: dubaiCloneRef
    },
    // Add metadata to track this is a migrated document
    _migrationInfo: {
      originalId: originalId,
      migratedAt: new Date().toISOString(),
      migratedFrom: 'global'
    }
  };

  try {
    const result = await client.create(duplicateData);
    console.log(`✅ Created Dubai duplicate: ${result._id} (from ${originalId})`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create duplicate for ${originalId}:`, error.message);
    return null;
  }
};

// Main migration function
const migrateGlobalToDubai = async () => {
  try {
    console.log('🚀 Starting migration of global content to Dubai Tutors...\n');
    
    // Find Dubai clone
    const dubaiClone = await findDubaiClone();
    
    let totalMigrated = 0;
    let totalErrors = 0;

    // Process each content type
    for (const contentType of contentTypes) {
      console.log(`\n📂 Processing ${contentType}...`);
      
      const globalDocuments = await getGlobalContent(contentType);
      
      if (globalDocuments.length === 0) {
        console.log(`   No global ${contentType} documents found`);
        continue;
      }

      // Create duplicates for each document
      for (const doc of globalDocuments) {
        const duplicate = await createDubaiDuplicate(doc, dubaiClone._id);
        if (duplicate) {
          totalMigrated++;
        } else {
          totalErrors++;
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log(`✅ Successfully migrated: ${totalMigrated} documents`);
    console.log(`❌ Errors: ${totalErrors} documents`);
    
    if (totalErrors > 0) {
      console.log('\n⚠️  Some documents failed to migrate. Check the logs above for details.');
    }

    console.log('\n📋 Next steps:');
    console.log('1. Review the migrated content in Sanity Studio');
    console.log('2. Verify that clone references are correctly set');
    console.log('3. Test the website to ensure everything works');
    console.log('4. Optionally, you can delete or modify the original global documents');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
  }
};

// Function to preview what would be migrated (dry run)
const previewMigration = async () => {
  try {
    console.log('🔍 Preview: What would be migrated to Dubai Tutors\n');
    
    let totalDocuments = 0;

    for (const contentType of contentTypes) {
      const globalDocuments = await getGlobalContent(contentType);
      totalDocuments += globalDocuments.length;
      
      if (globalDocuments.length > 0) {
        console.log(`📄 ${contentType}: ${globalDocuments.length} documents`);
        globalDocuments.forEach(doc => {
          const title = doc.title || doc.name || doc.question || 'Untitled';
          console.log(`   - ${title} (${doc._id})`);
        });
      }
    }

    console.log(`\n📊 Total documents to migrate: ${totalDocuments}`);
    console.log('\nTo run the actual migration, uncomment the migrateGlobalToDubai() call at the bottom of this script.');
    
  } catch (error) {
    console.error('💥 Preview failed:', error);
  }
};

// Run preview by default (safer)
// previewMigration();

// Uncomment the line below to run the actual migration
migrateGlobalToDubai();

module.exports = {
  migrateGlobalToDubai,
  previewMigration
}; 