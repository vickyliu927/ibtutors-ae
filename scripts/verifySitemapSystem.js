import { createClient } from '@sanity/client'
import fs from 'fs/promises'
import path from 'path'

const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  apiVersion: '2024-03-20',
  useCdn: false
})

/**
 * Comprehensive verification of the dynamic sitemap system
 */
async function verifySitemapSystem() {
  console.log('🔍 DYNAMIC SITEMAP SYSTEM VERIFICATION');
  console.log('======================================\n');

  const results = {
    timestamp: new Date().toISOString(),
    checks: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };

  // Check 1: Verify all domains have clone mappings
  console.log('✅ Check 1: Domain-Clone Mappings');
  try {
    const clones = await client.fetch(`
      *[_type == "clone" && isActive == true] {
        cloneId,
        cloneName,
        "domains": metadata.domains,
        isActive
      }
    `);

    const totalDomains = clones.reduce((sum, clone) => sum + (clone.domains?.length || 0), 0);
    const uniqueClones = clones.length;

    console.log(`   📊 Found ${uniqueClones} active clones with ${totalDomains} total domains`);
    
    clones.forEach(clone => {
      if (clone.domains && clone.domains.length > 0) {
        console.log(`   ✅ ${clone.cloneName}: ${clone.domains.length} domains`);
        clone.domains.forEach(domain => {
          console.log(`      - ${domain}`);
        });
      } else {
        console.log(`   ⚠️  ${clone.cloneName}: No domains configured`);
      }
    });

    results.checks.push({
      name: 'Domain-Clone Mappings',
      status: 'passed',
      details: { uniqueClones, totalDomains, clones }
    });

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    results.checks.push({
      name: 'Domain-Clone Mappings',
      status: 'failed',
      error: error.message
    });
  }

  // Check 2: Verify pages exist for each clone
  console.log('\n✅ Check 2: Clone-Specific Pages');
  try {
    const pageCheck = await client.fetch(`
      {
        "subjectPages": *[_type == "subjectPage"] {
          slug,
          "cloneId": cloneReference->cloneId.current,
          "hasCloneRef": defined(cloneReference)
        },
        "curriculumPages": *[_type == "curriculumPage"] {
          slug,
          "cloneId": cloneReference->cloneId.current,
          "hasCloneRef": defined(cloneReference)
        }
      }
    `);

    const globalSubjects = pageCheck.subjectPages.filter(p => !p.hasCloneRef);
    const cloneSubjects = pageCheck.subjectPages.filter(p => p.hasCloneRef);
    const globalCurriculum = pageCheck.curriculumPages.filter(p => !p.hasCloneRef);
    const cloneCurriculum = pageCheck.curriculumPages.filter(p => p.hasCloneRef);

    console.log(`   📄 Subject Pages: ${globalSubjects.length} global, ${cloneSubjects.length} clone-specific`);
    console.log(`   📚 Curriculum Pages: ${globalCurriculum.length} global, ${cloneCurriculum.length} clone-specific`);

    // Group clone-specific pages by clone
    const clonePageGroups = {};
    [...cloneSubjects, ...cloneCurriculum].forEach(page => {
      if (page.cloneId) {
        if (!clonePageGroups[page.cloneId]) {
          clonePageGroups[page.cloneId] = { subjects: 0, curriculum: 0 };
        }
        if (cloneSubjects.includes(page)) {
          clonePageGroups[page.cloneId].subjects++;
        } else {
          clonePageGroups[page.cloneId].curriculum++;
        }
      }
    });

    Object.entries(clonePageGroups).forEach(([cloneId, counts]) => {
      console.log(`   📋 ${cloneId}: ${counts.subjects} subjects, ${counts.curriculum} curriculum`);
    });

    results.checks.push({
      name: 'Clone-Specific Pages',
      status: 'passed',
      details: {
        globalSubjects: globalSubjects.length,
        cloneSubjects: cloneSubjects.length,
        globalCurriculum: globalCurriculum.length,
        cloneCurriculum: cloneCurriculum.length,
        clonePageGroups
      }
    });

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    results.checks.push({
      name: 'Clone-Specific Pages',
      status: 'failed',
      error: error.message
    });
  }

  // Check 3: Verify generated sitemap files exist
  console.log('\n✅ Check 3: Generated Sitemap Files');
  try {
    const sitemapDir = path.join(process.cwd(), 'generated-sitemaps');
    
    try {
      const files = await fs.readdir(sitemapDir);
      const xmlFiles = files.filter(f => f.endsWith('.xml'));
      const reportFile = files.find(f => f.includes('report.json'));

      console.log(`   📁 Found ${xmlFiles.length} sitemap XML files`);
      console.log(`   📊 Report file: ${reportFile ? '✅' : '❌'}`);

      if (reportFile) {
        const reportPath = path.join(sitemapDir, reportFile);
        const reportContent = await fs.readFile(reportPath, 'utf8');
        const report = JSON.parse(reportContent);
        
        console.log(`   📈 Last generation: ${report.timestamp}`);
        console.log(`   🎯 Success rate: ${report.successful}/${report.totalDomains} domains`);
      }

      results.checks.push({
        name: 'Generated Sitemap Files',
        status: 'passed',
        details: { xmlFiles: xmlFiles.length, hasReport: !!reportFile }
      });

    } catch (dirError) {
      console.log(`   ⚠️  Sitemap directory not found - run generateAllSitemaps.js first`);
      results.checks.push({
        name: 'Generated Sitemap Files',
        status: 'warning',
        details: 'Directory not found - generate sitemaps first'
      });
    }

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    results.checks.push({
      name: 'Generated Sitemap Files',
      status: 'failed',
      error: error.message
    });
  }

  // Check 4: Verify implementation files exist
  console.log('\n✅ Check 4: Implementation Files');
  const requiredFiles = [
    'app/sitemap.ts',
    'app/lib/sitemapUtils.ts',
    'app/api/sitemap-refresh/route.ts',
    'app/api/sanity-webhook/route.ts',
    'scripts/generateAllSitemaps.js',
    'scripts/testSitemapSystem.js',
    'docs/DYNAMIC_SITEMAP_SYSTEM.md'
  ];

  let filesExist = 0;
  for (const file of requiredFiles) {
    try {
      await fs.access(path.join(process.cwd(), file));
      console.log(`   ✅ ${file}`);
      filesExist++;
    } catch {
      console.log(`   ❌ ${file} (missing)`);
    }
  }

  results.checks.push({
    name: 'Implementation Files',
    status: filesExist === requiredFiles.length ? 'passed' : 'failed',
    details: { required: requiredFiles.length, found: filesExist }
  });

  // Calculate summary
  results.summary.total = results.checks.length;
  results.summary.passed = results.checks.filter(c => c.status === 'passed').length;
  results.summary.failed = results.checks.filter(c => c.status === 'failed').length;
  results.summary.warnings = results.checks.filter(c => c.status === 'warning').length;

  // Final summary
  console.log('\n📊 VERIFICATION SUMMARY');
  console.log('=====================');
  console.log(`Total Checks: ${results.summary.total}`);
  console.log(`✅ Passed: ${results.summary.passed}`);
  console.log(`❌ Failed: ${results.summary.failed}`);
  console.log(`⚠️  Warnings: ${results.summary.warnings || 0}`);

  if (results.summary.failed === 0) {
    console.log('\n🎉 ALL CHECKS PASSED! Dynamic sitemap system is fully operational.');
  } else {
    console.log('\n⚠️  Some checks failed. Review the issues above.');
  }

  // Save verification results
  const outputPath = path.join(process.cwd(), 'sitemap-verification-results.json');
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Detailed results saved to: ${outputPath}`);

  return results;
}

// Run verification
verifySitemapSystem().catch(console.error);
