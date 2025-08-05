const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-20',
});

async function debugCloneDetection() {
  try {
    console.log('🔍 Debugging clone detection process...\n');
    
    // Test the middleware domain lookup that should happen
    console.log('1️⃣ Testing middleware domain lookup:');
    console.log('=====================================');
    
    const domains = ['onlinetutors.qa', 'www.onlinetutors.qa', 'dubaitutors.ae', 'www.dubaitutors.ae'];
    
    for (const domain of domains) {
      console.log(`\nTesting domain: ${domain}`);
      
      // This is the exact query used in middleware.ts
      const query = `*[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
        cloneId,
        cloneName,
        "domains": metadata.domains
      }`;
      
      const result = await client.fetch(query, { hostname: domain });
      
      if (result) {
        console.log(`  ✅ Found: ${result.cloneName} (${result.cloneId.current})`);
        console.log(`  📍 Domains: ${result.domains.join(', ')}`);
      } else {
        console.log(`  ❌ No clone found for ${domain}`);
      }
    }
    
    // Test what happens if middleware doesn't set headers
    console.log('\n\n2️⃣ Testing fallback when no clone ID provided:');
    console.log('================================================');
    
    const fallbackQuery = `{
      "cloneSpecific": *[_type == "subjectPage" && slug.current == "maths" && cloneReference->cloneId.current == $cloneId && isActive == true][0] {
        title, subject
      },
      "baseline": *[_type == "subjectPage" && slug.current == "maths" && cloneReference->baselineClone == true && isActive == true][0] {
        title, subject
      },
      "default": *[_type == "subjectPage" && slug.current == "maths" && !defined(cloneReference) && isActive == true][0] {
        title, subject
      }
    }`;
    
    // Test with no clone ID (what might happen if middleware fails)
    const noCloneResult = await client.fetch(fallbackQuery, { cloneId: null });
    console.log('When cloneId is null:');
    console.log('  Clone-specific:', noCloneResult.cloneSpecific ? noCloneResult.cloneSpecific.title : 'Not found');
    console.log('  Baseline:', noCloneResult.baseline ? noCloneResult.baseline.title : 'Not found');
    console.log('  Default:', noCloneResult.default ? noCloneResult.default.title : 'Not found');
    
    // Test with 'none' or 'global' (what might happen from client-side detection)
    const noneResult = await client.fetch(fallbackQuery, { cloneId: 'none' });
    console.log('\nWhen cloneId is "none":');
    console.log('  Clone-specific:', noneResult.cloneSpecific ? noneResult.cloneSpecific.title : 'Not found');
    console.log('  Baseline:', noneResult.baseline ? noneResult.baseline.title : 'Not found');
    console.log('  Default:', noneResult.default ? noneResult.default.title : 'Not found');
    
    // Check if there's actually a baseline clone configured
    console.log('\n\n3️⃣ Checking baseline clone configuration:');
    console.log('==========================================');
    
    const baselineClone = await client.fetch(`
      *[_type == "clone" && baselineClone == true && isActive == true][0] {
        cloneId,
        cloneName,
        "domains": metadata.domains
      }
    `);
    
    if (baselineClone) {
      console.log(`✅ Baseline clone: ${baselineClone.cloneName} (${baselineClone.cloneId.current})`);
      console.log(`📍 Domains: ${baselineClone.domains.join(', ')}`);
    } else {
      console.log('❌ No baseline clone configured!');
      console.log('   This could be why Qatar falls back to Dubai content');
    }
    
    // Test what the getCloneIdFromRequest function might return
    console.log('\n\n4️⃣ Simulating getCloneIdFromRequest scenarios:');
    console.log('==============================================');
    
    const scenarios = [
      { name: 'Headers missing (middleware failed)', cloneId: null },
      { name: 'Headers set to "none"', cloneId: 'none' },
      { name: 'Headers set correctly', cloneId: 'qatar-tutors' },
      { name: 'Empty string', cloneId: '' }
    ];
    
    for (const scenario of scenarios) {
      console.log(`\n${scenario.name}:`);
      const testResult = await client.fetch(fallbackQuery, { cloneId: scenario.cloneId || 'none' });
      
      let chosen = null;
      if (testResult.cloneSpecific) chosen = `Clone-specific: ${testResult.cloneSpecific.title}`;
      else if (testResult.baseline) chosen = `Baseline: ${testResult.baseline.title}`;
      else if (testResult.default) chosen = `Default: ${testResult.default.title}`;
      else chosen = 'Nothing found';
      
      console.log(`  → ${chosen}`);
    }
    
  } catch (error) {
    console.error('Error debugging clone detection:', error);
  }
}

debugCloneDetection(); 