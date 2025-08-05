#!/usr/bin/env node

/**
 * Simple Clone Content Debugger
 * Compatible with existing setup - uses require instead of import
 */

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
      
      console.log(`📁 Loaded environment from ${envFile}`);
      break;
    }
  }
}

loadEnvFile();

const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  apiVersion: '2024-03-20',
  useCdn: false,
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
    log('red', 'Usage: node debug-clone-simple.js [domain] [subject] [cloneId]');
    log('yellow', 'Examples:');
    log('yellow', '  node debug-clone-simple.js mydomain.com maths');
    log('yellow', '  node debug-clone-simple.js "" maths my-clone-id');
    process.exit(1);
  }

  const targetSubject = subject || 'maths';
  
  console.log('🚀 Starting Clone Content Debug...');
  console.log(`📍 Target: ${domain || 'N/A'} → ${targetSubject} → ${explicitCloneId || 'Auto-detect'}`);
  
  try {
    // STEP 1: List all available clones
    section('STEP 1: Available Clones');
    
    const allClones = await client.fetch(`*[_type == "clone"] {
      _id,
      cloneId,
      cloneName,
      isActive,
      baselineClone,
      "domains": metadata.domains
    } | order(cloneName asc)`);
    
    log('blue', `📋 Found ${allClones.length} total clones:`);
    allClones.forEach((clone, i) => {
      const status = clone.isActive ? '✅' : '❌';
      const baseline = clone.baselineClone ? '⭐ BASELINE' : '';
      log('cyan', `   ${i + 1}. ${status} ${clone.cloneName} (${clone.cloneId?.current || 'no-id'}) ${baseline}`);
      if (clone.domains && clone.domains.length > 0) {
        log('cyan', `      Domains: ${clone.domains.join(', ')}`);
      } else {
        log('yellow', '      No domains configured');
      }
    });

    // STEP 2: Domain-to-Clone Mapping
    section('STEP 2: Domain Mapping Test');
    
    let resolvedCloneId = explicitCloneId;
    
    if (domain && !explicitCloneId) {
      log('blue', `🌐 Testing domain: ${domain}`);
      
      const normalizedDomain = domain.replace(/^www\./, '').toLowerCase();
      log('cyan', `📝 Normalized: ${normalizedDomain}`);
      
      const domainResult = allClones.find(clone => 
        clone.domains && clone.domains.includes(normalizedDomain) && clone.isActive
      );
      
      if (domainResult) {
        resolvedCloneId = domainResult.cloneId.current;
        log('green', `✅ Domain mapped to: ${domainResult.cloneName} (${resolvedCloneId})`);
        log('cyan', `   Baseline: ${domainResult.baselineClone ? 'Yes' : 'No'}`);
      } else {
        log('red', `❌ No active clone found for domain: ${normalizedDomain}`);
        log('yellow', '   This will cause fallback to baseline/default');
        
        // Show which clones have this domain (but might be inactive)
        const inactiveMatches = allClones.filter(clone => 
          clone.domains && clone.domains.includes(normalizedDomain)
        );
        
        if (inactiveMatches.length > 0) {
          log('yellow', '   📋 Found inactive matches:');
          inactiveMatches.forEach(clone => {
            log('cyan', `     • ${clone.cloneName} (Active: ${clone.isActive})`);
          });
        }
      }
    } else if (explicitCloneId) {
      log('blue', `🎯 Using explicit clone ID: ${explicitCloneId}`);
    }

    // STEP 3: Subject Page Analysis
    section('STEP 3: Subject Page Content Analysis');
    
    log('blue', `🔍 Analyzing subject: ${targetSubject}`);
    
    // Get all subject pages for this subject
    const allSubjectPages = await client.fetch(`*[_type == "subjectPage" && slug.current == $subject] {
      _id,
      title,
      slug,
      isActive,
      cloneReference-> {
        _id,
        cloneId,
        cloneName,
        isActive,
        baselineClone
      }
    }`, { subject: targetSubject });
    
    log('cyan', `📄 Found ${allSubjectPages.length} subject page(s) for "${targetSubject}":`);
    
    allSubjectPages.forEach((page, i) => {
      const pageStatus = page.isActive ? '✅' : '❌';
      const cloneInfo = page.cloneReference ? 
        `→ ${page.cloneReference.cloneName} (${page.cloneReference.cloneId?.current})` : 
        '→ No clone (default)';
      const cloneStatus = page.cloneReference?.isActive ? '✅' : '❌';
      
      log('cyan', `   ${i + 1}. ${pageStatus} "${page.title}" ${cloneInfo}`);
      if (page.cloneReference) {
        log('cyan', `      Clone Status: ${cloneStatus} ${page.cloneReference.isActive ? 'Active' : 'Inactive'}`);
        if (page.cloneReference.baselineClone) {
          log('yellow', '      ⭐ This is BASELINE content');
        }
      }
    });

    // STEP 4: Resolution Test
    section('STEP 4: Content Resolution Test');
    
    if (resolvedCloneId) {
      log('blue', `🧪 Testing resolution for clone: ${resolvedCloneId}`);
    } else {
      log('yellow', '⚠️ No clone ID - testing fallback behavior');
    }
    
    // Test the exact resolution logic
    const resolutionQuery = `{
      "cloneSpecific": *[_type == "subjectPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0] {
        _id,
        title,
        isActive,
        cloneReference-> {
          cloneId,
          cloneName,
          isActive
        }
      },
      "baseline": *[_type == "subjectPage" && slug.current == $subject && cloneReference->baselineClone == true && isActive == true][0] {
        _id,
        title,
        isActive,
        cloneReference-> {
          cloneId,
          cloneName,
          isActive
        }
      },
      "default": *[_type == "subjectPage" && slug.current == $subject && !defined(cloneReference) && isActive == true][0] {
        _id,
        title,
        isActive
      }
    }`;

    const resolutionResult = await client.fetch(resolutionQuery, { 
      subject: targetSubject, 
      cloneId: resolvedCloneId || 'none'
    });

    // Analyze results
    let finalChoice = 'none';
    
    if (resolutionResult.cloneSpecific) {
      finalChoice = 'cloneSpecific';
      log('green', '✅ CLONE-SPECIFIC content found and will be used');
      log('cyan', `   Title: ${resolutionResult.cloneSpecific.title}`);
      log('cyan', `   Clone: ${resolutionResult.cloneSpecific.cloneReference?.cloneName}`);
    } else {
      log('red', '❌ No clone-specific content found');
    }
    
    if (resolutionResult.baseline) {
      const willUse = finalChoice === 'none' ? ' 👉 WILL BE USED' : '';
      log('yellow', `⚠️ BASELINE content available${willUse}`);
      log('cyan', `   Title: ${resolutionResult.baseline.title}`);
      log('cyan', `   Clone: ${resolutionResult.baseline.cloneReference?.cloneName}`);
      if (finalChoice === 'none') finalChoice = 'baseline';
    } else {
      log('red', '❌ No baseline content found');
    }
    
    if (resolutionResult.default) {
      const willUse = finalChoice === 'none' ? ' 👉 WILL BE USED' : '';
      log('blue', `📋 DEFAULT content available${willUse}`);
      log('cyan', `   Title: ${resolutionResult.default.title}`);
      if (finalChoice === 'none') finalChoice = 'default';
    } else {
      log('red', '❌ No default content found');
    }

    // STEP 5: Recommendations
    section('STEP 5: Diagnosis & Recommendations');
    
    if (finalChoice === 'cloneSpecific') {
      log('green', '🎉 SUCCESS: Clone-specific content is working perfectly!');
    } else {
      log('yellow', `⚠️ ISSUE: Falling back to ${finalChoice.toUpperCase()} content`);
      log('red', '\n🔧 How to fix:');
      
      if (finalChoice === 'baseline' || finalChoice === 'default') {
        if (!resolvedCloneId) {
          log('yellow', '1. 🌐 DOMAIN MAPPING ISSUE:');
          log('cyan', '   • Add your domain to the clone\'s metadata.domains array');
          log('cyan', '   • Format: ["yourdomain.com"] (no http://, no www.)');
          log('cyan', '   • Ensure the clone is active (isActive = true)');
        } else {
          log('yellow', '2. 📄 SUBJECT PAGE ISSUE:');
          log('cyan', '   • Create a subject page for your clone');
          log('cyan', '   • Set cloneReference to your clone');
          log('cyan', '   • Ensure both page and clone are active');
          log('cyan', '   • Check slug matches exactly');
        }
      }
      
      if (finalChoice === 'none') {
        log('red', '3. 🚨 CRITICAL ISSUE:');
        log('cyan', '   • No content found at any level');
        log('cyan', '   • Create at least a default subject page');
        log('cyan', '   • Ensure content is active');
      }
    }

    // STEP 6: Quick Test URLs
    section('STEP 6: Test URLs');
    
    if (domain) {
      log('blue', '🧪 Test these URLs:');
      log('cyan', `• Normal: https://${domain}/${targetSubject}`);
      if (resolvedCloneId) {
        log('cyan', `• With clone param: https://${domain}/${targetSubject}?clone=${resolvedCloneId}`);
      }
      log('cyan', '• Check browser dev tools → Network → Headers for x-clone-id');
    }

  } catch (error) {
    log('red', '💥 Error during debugging:');
    console.error(error);
    
    if (error.message.includes('token')) {
      log('yellow', '\n💡 This might be a token issue. Check your .env file has SANITY_API_TOKEN set.');
    }
  }
}

// Check if we have required dependencies
async function checkSetup() {
  try {
    // Test Sanity connection
    await client.fetch('*[_type == "clone"][0]');
    log('green', '✅ Sanity connection working');
    return true;
  } catch (error) {
    log('red', '❌ Sanity connection failed:');
    console.error(error.message);
    
    if (error.message.includes('token')) {
      log('yellow', '\n💡 Set your SANITY_API_TOKEN in .env file');
      log('cyan', '   Get it from: https://sanity.io/manage/personal/tokens');
    }
    
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Simple Clone Content Debugger');
  console.log('================================\n');
  
  const setupOk = await checkSetup();
  if (setupOk) {
    await debugCloneContentResolution();
  }
}

main().catch(console.error);