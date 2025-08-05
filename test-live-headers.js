#!/usr/bin/env node

/**
 * Test live headers from the actual website
 * This will make a real HTTP request to see what headers are being returned
 */

const https = require('https');

async function testLiveHeaders(domain, path = '/maths') {
  console.log(`🌐 Testing live headers for: https://${domain}${path}`);
  console.log('='.repeat(60));
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: domain,
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DebugTool/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    };

    const req = https.request(options, (res) => {
      console.log(`📊 Status: ${res.statusCode} ${res.statusMessage}`);
      console.log('\n🔍 Response Headers:');
      console.log('==================');
      
      // Check for clone-related headers
      const cloneHeaders = {
        'x-clone-id': res.headers['x-clone-id'],
        'x-clone-name': res.headers['x-clone-name'], 
        'x-clone-source': res.headers['x-clone-source'],
        'x-debug-clone-result': res.headers['x-debug-clone-result'],
        'x-debug-middleware-executed': res.headers['x-debug-middleware-executed'],
        'x-debug-hostname': res.headers['x-debug-hostname']
      };
      
      let hasCloneHeaders = false;
      
      Object.entries(cloneHeaders).forEach(([header, value]) => {
        if (value) {
          console.log(`✅ ${header}: ${value}`);
          hasCloneHeaders = true;
        } else {
          console.log(`❌ ${header}: NOT FOUND`);
        }
      });
      
      if (!hasCloneHeaders) {
        console.log('\n🚨 NO CLONE HEADERS FOUND!');
        console.log('This means middleware is not running or not setting headers.');
      }
      
      // Check cache headers
      console.log('\n💾 Cache Headers:');
      console.log('================');
      console.log(`Cache-Control: ${res.headers['cache-control'] || 'NOT SET'}`);
      console.log(`ETag: ${res.headers['etag'] || 'NOT SET'}`);
      console.log(`Last-Modified: ${res.headers['last-modified'] || 'NOT SET'}`);
      
      // Check server headers
      console.log('\n🖥️ Server Info:');
      console.log('==============');
      console.log(`Server: ${res.headers['server'] || 'NOT SET'}`);
      console.log(`X-Vercel-ID: ${res.headers['x-vercel-id'] || 'NOT SET'}`);
      console.log(`X-Vercel-Cache: ${res.headers['x-vercel-cache'] || 'NOT SET'}`);
      
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        // Check if the page content contains Qatar or Dubai references
        console.log('\n📄 Content Analysis:');
        console.log('===================');
        
        const qatarMatches = (body.match(/qatar/gi) || []).length;
        const dubaiMatches = (body.match(/dubai/gi) || []).length;
        
        console.log(`Qatar mentions: ${qatarMatches}`);
        console.log(`Dubai mentions: ${dubaiMatches}`);
        
        if (qatarMatches > dubaiMatches) {
          console.log('✅ Page appears to show Qatar content');
        } else if (dubaiMatches > qatarMatches) {
          console.log('❌ Page appears to show Dubai content (ISSUE!)');
        } else {
          console.log('⚠️ Cannot determine content origin');
        }
        
        // Look for specific text patterns
        if (body.includes('Dubai Maths Tutors') || body.includes('Dubai IB Tutors')) {
          console.log('🚨 FOUND DUBAI-SPECIFIC CONTENT! This confirms the issue.');
        }
        
        if (body.includes('Qatar Maths Tutors') || body.includes('Qatar IB Tutors')) {
          console.log('✅ Found Qatar-specific content in HTML');
        }
        
        resolve({
          status: res.statusCode,
          headers: cloneHeaders,
          hasCloneHeaders,
          qatarMatches,
          dubaiMatches
        });
      });
    });

    req.on('error', (err) => {
      console.error('❌ Request failed:', err.message);
      reject(err);
    });

    req.setTimeout(10000, () => {
      console.error('❌ Request timed out');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 LIVE HEADERS TEST');
  console.log('===================\n');
  
  try {
    // Test multiple pages
    const tests = [
      { domain: 'onlinetutors.qa', path: '/maths', description: 'Qatar Maths Subject Page' },
      { domain: 'onlinetutors.qa', path: '/ib', description: 'Qatar IB Curriculum Page' },
      { domain: 'onlinetutors.qa', path: '/physics', description: 'Qatar Physics Subject Page' }
    ];
    
    for (const test of tests) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`🔍 Testing: ${test.description}`);
      console.log(`${'='.repeat(80)}`);
      
      await testLiveHeaders(test.domain, test.path);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📋 SUMMARY & NEXT STEPS');
    console.log('='.repeat(80));
    
    console.log('\nIf you see:');
    console.log('✅ Clone headers present + Qatar content → Everything working');
    console.log('❌ No clone headers → Middleware not running');
    console.log('⚠️ Clone headers present + Dubai content → Page rendering issue');
    console.log('🔄 Mixed results → Cache issue');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTests();