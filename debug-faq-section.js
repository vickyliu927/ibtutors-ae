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

async function debugFaqSection() {
  const [,, domain, subject, explicitCloneId] = process.argv;
  
  const targetDomain = domain || 'onlinetutors.qa';
  const targetSubject = subject || 'maths';
  const cloneId = explicitCloneId || 'qatar-tutors';
  
  console.log('🔍 FAQ Section Debug');
  console.log('===================');
  console.log(`🎯 Target: ${targetDomain} → ${targetSubject} → ${cloneId}\n`);

  try {
    // STEP 1: Check the subject page's FAQ section field
    section('STEP 1: Subject Page FAQ Reference');
    
    const subjectPageQuery = `*[_type == "subjectPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0] {
      _id,
      title,
      faqSection-> {
        _id,
        title,
        subtitle,
        faqs[]-> {
          _id,
          question,
          answer
        }
      }
    }`;
    
    const subjectPage = await client.fetch(subjectPageQuery, { subject: targetSubject, cloneId });
    
    if (subjectPage) {
      log('green', `✅ Found Qatar subject page: ${subjectPage.title}`);
      
      if (subjectPage.faqSection) {
        log('yellow', `⚠️ Subject page HAS FAQ section reference: ${subjectPage.faqSection.title}`);
        log('cyan', `   FAQ ID: ${subjectPage.faqSection._id}`);
        log('cyan', `   FAQ Count: ${subjectPage.faqSection.faqs?.length || 0} questions`);
        
        if (subjectPage.faqSection.faqs && subjectPage.faqSection.faqs.length > 0) {
          log('cyan', '   First FAQ:');
          log('cyan', `     Q: ${subjectPage.faqSection.faqs[0].question}`);
          log('cyan', `     A: ${subjectPage.faqSection.faqs[0].answer?.substring(0, 100)}...`);
        }
      } else {
        log('green', `✅ Subject page has NO FAQ section reference (this should mean no FAQ)`);
      }
    } else {
      log('red', '❌ No Qatar subject page found');
    }

    // STEP 2: Check the clone-aware FAQ queries (this is what the app actually uses)
    section('STEP 2: Clone-Aware FAQ Queries (App Behavior)');
    
    // This mimics the actual FAQ query system used by the app
    const faqFallbackQuery = `{
      "cloneSpecific": *[_type == "faq_section" && pageType == "subject" && subjectSlug == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0] {
        _id,
        title,
        subtitle,
        pageType,
        subjectSlug,
        faqReferences[]-> {
          _id,
          question,
          answer,
          displayOrder
        },
        cloneReference-> {
          cloneId,
          cloneName
        }
      },
      "baseline": *[_type == "faq_section" && pageType == "subject" && subjectSlug == $subject && cloneReference->baselineClone == true && isActive == true][0] {
        _id,
        title,
        subtitle,
        pageType,
        subjectSlug,
        faqReferences[]-> {
          _id,
          question,
          answer,
          displayOrder
        },
        cloneReference-> {
          cloneId,
          cloneName
        }
      },
      "default": *[_type == "faq_section" && pageType == "subject" && subjectSlug == $subject && !defined(cloneReference) && isActive == true][0] {
        _id,
        title,
        subtitle,
        pageType,
        subjectSlug,
        faqReferences[]-> {
          _id,
          question,
          answer,
          displayOrder
        }
      }
    }`;

    const faqResult = await client.fetch(faqFallbackQuery, { subject: targetSubject, cloneId });

    let finalFaqSource = 'none';
    let finalFaq = null;

    if (faqResult.cloneSpecific) {
      finalFaqSource = 'cloneSpecific';
      finalFaq = faqResult.cloneSpecific;
      log('green', '✅ CLONE-SPECIFIC FAQ found 👉 THIS WILL BE USED');
      log('cyan', `   Title: ${finalFaq.title}`);
      log('cyan', `   FAQ Count: ${finalFaq.faqReferences?.length || 0} questions`);
      log('cyan', `   Clone: ${finalFaq.cloneReference?.cloneName}`);
    } else {
      log('green', '✅ No clone-specific FAQ section found');
    }

    if (faqResult.baseline) {
      const willUse = finalFaqSource === 'none' ? ' 👉 THIS WILL BE USED' : '';
      log('yellow', `⚠️ BASELINE FAQ found${willUse}`);
      log('cyan', `   Title: ${faqResult.baseline.title}`);
      log('cyan', `   FAQ Count: ${faqResult.baseline.faqReferences?.length || 0} questions`);
      log('cyan', `   Clone: ${faqResult.baseline.cloneReference?.cloneName}`);
      if (finalFaqSource === 'none') {
        finalFaqSource = 'baseline';
        finalFaq = faqResult.baseline;
      }
    } else {
      log('green', '✅ No baseline FAQ section found');
    }

    if (faqResult.default) {
      const willUse = finalFaqSource === 'none' ? ' 👉 THIS WILL BE USED' : '';
      log('blue', `📋 DEFAULT FAQ found${willUse}`);
      log('cyan', `   Title: ${faqResult.default.title}`);
      log('cyan', `   FAQ Count: ${faqResult.default.faqReferences?.length || 0} questions`);
      if (finalFaqSource === 'none') {
        finalFaqSource = 'default';
        finalFaq = faqResult.default;
      }
    } else {
      log('green', '✅ No default FAQ section found');
    }

    // STEP 3: Check all FAQ sections for this subject
    section('STEP 3: All FAQ Sections for This Subject');
    
    const allFaqsQuery = `*[_type == "faq_section" && pageType == "subject" && subjectSlug == $subject] {
      _id,
      title,
      isActive,
      cloneReference-> {
        cloneId,
        cloneName,
        isActive
      },
      faqReferences[]-> {
        _id,
        question,
        answer
      }
    } | order(cloneReference->cloneName asc)`;

    const allFaqs = await client.fetch(allFaqsQuery, { subject: targetSubject });
    
    log('cyan', `📄 Found ${allFaqs.length} FAQ section(s) for "${targetSubject}":`);
    
    allFaqs.forEach((faq, i) => {
      const faqStatus = faq.isActive ? '✅' : '❌';
      const cloneInfo = faq.cloneReference ? 
        `→ ${faq.cloneReference.cloneName} (${faq.cloneReference.cloneId?.current})` : 
        '→ Default';
      const cloneStatus = faq.cloneReference?.isActive ? '✅' : '❌';
      
      log('cyan', `   ${i + 1}. ${faqStatus} "${faq.title}" ${cloneInfo}`);
      if (faq.cloneReference) {
        log('cyan', `      Clone Status: ${cloneStatus} ${faq.cloneReference.isActive ? 'Active' : 'Inactive'}`);
      }
      log('cyan', `      FAQ Count: ${faq.faqReferences?.length || 0} questions`);
    });

    // STEP 4: Final Summary
    section('STEP 4: What The App Will Actually Show');
    
    if (finalFaq) {
      log('red', `🚨 FAQ WILL BE DISPLAYED from ${finalFaqSource.toUpperCase()} source`);
      log('cyan', `   Title: ${finalFaq.title}`);
      log('cyan', `   Questions: ${finalFaq.faqReferences?.length || 0}`);
      
      if (finalFaq.faqReferences && finalFaq.faqReferences.length > 0) {
        log('cyan', '   First question:');
        log('cyan', `     "${finalFaq.faqReferences[0].question}"`);
      }
    } else {
      log('green', '✅ NO FAQ will be displayed (as expected)');
    }

    // STEP 5: Recommendations
    section('STEP 5: How to Fix');
    
    if (finalFaq && finalFaqSource !== 'none') {
      log('yellow', '🔧 To remove the FAQ section completely:');
      
      if (finalFaqSource === 'cloneSpecific') {
        log('cyan', `1. Go to Sanity Studio → FAQ Sections`);
        log('cyan', `2. Find: "${finalFaq.title}" (Qatar clone)`);
        log('cyan', `3. Either DELETE it or set isActive = false`);
      } else if (finalFaqSource === 'baseline') {
        log('cyan', `1. The FAQ is coming from BASELINE clone`);
        log('cyan', `2. Create a Qatar-specific FAQ section with isActive = false`);
        log('cyan', `3. Or delete/deactivate the baseline FAQ section`);
      } else if (finalFaqSource === 'default') {
        log('cyan', `1. The FAQ is coming from DEFAULT content`);
        log('cyan', `2. Create a Qatar-specific FAQ section with isActive = false`);
        log('cyan', `3. Or delete/deactivate the default FAQ section`);
      }
      
      log('yellow', '\n💡 Alternative: Create an empty Qatar FAQ section');
      log('cyan', '   - This will override the fallback and show no FAQs');
    }

  } catch (error) {
    log('red', '💥 Error during FAQ debugging:');
    console.error(error);
  }
}

async function main() {
  await debugFaqSection();
}

main().catch(console.error);