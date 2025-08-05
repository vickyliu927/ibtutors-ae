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

async function debugCompletePageResolution() {
  const [,, domain, subject, explicitCloneId] = process.argv;
  
  if (!domain && !explicitCloneId) {
    log('red', 'Usage: node debug-complete-pages.js [domain] [subject] [cloneId]');
    log('yellow', 'Examples:');
    log('yellow', '  node debug-complete-pages.js onlinetutors.qa ib');
    log('yellow', '  node debug-complete-pages.js onlinetutors.qa maths');
    log('yellow', '  node debug-complete-pages.js "" ib qatar-tutors');
    process.exit(1);
  }

  const targetSubject = subject || 'maths';
  
  console.log('🚀 Starting Complete Page Debug (Subject + Curriculum)...');
  console.log(`📍 Target: ${domain || 'N/A'} → ${targetSubject} → ${explicitCloneId || 'Auto-detect'}`);
  
  try {
    // STEP 1: Domain to Clone Resolution
    section('STEP 1: Domain to Clone Resolution');
    
    let resolvedCloneId = explicitCloneId;
    
    if (domain && !explicitCloneId) {
      log('blue', `🌐 Testing domain: ${domain}`);
      
      const normalizedDomain = domain.replace(/^www\./, '').toLowerCase();
      const domainQuery = `*[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
        cloneId,
        cloneName,
        isActive,
        baselineClone
      }`;
      
      const domainResult = await client.fetch(domainQuery, { hostname: normalizedDomain });
      
      if (domainResult) {
        resolvedCloneId = domainResult.cloneId.current;
        log('green', `✅ Domain mapped to: ${domainResult.cloneName} (${resolvedCloneId})`);
      } else {
        log('red', `❌ No clone found for domain: ${normalizedDomain}`);
      }
    }

    // STEP 2: Check Both Subject and Curriculum Pages
    section('STEP 2: Page Analysis (Subject + Curriculum)');
    
    log('blue', `🔍 Analyzing page: ${targetSubject}`);
    
    // Check subject pages
    const subjectPages = await client.fetch(`*[_type == "subjectPage" && slug.current == $subject] {
      _id,
      _type,
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
    
    // Check curriculum pages
    const curriculumPages = await client.fetch(`*[_type == "curriculumPage" && slug.current == $subject] {
      _id,
      _type,
      title,
      curriculum,
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
    
    const allPages = [...subjectPages, ...curriculumPages];
    
    log('cyan', `📄 Found ${allPages.length} total page(s) for "${targetSubject}":`);
    log('cyan', `   • ${subjectPages.length} subject page(s)`);
    log('cyan', `   • ${curriculumPages.length} curriculum page(s)`);
    
    allPages.forEach((page, i) => {
      const pageStatus = page.isActive ? '✅' : '❌';
      const pageType = page._type === 'subjectPage' ? '📚 Subject' : '🎓 Curriculum';
      const curriculum = page.curriculum ? ` (${page.curriculum})` : '';
      const cloneInfo = page.cloneReference ? 
        `→ ${page.cloneReference.cloneName} (${page.cloneReference.cloneId?.current})` : 
        '→ Default';
      const cloneStatus = page.cloneReference?.isActive ? '✅' : '❌';
      
      log('cyan', `   ${i + 1}. ${pageStatus} ${pageType}: "${page.title}"${curriculum} ${cloneInfo}`);
      if (page.cloneReference) {
        log('cyan', `      Clone Status: ${cloneStatus} ${page.cloneReference.isActive ? 'Active' : 'Inactive'}`);
      }
    });

    // STEP 3: Test Resolution (Both Types)
    section('STEP 3: Content Resolution Test');
    
    log('blue', `🧪 Testing resolution for: ${resolvedCloneId || 'default'}`);
    
    // Test subject page resolution
    const subjectResolutionQuery = `{
      "cloneSpecific": *[_type == "subjectPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0] {
        _id,
        _type,
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
        _type,
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
        _type,
        title,
        isActive
      }
    }`;

    // Test curriculum page resolution
    const curriculumResolutionQuery = `{
      "cloneSpecific": *[_type == "curriculumPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0] {
        _id,
        _type,
        title,
        curriculum,
        isActive,
        cloneReference-> {
          cloneId,
          cloneName,
          isActive
        }
      },
      "baseline": *[_type == "curriculumPage" && slug.current == $subject && cloneReference->baselineClone == true && isActive == true][0] {
        _id,
        _type,
        title,
        curriculum,
        isActive,
        cloneReference-> {
          cloneId,
          cloneName,
          isActive
        }
      },
      "default": *[_type == "curriculumPage" && slug.current == $subject && !defined(cloneReference) && isActive == true][0] {
        _id,
        _type,
        title,
        curriculum,
        isActive
      }
    }`;

    const [subjectResult, curriculumResult] = await Promise.all([
      client.fetch(subjectResolutionQuery, { subject: targetSubject, cloneId: resolvedCloneId || 'none' }),
      client.fetch(curriculumResolutionQuery, { subject: targetSubject, cloneId: resolvedCloneId || 'none' })
    ]);

    // Determine which type of page exists and what will be used
    let finalChoice = 'none';
    let finalPage = null;
    let pageType = 'none';

    // Check subject pages first (since the app checks curriculum first, then subject)
    if (curriculumResult.cloneSpecific) {
      finalChoice = 'cloneSpecific';
      finalPage = curriculumResult.cloneSpecific;
      pageType = 'curriculum';
    } else if (curriculumResult.baseline) {
      finalChoice = 'baseline';
      finalPage = curriculumResult.baseline;
      pageType = 'curriculum';
    } else if (curriculumResult.default) {
      finalChoice = 'default';
      finalPage = curriculumResult.default;
      pageType = 'curriculum';
    } else if (subjectResult.cloneSpecific) {
      finalChoice = 'cloneSpecific';
      finalPage = subjectResult.cloneSpecific;
      pageType = 'subject';
    } else if (subjectResult.baseline) {
      finalChoice = 'baseline';
      finalPage = subjectResult.baseline;
      pageType = 'subject';
    } else if (subjectResult.default) {
      finalChoice = 'default';
      finalPage = subjectResult.default;
      pageType = 'subject';
    }

    // Report results
    if (curriculumResult.cloneSpecific || curriculumResult.baseline || curriculumResult.default) {
      log('yellow', '\n🎓 CURRICULUM PAGE RESULTS:');
      
      if (curriculumResult.cloneSpecific) {
        const active = finalChoice === 'cloneSpecific' && pageType === 'curriculum' ? ' 👉 WILL BE USED' : '';
        log('green', `✅ Clone-specific curriculum content found${active}`);
        log('cyan', `   Title: ${curriculumResult.cloneSpecific.title} (${curriculumResult.cloneSpecific.curriculum})`);
      }
      
      if (curriculumResult.baseline) {
        const active = finalChoice === 'baseline' && pageType === 'curriculum' ? ' 👉 WILL BE USED' : '';
        log('yellow', `⚠️ Baseline curriculum content found${active}`);
        log('cyan', `   Title: ${curriculumResult.baseline.title} (${curriculumResult.baseline.curriculum})`);
      }
      
      if (curriculumResult.default) {
        const active = finalChoice === 'default' && pageType === 'curriculum' ? ' 👉 WILL BE USED' : '';
        log('blue', `📋 Default curriculum content found${active}`);
        log('cyan', `   Title: ${curriculumResult.default.title} (${curriculumResult.default.curriculum})`);
      }
    } else {
      log('red', '\n❌ No curriculum page content found');
    }

    if (subjectResult.cloneSpecific || subjectResult.baseline || subjectResult.default) {
      log('yellow', '\n📚 SUBJECT PAGE RESULTS:');
      
      if (subjectResult.cloneSpecific) {
        const active = finalChoice === 'cloneSpecific' && pageType === 'subject' ? ' 👉 WILL BE USED' : '';
        log('green', `✅ Clone-specific subject content found${active}`);
        log('cyan', `   Title: ${subjectResult.cloneSpecific.title}`);
      }
      
      if (subjectResult.baseline) {
        const active = finalChoice === 'baseline' && pageType === 'subject' ? ' 👉 WILL BE USED' : '';
        log('yellow', `⚠️ Baseline subject content found${active}`);
        log('cyan', `   Title: ${subjectResult.baseline.title}`);
      }
      
      if (subjectResult.default) {
        const active = finalChoice === 'default' && pageType === 'subject' ? ' 👉 WILL BE USED' : '';
        log('blue', `📋 Default subject content found${active}`);
        log('cyan', `   Title: ${subjectResult.default.title}`);
      }
    } else {
      log('red', '\n❌ No subject page content found');
    }

    // STEP 4: Final Results
    section('STEP 4: Final Resolution');
    
    if (finalChoice === 'cloneSpecific') {
      log('green', `🎉 SUCCESS: Using CLONE-SPECIFIC ${pageType.toUpperCase()} content`);
      log('cyan', `   Page: ${finalPage.title}`);
      if (finalPage.curriculum) {
        log('cyan', `   Curriculum: ${finalPage.curriculum}`);
      }
    } else if (finalChoice !== 'none') {
      log('yellow', `⚠️ FALLBACK: Using ${finalChoice.toUpperCase()} ${pageType.toUpperCase()} content`);
      log('cyan', `   Page: ${finalPage.title}`);
      if (finalPage.curriculum) {
        log('cyan', `   Curriculum: ${finalPage.curriculum}`);
      }
    } else {
      log('red', '💥 NO CONTENT: No pages found at any level!');
    }

    // STEP 5: App Behavior Note
    section('STEP 5: Important Notes');
    
    log('blue', '📝 How the app actually works:');
    log('cyan', '   1. First checks for CURRICULUM pages');
    log('cyan', '   2. If no curriculum page found, checks SUBJECT pages');
    log('cyan', '   3. Uses 3-tier fallback: clone-specific → baseline → default');
    
    if (pageType === 'curriculum') {
      log('green', `✅ This URL will render as a CURRICULUM page`);
    } else if (pageType === 'subject') {
      log('yellow', `⚠️ This URL will render as a SUBJECT page`);
    } else {
      log('red', `❌ This URL will return 404 (not found)`);
    }

  } catch (error) {
    log('red', '💥 Error during debugging:');
    console.error(error);
  }
}

// Main execution
async function main() {
  console.log('🔍 Complete Page Resolution Debugger');
  console.log('===================================\n');
  
  await debugCompletePageResolution();
}

main().catch(console.error);