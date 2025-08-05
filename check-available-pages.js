// Load environment variables manually
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envFiles = ['.env.local', '.env'];
  
  for (const envFile of envFiles) {
    const envPath = path.join(__dirname, envFile);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value;
          }
        }
      });
      break;
    }
  }
}

loadEnvFile();

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  apiVersion: '2024-03-20',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function checkAvailablePages() {
  console.log('🔍 Checking Available Pages in System\n');
  
  try {
    // Get all subject pages
    console.log('📚 SUBJECT PAGES:');
    console.log('================');
    const subjectPages = await client.fetch(`*[_type == "subjectPage"] {
      _id,
      title,
      slug,
      isActive,
      cloneReference-> {
        cloneId,
        cloneName
      }
    } | order(slug.current asc)`);
    
    subjectPages.forEach((page, i) => {
      const status = page.isActive ? '✅' : '❌';
      const clone = page.cloneReference ? `→ ${page.cloneReference.cloneName}` : '→ Default';
      console.log(`${i + 1}. ${status} ${page.slug.current} - "${page.title}" ${clone}`);
    });
    
    console.log(`\nTotal: ${subjectPages.length} subject pages\n`);
    
    // Get all curriculum pages
    console.log('🎓 CURRICULUM PAGES:');
    console.log('==================');
    const curriculumPages = await client.fetch(`*[_type == "curriculumPage"] {
      _id,
      title,
      slug,
      curriculum,
      isActive,
      cloneReference-> {
        cloneId,
        cloneName
      }
    } | order(slug.current asc)`);
    
    curriculumPages.forEach((page, i) => {
      const status = page.isActive ? '✅' : '❌';
      const clone = page.cloneReference ? `→ ${page.cloneReference.cloneName}` : '→ Default';
      console.log(`${i + 1}. ${status} ${page.slug.current} - "${page.title}" (${page.curriculum}) ${clone}`);
    });
    
    console.log(`\nTotal: ${curriculumPages.length} curriculum pages\n`);
    
    // Check Qatar-specific content
    console.log('🇶🇦 QATAR-SPECIFIC CONTENT:');
    console.log('==========================');
    
    const qatarSubjects = subjectPages.filter(page => 
      page.cloneReference?.cloneId?.current === 'qatar-tutors'
    );
    
    const qatarCurriculum = curriculumPages.filter(page => 
      page.cloneReference?.cloneId?.current === 'qatar-tutors'
    );
    
    console.log('Subject Pages:');
    qatarSubjects.forEach((page, i) => {
      console.log(`  ${i + 1}. ${page.slug.current} - "${page.title}"`);
    });
    
    console.log('\nCurriculum Pages:');
    qatarCurriculum.forEach((page, i) => {
      console.log(`  ${i + 1}. ${page.slug.current} - "${page.title}" (${page.curriculum})`);
    });
    
    console.log(`\nQatar has ${qatarSubjects.length} subject pages and ${qatarCurriculum.length} curriculum pages`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAvailablePages();