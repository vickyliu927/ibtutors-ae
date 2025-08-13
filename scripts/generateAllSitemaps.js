import { createClient } from '@sanity/client'
import fs from 'fs/promises'
import path from 'path'

const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  apiVersion: '2024-03-20',
  useCdn: false
})

// Helper to join base URL and path without double slashes
function joinUrl(base, path) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

// Get all domain-to-clone mappings
async function getAllDomainMappings() {
  const clones = await client.fetch(`
    *[_type == "clone" && isActive == true] {
      cloneId,
      cloneName,
      "metadata": metadata,
      isActive
    }
  `);

  const mappings = [];
  
  clones.forEach(clone => {
    if (clone.metadata?.domains) {
      clone.metadata.domains.forEach(domain => {
        mappings.push({
          domain: domain.toLowerCase(),
          cloneId: clone.cloneId.current,
          cloneName: clone.cloneName
        });
      });
    }
  });

  return mappings;
}

// Get pages for a specific clone
async function getPagesForClone(cloneId) {
  let subjectQuery;
  let curriculumQuery;

  if (cloneId) {
    // Get clone-specific or global pages
    subjectQuery = `*[_type == "subjectPage" && (
      cloneReference->cloneId.current == $cloneId || 
      !defined(cloneReference)
    )] { slug, _updatedAt, cloneReference }`;
    
    curriculumQuery = `*[_type == "curriculumPage" && (
      cloneReference->cloneId.current == $cloneId || 
      !defined(cloneReference)
    )] { slug, _updatedAt, cloneReference }`;
  } else {
    // Get only global pages (no clone reference)
    subjectQuery = `*[_type == "subjectPage" && !defined(cloneReference)] { slug, _updatedAt }`;
    curriculumQuery = `*[_type == "curriculumPage" && !defined(cloneReference)] { slug, _updatedAt }`;
  }

  const [subjectPages, curriculumPages] = await Promise.all([
    client.fetch(subjectQuery, { cloneId }),
    client.fetch(curriculumQuery, { cloneId })
  ]);

  return {
    subjectPages: subjectPages || [],
    curriculumPages: curriculumPages || []
  };
}

// Generate XML sitemap content
function generateSitemapXML(urls) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  urls.forEach(url => {
    xml += `
  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}

// Generate sitemap for a specific domain
async function generateSitemapForDomain(domain) {
  console.log(`\n🌐 Processing domain: ${domain}`);
  
  // Determine protocol (assume https for production domains)
  const protocol = domain.includes('localhost') || domain.includes('127.0.0.1') ? 'http' : 'https';
  const baseUrl = `${protocol}://${domain}`;
  
  // Get clone ID for this domain
  const mappings = await getAllDomainMappings();
  const mapping = mappings.find(m => 
    m.domain === domain.toLowerCase() || 
    m.domain === `www.${domain.toLowerCase()}`
  );
  
  const cloneId = mapping?.cloneId || null;
  console.log(`   Clone: ${cloneId || 'global'} (${mapping?.cloneName || 'Default'})`);
  
  // Get pages for this clone
  const { subjectPages, curriculumPages } = await getPagesForClone(cloneId);
  
  // Get current timestamp for homepage
  const currentTimestamp = new Date().toISOString();
  
  // Static routes
  const urls = [
    {
      url: baseUrl,
      lastModified: currentTimestamp,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Add subject pages
  subjectPages.forEach(page => {
    urls.push({
      url: joinUrl(baseUrl, page.slug.current),
      lastModified: page._updatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  // Add curriculum pages
  curriculumPages.forEach(page => {
    urls.push({
      url: joinUrl(baseUrl, `curriculum/${page.slug.current}`),
      lastModified: page._updatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  console.log(`   Pages: ${urls.length} total (${subjectPages.length} subjects, ${curriculumPages.length} curriculum)`);
  
  return urls;
}

// Main function
async function generateAllSitemaps() {
  try {
    console.log('🚀 Starting sitemap generation for all domains...\n');
    
    const mappings = await getAllDomainMappings();
    console.log(`Found ${mappings.length} domain mappings across ${new Set(mappings.map(m => m.cloneId)).size} clones\n`);
    
    // Create output directory
    const outputDir = path.join(process.cwd(), 'generated-sitemaps');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate sitemap for each domain
    const results = [];
    
    for (const mapping of mappings) {
      try {
        const urls = await generateSitemapForDomain(mapping.domain);
        const xmlContent = generateSitemapXML(urls);
        
        // Save to file
        const filename = `sitemap-${mapping.domain.replace(/[^a-zA-Z0-9.-]/g, '_')}.xml`;
        const filepath = path.join(outputDir, filename);
        await fs.writeFile(filepath, xmlContent, 'utf8');
        
        results.push({
          domain: mapping.domain,
          cloneId: mapping.cloneId,
          cloneName: mapping.cloneName,
          urlCount: urls.length,
          filename,
          success: true
        });
        
        console.log(`   ✅ Saved: ${filename}`);
        
      } catch (error) {
        console.error(`   ❌ Error generating sitemap for ${mapping.domain}:`, error.message);
        results.push({
          domain: mapping.domain,
          cloneId: mapping.cloneId,
          cloneName: mapping.cloneName,
          error: error.message,
          success: false
        });
      }
    }
    
    // Generate summary report
    const summary = {
      timestamp: new Date().toISOString(),
      totalDomains: mappings.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
    
    const summaryPath = path.join(outputDir, 'sitemap-generation-report.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total domains: ${summary.totalDomains}`);
    console.log(`   Successful: ${summary.successful}`);
    console.log(`   Failed: ${summary.failed}`);
    console.log(`   Output directory: ${outputDir}`);
    console.log(`   Report saved: ${summaryPath}`);
    
    if (summary.failed > 0) {
      console.log(`\n❌ Failed domains:`);
      results.filter(r => !r.success).forEach(r => {
        console.log(`   - ${r.domain}: ${r.error}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
generateAllSitemaps();
