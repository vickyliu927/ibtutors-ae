#!/usr/bin/env node

/**
 * Clone Content Resolution Debugger
 * 
 * This script helps debug why clone-specific content is falling back to baseline/default
 * Run with: node debug-clone-content.js [domain] [subject] [cloneId]
 */

import { createClient } from '@sanity/client';

// Sanity client configuration
const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  apiVersion: '2024-03-20',
  useCdn: false, // Don't use CDN for debugging to get fresh data
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published',
});

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log('bold', `🔍 ${title}`);
  console.log('='.repeat(60));
}

async function debugCloneContentResolution() {
  const [,, domain, subject, explicitCloneId] = process.argv;
  
  if (!domain && !explicitCloneId) {
    log('red', 'Usage: node debug-clone-content.js [domain] [subject] [cloneId]');
    log('yellow', 'Examples:');
    log('yellow', '  node debug-clone-content.js mydomain.com maths');
    log('yellow', '  node debug-clone-content.js "" maths my-clone-id');
    process.exit(1);
  }

  const targetSubject = subject || 'maths';
  
  try {
    // STEP 1: Domain-to-Clone Mapping
    section('STEP 1: Domain-to-Clone Mapping');
    
    let resolvedCloneId = explicitCloneId;
    
    if (domain && !explicitCloneId) {
      log('blue', `🌐 Checking domain mapping for: ${domain}`);
      
      const normalizedDomain = domain.replace(/^www\./, '').toLowerCase();
      log('cyan', `📝 Normalized domain: ${normalizedDomain}`);
      
      const domainQuery = `*[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
        cloneId,
        cloneName,
        isActive,
        baselineClone,
        "domains": metadata.domains,
        metadata
      }`;
      
      const domainResult = await client.fetch(domainQuery, { hostname: normalizedDomain });
      
      if (domainResult) {
        resolvedCloneId = domainResult.cloneId.current;
        log('green', `✅ Domain mapped to clone: ${domainResult.cloneName} (${resolvedCloneId})`);
        log('cyan', `   Baseline: ${domainResult.baselineClone ? 'Yes' : 'No'}`);
        log('cyan', `   Active: ${domainResult.isActive ? 'Yes' : 'No'}`);
        log('cyan', `   Domains: ${domainResult.domains?.join(', ') || 'None'}`);
      } else {
        log('red', `❌ No clone found for domain: ${normalizedDomain}`);
        log('yellow', '   This will cause fallback to baseline/default');
        
        // Show available clones with domains
        const allClones = await client.fetch(`*[_type == "clone" && isActive == true] {
          cloneId,
          cloneName,
          isActive,
          baselineClone,
          "domains": metadata.domains
        }`);
        
        log('yellow', '\n📋 Available clones with domains:');
        allClones.forEach(clone => {
          log('cyan', `   • ${clone.cloneName} (${clone.cloneId.current})`);
          log('cyan', `     Domains: ${clone.domains?.join(', ') || 'None configured'}`);
          log('cyan', `     Baseline: ${clone.baselineClone ? 'Yes' : 'No'}\n`);
        });
      }
    } else if (explicitCloneId) {
      log('blue', `🎯 Using explicit clone ID: ${explicitCloneId}`);
    }

    // STEP 2: Clone Validation
    section('STEP 2: Clone Validation');
    
    if (resolvedCloneId) {
      log('blue', `🔍 Validating clone: ${resolvedCloneId}`);
      
      const cloneQuery = `*[_type == "clone" && cloneId.current == $cloneId][0] {
        _id,
        cloneId,
        cloneName,
        isActive,
        baselineClone,
        metadata
      }`;
      
      const clone = await client.fetch(cloneQuery, { cloneId: resolvedCloneId });
      
      if (clone) {
        log('green', `✅ Clone found: ${clone.cloneName}`);
        log('cyan', `   ID: ${clone.cloneId.current}`);
        log('cyan', `   Active: ${clone.isActive ? 'Yes' : 'No'}`);
        log('cyan', `   Baseline: ${clone.baselineClone ? 'Yes' : 'No'}`);
        
        if (!clone.isActive) {
          log('red', '❌ CRITICAL: Clone is not active!');
          log('yellow', '   This will cause fallback to baseline/default');
        }
      } else {
        log('red', `❌ Clone ID not found: ${resolvedCloneId}`);
        log('yellow', '   This will cause fallback to baseline/default');
        resolvedCloneId = null;
      }
    } else {
      log('yellow', '⚠️ No clone ID resolved, will use baseline/default');
    }

    // STEP 3: Subject Page Content Resolution
    section('STEP 3: Subject Page Content Resolution');
    
    log('blue', `🔍 Checking subject page content for: ${targetSubject}`);
    
    // Build the same query used in the actual code
    const subjectPageQuery = `{
      "cloneSpecific": *[_type == "subjectPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0]{
        _id,
        subject,
        title,
        slug,
        isActive,
        cloneReference,
        "cloneInfo": cloneReference-> {
          cloneId,
          cloneName,
          isActive
        },
        "sourceInfo": {
          "source": "cloneSpecific",
          "cloneId": $cloneId
        }
      },
      "baseline": *[_type == "subjectPage" && slug.current == $subject && cloneReference->baselineClone == true && isActive == true][0]{
        _id,
        subject,
        title,
        slug,
        isActive,
        cloneReference,
        "cloneInfo": cloneReference-> {
          cloneId,
          cloneName,
          isActive
        },
        "sourceInfo": {
          "source": "baseline",
          "cloneId": cloneReference->cloneId.current
        }
      },
      "default": *[_type == "subjectPage" && slug.current == $subject && !defined(cloneReference) && isActive == true][0]{
        _id,
        subject,
        title,
        slug,
        isActive,
        "sourceInfo": {
          "source": "default",
          "cloneId": null
        }
      }
    }`;

    const subjectResult = await client.fetch(subjectPageQuery, { 
      subject: targetSubject, 
      cloneId: resolvedCloneId || 'none'
    });

    // Analyze each tier
    log('magenta', '\n🎯 Content Resolution Analysis:');
    
    if (subjectResult.cloneSpecific) {
      log('green', '✅ CLONE-SPECIFIC content found');
      log('cyan', `   Subject: ${subjectResult.cloneSpecific.subject}`);
      log('cyan', `   Title: ${subjectResult.cloneSpecific.title}`);
      log('cyan', `   Active: ${subjectResult.cloneSpecific.isActive}`);
      log('cyan', `   Clone: ${subjectResult.cloneSpecific.cloneInfo?.cloneName} (${subjectResult.cloneSpecific.cloneInfo?.cloneId?.current})`);
      log('green', '   👉 This should be used (tier 1)');
    } else {
      log('red', '❌ No clone-specific content found');
      
      if (resolvedCloneId) {
        log('yellow', '🔍 Investigating why clone-specific content is missing...');
        
        // Check if subject page exists for this clone but is inactive
        const inactiveCheck = await client.fetch(
          `*[_type == "subjectPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId] {
            _id,
            isActive,
            cloneReference,
            "cloneInfo": cloneReference-> {
              cloneId,
              cloneName,
              isActive
            }
          }`,
          { subject: targetSubject, cloneId: resolvedCloneId }
        );
        
        if (inactiveCheck.length > 0) {
          log('yellow', `   📄 Found ${inactiveCheck.length} subject page(s) with clone reference:`);
          inactiveCheck.forEach((page, i) => {
            log('cyan', `     ${i + 1}. Page Active: ${page.isActive ? 'Yes' : 'No'}`);
            log('cyan', `        Clone Active: ${page.cloneInfo?.isActive ? 'Yes' : 'No'}`);
            log('cyan', `        Clone: ${page.cloneInfo?.cloneName} (${page.cloneInfo?.cloneId?.current})`);
            
            if (!page.isActive) {
              log('red', '        ❌ PAGE IS INACTIVE!');
            }
            if (!page.cloneInfo?.isActive) {
              log('red', '        ❌ REFERENCED CLONE IS INACTIVE!');
            }
          });
        } else {
          log('red', '   ❌ No subject page found with this clone reference');
          log('yellow', '   💡 You need to create a subject page and link it to this clone');
        }
      }
    }

    if (subjectResult.baseline) {
      log('yellow', '⚠️ BASELINE content found');
      log('cyan', `   Subject: ${subjectResult.baseline.subject}`);
      log('cyan', `   Title: ${subjectResult.baseline.title}`);
      log('cyan', `   Active: ${subjectResult.baseline.isActive}`);
      log('cyan', `   Clone: ${subjectResult.baseline.cloneInfo?.cloneName} (${subjectResult.baseline.cloneInfo?.cloneId?.current})`);
      log('yellow', '   👉 This will be used if no clone-specific content (tier 2)');
    } else {
      log('yellow', '⚠️ No baseline content found');
    }

    if (subjectResult.default) {
      log('blue', '📋 DEFAULT content found');
      log('cyan', `   Subject: ${subjectResult.default.subject}`);
      log('cyan', `   Title: ${subjectResult.default.title}`);
      log('cyan', `   Active: ${subjectResult.default.isActive}`);
      log('blue', '   👉 This will be used as last resort (tier 3)');
    } else {
      log('red', '❌ No default content found - this is bad!');
    }

    // STEP 4: Final Resolution
    section('STEP 4: Final Resolution');
    
    let finalSource = 'none';
    let finalContent = null;
    
    if (subjectResult.cloneSpecific) {
      finalSource = 'cloneSpecific';
      finalContent = subjectResult.cloneSpecific;
      log('green', '🎉 RESULT: Using CLONE-SPECIFIC content');
    } else if (subjectResult.baseline) {
      finalSource = 'baseline';
      finalContent = subjectResult.baseline;
      log('yellow', '⚠️ RESULT: Falling back to BASELINE content');
    } else if (subjectResult.default) {
      finalSource = 'default';
      finalContent = subjectResult.default;
      log('blue', '📋 RESULT: Falling back to DEFAULT content');
    } else {
      log('red', '💥 RESULT: NO CONTENT FOUND!');
    }

    // STEP 5: Recommendations
    section('STEP 5: Recommendations');
    
    if (finalSource === 'cloneSpecific') {
      log('green', '✅ Everything is working correctly!');
    } else {
      log('yellow', '🔧 Issues found. Here\'s how to fix them:');
      
      if (finalSource === 'baseline' || finalSource === 'default') {
        if (!resolvedCloneId) {
          log('red', '1. 🌐 DOMAIN MAPPING ISSUE');
          log('yellow', '   • Check that your domain is correctly added to the clone\'s metadata.domains array');
          log('yellow', '   • Ensure domain format is correct (no http://, no www. prefix)');
          log('yellow', '   • Verify the clone is active');
        } else {
          log('red', '2. 📄 SUBJECT PAGE ISSUE');
          log('yellow', '   • Create a subject page for this clone if it doesn\'t exist');
          log('yellow', '   • Ensure the subject page has cloneReference set to your clone');
          log('yellow', '   • Verify both the subject page and clone are active (isActive = true)');
          log('yellow', '   • Check that the slug matches exactly');
        }
      }
      
      if (finalSource === 'none') {
        log('red', '3. 🚨 CRITICAL: NO CONTENT AVAILABLE');
        log('yellow', '   • Create a default subject page (no clone reference)');
        log('yellow', '   • Or ensure baseline clone has content');
        log('yellow', '   • Check that content is active');
      }
    }

    // STEP 6: Quick Fixes
    section('STEP 6: Quick Testing');
    
    log('blue', '🧪 Quick tests you can try:');
    if (domain) {
      log('cyan', `• Test with URL param: https://${domain}/${targetSubject}?clone=${resolvedCloneId || 'test-clone-id'}`);
    }
    log('cyan', '• Check the CloneIndicatorBanner component in development mode');
    log('cyan', '• Look at browser dev tools → Network → Headers for x-clone-id');
    log('cyan', '• Check server logs for clone resolution messages');

  } catch (error) {
    log('red', '💥 Error during debugging:');
    console.error(error);
  }
}

// Run the debugger
debugCloneContentResolution();