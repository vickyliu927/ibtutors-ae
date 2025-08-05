// Debug script to test middleware header setting
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-20',
});

async function testMiddlewareHeaders() {
  console.log('🔍 Testing Middleware Header Setting');
  console.log('==================================\n');

  // Test the middleware domain lookup logic
  const testDomains = [
    'onlinetutors.qa',
    'www.onlinetutors.qa', 
    'dubaitutors.ae',
    'www.dubaitutors.ae'
  ];

  for (const domain of testDomains) {
    console.log(`Testing domain: ${domain}`);
    
    // Normalize hostname (same logic as middleware)
    const normalizedHostname = domain.replace(/^www\./, '');
    
    // Test the exact query from middleware.ts
    const query = `*[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
      cloneId,
      cloneName,
      "domains": metadata.domains
    }`;
    
    try {
      const result = await client.fetch(query, { hostname: normalizedHostname });
      
      if (result) {
        console.log(`  ✅ Should set headers:`);
        console.log(`     x-clone-id: ${result.cloneId.current}`);
        console.log(`     x-clone-name: ${result.cloneName}`);
        console.log(`     x-clone-source: domain-mapping`);
      } else {
        console.log(`  ❌ No clone found - should remove headers`);
      }
    } catch (error) {
      console.log(`  💥 Query error:`, error.message);
    }
    
    console.log('');
  }

  // Test the cache logic simulation
  console.log('\n🧪 Cache Logic Test:');
  console.log('===================');
  console.log('If cache is working correctly:');
  console.log('1. First request to onlinetutors.qa → Query Sanity → Cache "qatar-tutors"');
  console.log('2. Subsequent requests → Return cached "qatar-tutors"');
  console.log('3. Headers should be: x-clone-id=qatar-tutors');
  console.log('');

  console.log('🚨 Potential Issues:');
  console.log('===================');
  console.log('1. Middleware not running on dynamic routes');
  console.log('2. Headers being lost between middleware and page');
  console.log('3. Cache returning wrong values');
  console.log('4. Domain normalization mismatch');
  console.log('5. Build cache vs runtime cache inconsistency');
  console.log('');

  console.log('🔧 Debug Steps:');
  console.log('================');
  console.log('1. Check Vercel function logs for middleware execution');
  console.log('2. Test headers with: curl -I https://onlinetutors.qa/maths');
  console.log('3. Add console.log to middleware to trace execution');
  console.log('4. Clear all caches (Vercel + CDN)');
}

testMiddlewareHeaders(); 