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

async function debugActualFaqQueries() {
  const cloneId = 'qatar-tutors';
  const subjectSlug = 'maths';
  
  console.log('🔍 Testing ACTUAL FAQ Queries Used by App');
  console.log('==========================================');
  console.log(`🎯 Clone: ${cloneId}, Subject: ${subjectSlug}\n`);

  try {
    // TEST 1: The getFAQData query (used by FAQ component)
    section('TEST 1: getFAQData Query (Used by FAQ Component)');
    
    const pageType = 'subject';
    let pageTypeFilter = 'pageType == $pageType';
    pageTypeFilter += ' && subjectPage->slug.current == $subjectSlug';
    
    // This is the EXACT query from getFAQData function
    const getFaqDataQuery = `
      *[_type == "faq_section" && ${pageTypeFilter} && (
        cloneReference._ref == $cloneId || 
        !defined(cloneReference)
      )] | order(defined(cloneReference) desc)[0] {
        title,
        subtitle,
        "faqs": faqReferences[]-> {
          _id,
          question,
          answer,
          displayOrder
        }
      }
    `;
    
    const getFaqResult = await client.fetch(getFaqDataQuery, {
      pageType,
      subjectSlug,
      cloneId: `drafts.${cloneId}` // Sanity references are stored as drafts.clone-id
    });
    
    if (getFaqResult) {
      log('red', '🚨 getFAQData() WILL RETURN FAQ CONTENT!');
      log('cyan', `   Title: ${getFaqResult.title}`);
      log('cyan', `   FAQ Count: ${getFaqResult.faqs?.length || 0}`);
      if (getFaqResult.faqs && getFaqResult.faqs.length > 0) {
        log('cyan', `   First FAQ: "${getFaqResult.faqs[0].question}"`);
      }
    } else {
      log('green', '✅ getFAQData() returns no FAQ content');
    }

    // TEST 2: The subjectPageFaqQueries query (used by subject page)
    section('TEST 2: subjectPageFaqQueries Query (Used by Subject Page)');
    
    // Test global query first (this might be the culprit)
    const globalSubjectSpecificQuery = `
      *[_type == "faq_section" && pageType == "subject" && subjectPage->slug.current == "${subjectSlug}" && !defined(cloneReference)][0] {
        _id,
        title,
        subtitle,
        pageType,
        subjectPage-> {
          _id,
          title,
          subject,
          slug
        },
        faqReferences[]-> {
          _id,
          question,
          answer,
          displayOrder
        } | order(displayOrder asc)
      }
    `;
    
    const globalResult = await client.fetch(globalSubjectSpecificQuery);
    
    if (globalResult) {
      log('red', '🚨 FOUND DEFAULT FAQ SECTION for subject!');
      log('cyan', `   Title: ${globalResult.title}`);
      log('cyan', `   FAQ Count: ${globalResult.faqReferences?.length || 0}`);
      log('cyan', `   This is likely what's being displayed!`);
    } else {
      log('green', '✅ No default FAQ section found for subject');
    }

    // TEST 3: Check all FAQ sections that might match
    section('TEST 3: All FAQ Sections That Could Match');
    
    const allMatchingFaqsQuery = `*[_type == "faq_section" && (
      (pageType == "subject" && subjectPage->slug.current == "${subjectSlug}") ||
      (pageType == "subject" && !defined(subjectPage))
    )] {
      _id,
      title,
      pageType,
      isActive,
      subjectPage-> {
        slug,
        title
      },
      cloneReference-> {
        cloneId,
        cloneName
      },
      faqReferences[]-> {
        _id,
        question,
        answer
      }
    } | order(cloneReference->cloneName asc)`;
    
    const allMatchingFaqs = await client.fetch(allMatchingFaqsQuery);
    
    log('cyan', `📄 Found ${allMatchingFaqs.length} FAQ section(s) that could match:`);
    
    allMatchingFaqs.forEach((faq, i) => {
      const status = faq.isActive ? '✅' : '❌';
      const clone = faq.cloneReference ? 
        `${faq.cloneReference.cloneName} (${faq.cloneReference.cloneId?.current})` : 
        'DEFAULT/GLOBAL';
      const subject = faq.subjectPage ? faq.subjectPage.slug?.current : 'GENERAL';
      
      log('cyan', `   ${i + 1}. ${status} "${faq.title}"`);
      log('cyan', `      Clone: ${clone}`);
      log('cyan', `      Subject: ${subject}`);
      log('cyan', `      FAQs: ${faq.faqReferences?.length || 0} questions`);
      
      if (faq.faqReferences && faq.faqReferences.length > 0) {
        log('cyan', `      First: "${faq.faqReferences[0].question}"`);
      }
    });

    // TEST 4: Show which one will actually be used
    section('TEST 4: Resolution Priority (What App Will Use)');
    
    const potentialSources = allMatchingFaqs.filter(faq => faq.isActive);
    
    if (potentialSources.length === 0) {
      log('green', '✅ No active FAQ sources found - should show no FAQ');
    } else {
      // The getFAQData query orders by "defined(cloneReference) desc" 
      // This means clone-specific comes first, then default
      const cloneSpecific = potentialSources.find(faq => 
        faq.cloneReference?.cloneId?.current === cloneId &&
        faq.subjectPage?.slug?.current === subjectSlug
      );
      
      const defaultSubjectSpecific = potentialSources.find(faq => 
        !faq.cloneReference &&
        faq.subjectPage?.slug?.current === subjectSlug
      );
      
      const defaultGeneral = potentialSources.find(faq => 
        !faq.cloneReference &&
        !faq.subjectPage
      );
      
      if (cloneSpecific) {
        log('green', '✅ Clone-specific FAQ will be used');
        log('cyan', `   "${cloneSpecific.title}"`);
      } else if (defaultSubjectSpecific) {
        log('red', '🚨 DEFAULT subject-specific FAQ will be used!');
        log('cyan', `   "${defaultSubjectSpecific.title}"`);
        log('yellow', '   👆 THIS IS LIKELY THE ISSUE!');
      } else if (defaultGeneral) {
        log('yellow', '⚠️ Default general FAQ will be used');
        log('cyan', `   "${defaultGeneral.title}"`);
      }
    }

    // SOLUTION
    section('SOLUTION: How to Fix This');
    
    const problemFaq = allMatchingFaqs.find(faq => 
      faq.isActive && 
      !faq.cloneReference && 
      faq.subjectPage?.slug?.current === subjectSlug
    );
    
    if (problemFaq) {
      log('yellow', '🔧 To remove FAQ completely:');
      log('cyan', `1. Go to Sanity Studio → FAQ Sections`);
      log('cyan', `2. Find: "${problemFaq.title}"`);
      log('cyan', `3. Either DELETE it or set isActive = false`);
      log('cyan', `4. Wait 10+ minutes for cache to clear, or redeploy`);
      
      log('yellow', '\n🔧 Alternative: Create Qatar-specific empty FAQ:');
      log('cyan', `1. Create new FAQ Section in Sanity`);
      log('cyan', `2. Set pageType = "subject"`);
      log('cyan', `3. Set subjectPage = "Online Qatar Maths Tutor"`);
      log('cyan', `4. Set cloneReference = "Qatar Tutors"`);
      log('cyan', `5. Leave faqReferences empty`);
      log('cyan', `6. Set isActive = true`);
      log('cyan', `7. This will override the default FAQ with empty content`);
    } else {
      log('green', '✅ No problematic FAQ sections found');
      log('yellow', '💾 This might just be a caching issue');
      log('cyan', '   Try hard refresh or wait 10+ minutes for server cache to clear');
    }

  } catch (error) {
    log('red', '💥 Error during testing:');
    console.error(error);
  }
}

debugActualFaqQueries();