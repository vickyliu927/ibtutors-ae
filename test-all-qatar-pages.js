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

async function testPageResolution(pageSlug, cloneId) {
  try {
    // Test both subject and curriculum page resolution
    const subjectQuery = `{
      "cloneSpecific": *[_type == "subjectPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0],
      "baseline": *[_type == "subjectPage" && slug.current == $subject && cloneReference->baselineClone == true && isActive == true][0],
      "default": *[_type == "subjectPage" && slug.current == $subject && !defined(cloneReference) && isActive == true][0]
    }`;

    const curriculumQuery = `{
      "cloneSpecific": *[_type == "curriculumPage" && slug.current == $subject && cloneReference->cloneId.current == $cloneId && isActive == true][0],
      "baseline": *[_type == "curriculumPage" && slug.current == $subject && cloneReference->baselineClone == true && isActive == true][0],
      "default": *[_type == "curriculumPage" && slug.current == $subject && !defined(cloneReference) && isActive == true][0]
    }`;

    const [subjectResult, curriculumResult] = await Promise.all([
      client.fetch(subjectQuery, { subject: pageSlug, cloneId }),
      client.fetch(curriculumQuery, { subject: pageSlug, cloneId })
    ]);

    // Determine what will be used (curriculum takes precedence)
    let result = {
      pageType: 'none',
      source: 'none',
      title: 'Not found'
    };

    if (curriculumResult.cloneSpecific) {
      result = { pageType: 'curriculum', source: 'clone-specific', title: curriculumResult.cloneSpecific.title };
    } else if (curriculumResult.baseline) {
      result = { pageType: 'curriculum', source: 'baseline', title: curriculumResult.baseline.title };
    } else if (curriculumResult.default) {
      result = { pageType: 'curriculum', source: 'default', title: curriculumResult.default.title };
    } else if (subjectResult.cloneSpecific) {
      result = { pageType: 'subject', source: 'clone-specific', title: subjectResult.cloneSpecific.title };
    } else if (subjectResult.baseline) {
      result = { pageType: 'subject', source: 'baseline', title: subjectResult.baseline.title };
    } else if (subjectResult.default) {
      result = { pageType: 'subject', source: 'default', title: subjectResult.default.title };
    }

    return result;
  } catch (error) {
    return { pageType: 'error', source: 'error', title: error.message };
  }
}

async function testAllQatarPages() {
  console.log('🇶🇦 COMPREHENSIVE QATAR PAGES TEST');
  console.log('=================================\n');

  try {
    // Get all unique page slugs that should work with Qatar
    const allSlugs = await client.fetch(`{
      "subjectSlugs": *[_type == "subjectPage"].slug.current,
      "curriculumSlugs": *[_type == "curriculumPage"].slug.current
    }`);

    const uniqueSlugs = [...new Set([...allSlugs.subjectSlugs, ...allSlugs.curriculumSlugs])].sort();
    
    log('blue', `🔍 Testing ${uniqueSlugs.length} unique page slugs for onlinetutors.qa:`);
    console.log('');

    const results = {
      cloneSpecific: [],
      fallback: [],
      notFound: [],
      error: []
    };

    for (const slug of uniqueSlugs) {
      const result = await testPageResolution(slug, 'qatar-tutors');
      
      let status = '';
      let color = 'red';
      
      if (result.source === 'clone-specific') {
        status = '✅ CLONE-SPECIFIC';
        color = 'green';
        results.cloneSpecific.push({ slug, ...result });
      } else if (result.source === 'baseline' || result.source === 'default') {
        status = `⚠️ FALLBACK (${result.source.toUpperCase()})`;
        color = 'yellow';
        results.fallback.push({ slug, ...result });
      } else if (result.source === 'error') {
        status = '💥 ERROR';
        color = 'red';
        results.error.push({ slug, ...result });
      } else {
        status = '❌ NOT FOUND';
        color = 'red';
        results.notFound.push({ slug, ...result });
      }

      const pageTypeIcon = result.pageType === 'curriculum' ? '🎓' : 
                           result.pageType === 'subject' ? '📚' : '❓';
      
      log(color, `${status} ${pageTypeIcon} /${slug}`);
      log('cyan', `   Title: ${result.title}`);
      
      // Add small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Summary Report
    console.log('\n' + '='.repeat(60));
    log('bold', '📊 SUMMARY REPORT');
    console.log('='.repeat(60));

    log('green', `✅ WORKING CORRECTLY (Clone-specific): ${results.cloneSpecific.length} pages`);
    results.cloneSpecific.forEach(item => {
      const icon = item.pageType === 'curriculum' ? '🎓' : '📚';
      log('cyan', `   ${icon} /${item.slug} - "${item.title}"`);
    });

    if (results.fallback.length > 0) {
      log('yellow', `\n⚠️ FALLING BACK (Not clone-specific): ${results.fallback.length} pages`);
      results.fallback.forEach(item => {
        const icon = item.pageType === 'curriculum' ? '🎓' : '📚';
        log('cyan', `   ${icon} /${item.slug} - "${item.title}" (${item.source})`);
      });
    }

    if (results.notFound.length > 0) {
      log('red', `\n❌ NOT FOUND: ${results.notFound.length} pages`);
      results.notFound.forEach(item => {
        log('cyan', `   ❓ /${item.slug}`);
      });
    }

    if (results.error.length > 0) {
      log('red', `\n💥 ERRORS: ${results.error.length} pages`);
      results.error.forEach(item => {
        log('cyan', `   ❓ /${item.slug} - ${item.title}`);
      });
    }

    // Final Score
    const totalPages = uniqueSlugs.length;
    const workingPages = results.cloneSpecific.length;
    const score = Math.round((workingPages / totalPages) * 100);

    console.log('\n' + '='.repeat(60));
    log('bold', `🎯 QATAR CLONE SCORE: ${score}% (${workingPages}/${totalPages} pages working correctly)`);
    console.log('='.repeat(60));

    if (score >= 90) {
      log('green', '🎉 EXCELLENT: Qatar clone is working very well!');
    } else if (score >= 70) {
      log('yellow', '👍 GOOD: Most Qatar pages are working, some fallbacks needed');
    } else {
      log('red', '⚠️ NEEDS ATTENTION: Many pages are falling back or missing');
    }

    // Recommendations
    if (results.fallback.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      log('yellow', 'To improve Qatar clone coverage:');
      results.fallback.forEach(item => {
        log('cyan', `   • Create Qatar-specific version of /${item.slug}`);
      });
    }

  } catch (error) {
    log('red', '💥 Error during testing:');
    console.error(error);
  }
}

testAllQatarPages();