#!/usr/bin/env node

/**
 * Subject Page Resolution Test
 * 
 * Tests the exact same query logic used by the app to resolve subject page content
 * Run with: node test-subject-resolution.js [subject] [cloneId]
 */

import { createClient } from '@sanity/client';

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

async function testSubjectResolution() {
  const [,, subject = 'maths', cloneId] = process.argv;
  
  log('bold', `🧪 Testing Subject Page Resolution for: ${subject}`);
  if (cloneId) {
    log('cyan', `📌 Clone ID: ${cloneId}`);
  } else {
    log('yellow', '⚠️ No clone ID provided - will test fallback behavior');
  }
  
  console.log('\n' + '='.repeat(60));

  try {
    // This is the EXACT query used in the app
    const query = `{
      "cloneSpecific": {
        "subjectPage": *[_type == "subjectPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0]{
          _id,
          subject,
          title,
          firstSection,
          tutorsListSectionHead,
          testimonials[]->{
            _id,
            reviewerName,
            reviewerType,
            testimonialText,
            rating,
            order
          },
          faqSection,
          seo,
          isActive,
          cloneReference-> {
            _id,
            cloneId,
            cloneName,
            isActive,
            baselineClone
          },
          "sourceInfo": {
            "source": "cloneSpecific",
            "cloneId": $cloneId
          }
        },
        "tutors": *[_type == "tutor" && references(*[_type == "subjectPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0]._id)] | order(displayOrder asc) {
          _id,
          name,
          professionalTitle,
          displayOnSubjectPages,
          displayOrder
        }
      },
      "baseline": {
        "subjectPage": *[_type == "subjectPage" && slug.current == $subject && cloneReference->baselineClone == true && isActive == true][0]{
          _id,
          subject,
          title,
          firstSection,
          tutorsListSectionHead,
          testimonials[]->{
            _id,
            reviewerName,
            reviewerType,
            testimonialText,
            rating,
            order
          },
          faqSection,
          seo,
          isActive,
          cloneReference-> {
            _id,
            cloneId,
            cloneName,
            isActive,
            baselineClone
          },
          "sourceInfo": {
            "source": "baseline",
            "cloneId": cloneReference->cloneId.current
          }
        },
        "tutors": *[_type == "tutor" && references(*[_type == "subjectPage" && slug.current == $subject && cloneReference->baselineClone == true && isActive == true][0]._id)] | order(displayOrder asc) {
          _id,
          name,
          professionalTitle,
          displayOnSubjectPages,
          displayOrder
        }
      },
      "default": {
        "subjectPage": *[_type == "subjectPage" && slug.current == $subject && !defined(cloneReference) && isActive == true][0]{
          _id,
          subject,
          title,
          firstSection,
          tutorsListSectionHead,
          testimonials[]->{
            _id,
            reviewerName,
            reviewerType,
            testimonialText,
            rating,
            order
          },
          faqSection,
          seo,
          isActive,
          "sourceInfo": {
            "source": "default",
            "cloneId": null
          }
        },
        "tutors": *[_type == "tutor" && references(*[_type == "subjectPage" && slug.current == $subject && !defined(cloneReference) && isActive == true][0]._id)] | order(displayOrder asc) {
          _id,
          name,
          professionalTitle,
          displayOnSubjectPages,
          displayOrder
        }
      }
    }`;

    console.log('📋 Executing query...\n');
    
    const result = await client.fetch(query, { 
      subject, 
      cloneId: cloneId || 'none' 
    });

    // Analyze results exactly like the app does
    let resolvedData = null;
    let resolvedSource = 'none';
    
    if (result.cloneSpecific?.subjectPage) {
      resolvedData = result.cloneSpecific;
      resolvedSource = 'cloneSpecific';
      log('green', '✅ CLONE-SPECIFIC content will be used');
    } else if (result.baseline?.subjectPage) {
      resolvedData = result.baseline;
      resolvedSource = 'baseline';
      log('yellow', '⚠️ BASELINE content will be used');
    } else if (result.default?.subjectPage) {
      resolvedData = result.default;
      resolvedSource = 'default';
      log('blue', '📋 DEFAULT content will be used');
    } else {
      log('red', '❌ NO CONTENT FOUND!');
    }

    console.log('\n📊 Detailed Results:');
    console.log('==================');

    // Clone-specific analysis
    if (result.cloneSpecific?.subjectPage) {
      log('green', '\n✅ CLONE-SPECIFIC (Tier 1):');
      const page = result.cloneSpecific.subjectPage;
      console.log(`   Title: ${page.title}`);
      console.log(`   Active: ${page.isActive}`);
      console.log(`   Clone: ${page.cloneReference?.cloneName} (${page.cloneReference?.cloneId?.current})`);
      console.log(`   Clone Active: ${page.cloneReference?.isActive}`);
      console.log(`   Tutors: ${result.cloneSpecific.tutors?.length || 0}`);
      
      if (resolvedSource === 'cloneSpecific') {
        log('green', '   👉 THIS WILL BE USED');
      }
    } else {
      log('red', '\n❌ CLONE-SPECIFIC (Tier 1): Not found');
      
      if (cloneId) {
        // Check why it's missing
        log('yellow', '   🔍 Investigating...');
        
        const debugQuery = `*[_type == "subjectPage" && slug.current == $subject] {
          _id,
          title,
          isActive,
          cloneReference-> {
            _id,
            cloneId,
            cloneName,
            isActive,
            baselineClone
          }
        }`;
        
        const allPages = await client.fetch(debugQuery, { subject });
        
        if (allPages.length === 0) {
          log('red', '   ❌ No subject pages exist for this subject!');
        } else {
          log('cyan', `   📄 Found ${allPages.length} subject page(s):`);
          allPages.forEach((page, i) => {
            console.log(`     ${i + 1}. "${page.title}"`);
            console.log(`        Page Active: ${page.isActive}`);
            console.log(`        Clone: ${page.cloneReference?.cloneName || 'None'} (${page.cloneReference?.cloneId?.current || 'None'})`);
            console.log(`        Clone Active: ${page.cloneReference?.isActive || 'N/A'}`);
            
            if (page.cloneReference?.cloneId?.current === cloneId) {
              if (!page.isActive) {
                log('red', '        ❌ PAGE IS INACTIVE!');
              } else if (!page.cloneReference?.isActive) {
                log('red', '        ❌ CLONE IS INACTIVE!');
              } else {
                log('yellow', '        ⚠️ Should work but query failed - check query logic');
              }
            }
          });
        }
      }
    }

    // Baseline analysis
    if (result.baseline?.subjectPage) {
      log('yellow', '\n⚠️ BASELINE (Tier 2):');
      const page = result.baseline.subjectPage;
      console.log(`   Title: ${page.title}`);
      console.log(`   Active: ${page.isActive}`);
      console.log(`   Clone: ${page.cloneReference?.cloneName} (${page.cloneReference?.cloneId?.current})`);
      console.log(`   Clone Active: ${page.cloneReference?.isActive}`);
      console.log(`   Tutors: ${result.baseline.tutors?.length || 0}`);
      
      if (resolvedSource === 'baseline') {
        log('yellow', '   👉 THIS WILL BE USED (fallback)');
      }
    } else {
      log('red', '\n❌ BASELINE (Tier 2): Not found');
    }

    // Default analysis
    if (result.default?.subjectPage) {
      log('blue', '\n📋 DEFAULT (Tier 3):');
      const page = result.default.subjectPage;
      console.log(`   Title: ${page.title}`);
      console.log(`   Active: ${page.isActive}`);
      console.log(`   Clone: None (default)`);
      console.log(`   Tutors: ${result.default.tutors?.length || 0}`);
      
      if (resolvedSource === 'default') {
        log('blue', '   👉 THIS WILL BE USED (last resort)');
      }
    } else {
      log('red', '\n❌ DEFAULT (Tier 3): Not found');
    }

    // Summary and recommendations
    console.log('\n' + '='.repeat(60));
    log('bold', '📋 SUMMARY');
    console.log('='.repeat(60));
    
    console.log(`Final result: Using ${resolvedSource.toUpperCase()} content`);
    
    if (resolvedSource === 'cloneSpecific') {
      log('green', '🎉 Perfect! Clone-specific content is working correctly.');
    } else {
      log('yellow', '⚠️ Falling back to ' + resolvedSource + ' content.');
      
      console.log('\n💡 To fix this:');
      if (!cloneId) {
        console.log('1. Provide a clone ID to test clone-specific content');
      } else {
        console.log('1. Create a subject page in Sanity Studio');
        console.log('2. Set the slug to: ' + subject);
        console.log('3. Set cloneReference to your clone');
        console.log('4. Make sure both page and clone are active');
      }
    }

    if (resolvedSource === 'none') {
      log('red', '🚨 CRITICAL: No content available! Create default content.');
    }

  } catch (error) {
    log('red', '💥 Query failed:');
    console.error(error);
  }
}

testSubjectResolution();