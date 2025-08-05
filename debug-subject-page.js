const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-20',
});

async function debugSubjectPage() {
  try {
    console.log('🔍 Debugging subject page routing for Qatar domain...\n');
    
    // Test the exact query structure used in the app for 'maths' page
    const subject = 'maths';
    const cloneId = 'qatar-tutors';
    
    console.log(`Testing subject: ${subject}, cloneId: ${cloneId}\n`);
    
    // Test the exact query from app/[subject]/page.tsx
    const query = `{
      "cloneSpecific": {
        "subjectPage": *[_type == "subjectPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0]{
          _id,
          subject,
          title,
          firstSection,
          "sourceInfo": {
            "source": "cloneSpecific",
            "cloneId": $cloneId
          }
        }
      },
      "baseline": {
        "subjectPage": *[_type == "subjectPage" && slug.current == $subject && cloneReference->baselineClone == true && isActive == true][0]{
          _id,
          subject,
          title,
          firstSection,
          "sourceInfo": {
            "source": "baseline",
            "cloneId": cloneReference->cloneId.current
          }
        }
      },
      "default": {
        "subjectPage": *[_type == "subjectPage" && slug.current == $subject && !defined(cloneReference) && isActive == true][0]{
          _id,
          subject,
          title,
          firstSection,
          "sourceInfo": {
            "source": "default",
            "cloneId": null
          }
        }
      }
    }`;
    
    const result = await client.fetch(query, { subject, cloneId });
    
    console.log('📊 Query Results:');
    console.log('=================');
    
    if (result.cloneSpecific?.subjectPage) {
      console.log('✅ Clone-specific found:');
      console.log(`   Title: ${result.cloneSpecific.subjectPage.title}`);
      console.log(`   Subject: ${result.cloneSpecific.subjectPage.subject}`);
      console.log(`   ID: ${result.cloneSpecific.subjectPage._id}`);
    } else {
      console.log('❌ Clone-specific: Not found');
    }
    
    if (result.baseline?.subjectPage) {
      console.log('✅ Baseline found:');
      console.log(`   Title: ${result.baseline.subjectPage.title}`);
      console.log(`   Subject: ${result.baseline.subjectPage.subject}`);
      console.log(`   ID: ${result.baseline.subjectPage._id}`);
    } else {
      console.log('❌ Baseline: Not found');
    }
    
    if (result.default?.subjectPage) {
      console.log('✅ Default found:');
      console.log(`   Title: ${result.default.subjectPage.title}`);
      console.log(`   Subject: ${result.default.subjectPage.subject}`);
      console.log(`   ID: ${result.default.subjectPage._id}`);
    } else {
      console.log('❌ Default: Not found');
    }
    
    // Simulate the fallback logic from the app
    console.log('\n🎯 Fallback Resolution:');
    console.log('=======================');
    
    let chosenPage = null;
    let chosenSource = null;
    
    if (result.cloneSpecific?.subjectPage) {
      chosenPage = result.cloneSpecific.subjectPage;
      chosenSource = 'cloneSpecific';
    } else if (result.baseline?.subjectPage) {
      chosenPage = result.baseline.subjectPage;
      chosenSource = 'baseline';
    } else if (result.default?.subjectPage) {
      chosenPage = result.default.subjectPage;
      chosenSource = 'default';
    }
    
    if (chosenPage) {
      console.log(`🎯 Would choose: ${chosenSource}`);
      console.log(`   Title: ${chosenPage.title}`);
      console.log(`   Subject: ${chosenPage.subject}`);
      
      if (chosenPage.title.toLowerCase().includes('qatar')) {
        console.log('✅ CORRECT: Shows Qatar content');
      } else if (chosenPage.title.toLowerCase().includes('dubai')) {
        console.log('❌ WRONG: Shows Dubai content');
      } else {
        console.log('❓ Unknown content source');
      }
    } else {
      console.log('❌ No content would be chosen!');
    }
    
    // Check what content exists for Qatar vs Dubai
    console.log('\n📋 Content Analysis:');
    console.log('===================');
    
    const qatarMaths = await client.fetch(`
      *[_type == "subjectPage" && slug.current == "maths" && cloneReference->cloneId.current == "qatar-tutors"] {
        _id,
        subject,
        title,
        isActive,
        "cloneName": cloneReference->cloneName
      }
    `);
    
    const dubaiMaths = await client.fetch(`
      *[_type == "subjectPage" && slug.current == "maths" && !defined(cloneReference)] {
        _id,
        subject,
        title,
        isActive
      }
    `);
    
    console.log(`Qatar 'maths' pages: ${qatarMaths.length}`);
    qatarMaths.forEach(page => {
      console.log(`   - ${page.title} (Active: ${page.isActive !== false})`);
    });
    
    console.log(`Dubai/Default 'maths' pages: ${dubaiMaths.length}`);
    dubaiMaths.forEach(page => {
      console.log(`   - ${page.title} (Active: ${page.isActive !== false})`);
    });
    
  } catch (error) {
    console.error('Error debugging subject page:', error);
  }
}

debugSubjectPage(); 