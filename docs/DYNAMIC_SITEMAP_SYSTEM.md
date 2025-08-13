# Dynamic Sitemap System

## Overview

The dynamic sitemap system automatically generates and maintains sitemaps for all website domains connected to clone IDs in Sanity. This system ensures that each domain has a properly formatted sitemap that includes only the relevant pages for that specific clone.

## Key Features

### 🌐 Multi-Domain Support
- **Automatic Domain Detection**: Each domain gets its own customized sitemap
- **Clone-Specific Content**: Pages are filtered based on clone relationships
- **Fallback Handling**: Global pages are included when clone-specific pages don't exist

### 🔄 Automatic Updates  
- **Webhook Integration**: Sitemaps refresh automatically when content changes
- **Cache Invalidation**: Smart cache tags ensure fresh content
- **API Endpoints**: Manual refresh capabilities for testing and maintenance

### 📊 Comprehensive Coverage
- **All Domains**: Currently supports 16 domains across 8 clone websites
- **Page Types**: Includes homepage, subject pages, and curriculum pages
- **Proper XML Format**: Valid sitemap.xml with lastModified, changeFreq, and priority

## Current Domain Coverage

### Active Domains (16 total)
- **Abu Dhabi Tutors**: `adtutors.ae`, `www.adtutors.ae`
- **Germany Tutors**: `online-tutors.de`, `www.online-tutors.de`  
- **Hong Kong Tutors**: `hongkongtutors.hk`, `www.hongkongtutors.hk`
- **Italy Tutors**: `online-tutors.it`, `www.online-tutors.it`
- **Nigeria Tutors**: `online-tutors.ni`, `www.online-tutors.ni`
- **Qatar Tutors**: `onlinetutors.qa`, `www.onlinetutors.qa`
- **Singapore Tutors**: `singapore-tutors.sg`, `www.singapore-tutors.sg`
- **Spain Tutors**: `onlinetutors.es`, `www.onlinetutors.es`

## Architecture

### Core Components

#### 1. Dynamic Sitemap Generator (`app/sitemap.ts`)
```typescript
// Automatically detects current domain and generates appropriate sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap>
```

#### 2. Sitemap Utilities (`app/lib/sitemapUtils.ts`)
```typescript
// Core functions for domain mapping and page retrieval
- getAllDomainMappings()
- getCurrentDomainFromHeaders()
- getPagesForClone()
- generateSitemapForDomain()
```

#### 3. Refresh API (`app/api/sitemap-refresh/route.ts`)
```typescript
// Manual and webhook-triggered sitemap refreshes
POST /api/sitemap-refresh
GET /api/sitemap-refresh (testing)
```

#### 4. Enhanced Webhook (`app/api/sanity-webhook/route.ts`)
```typescript
// Automatic cache invalidation on content changes
- handleSitemapRefresh()
- Smart tag-based cache invalidation
```

### Cache Strategy

#### Cache Tags
- `sitemap-data`: General sitemap content
- `clone-mappings`: Domain-to-clone relationships  
- `subject-pages`: Subject page content
- `curriculum-pages`: Curriculum page content

#### Invalidation Triggers
- **Clone Changes**: New domains or clone modifications
- **Page Changes**: Subject/curriculum page updates
- **Content Changes**: Hero sections, testimonials (light refresh)

## Usage Guide

### For Content Managers

#### Adding a New Domain
1. **Update Clone in Sanity**:
   - Navigate to the clone document in Sanity Studio
   - Add the new domain to the `metadata.domains` array
   - Save the document

2. **Automatic Updates**:
   - Sitemap automatically includes the new domain
   - Webhook triggers cache refresh
   - All pages become available immediately

#### Testing Sitemaps
```bash
# Generate static sitemaps for all domains
node scripts/generateAllSitemaps.js

# Test the dynamic system
node scripts/testSitemapSystem.js

# Manual refresh via API
curl -X POST https://yourdomain.com/api/sitemap-refresh
```

### For Developers

#### Key Files to Modify
- `app/sitemap.ts` - Main sitemap endpoint
- `app/lib/sitemapUtils.ts` - Core utilities
- `app/api/sitemap-refresh/route.ts` - Refresh API
- `app/api/sanity-webhook/route.ts` - Webhook handler

#### Adding New Page Types
1. Update `getPagesForClone()` in `sitemapUtils.ts`
2. Add new cache tags for the page type
3. Update webhook handler to invalidate new tags
4. Test with `testSitemapSystem.js`

#### Cache Configuration
```typescript
// Example cache configuration
{ next: { revalidate: 3600, tags: ['page-type', 'sitemap-data'] } }
```

## Monitoring and Maintenance

### Generated Files
- `generated-sitemaps/` - Static sitemap files for all domains
- `generated-sitemaps/sitemap-generation-report.json` - Generation report

### Log Messages
```
[Sitemap Refresh] Document changed: subjectPage (document-id)
[Sitemap Refresh] Clone document changed - refreshed all sitemap caches
Generated sitemap for domain.com (clone: clone-id) with X pages
```

### Testing URLs
- `https://yourdomain.com/sitemap.xml` - Live sitemap
- `https://yourdomain.com/api/sitemap-refresh` - Refresh API
- Individual page URLs in sitemap for validation

## Performance Considerations

### Caching Strategy
- **1 Hour Cache**: Default sitemap cache duration
- **Tag-Based Invalidation**: Only refreshes when relevant content changes
- **Middleware Optimization**: Domain resolution cached for 10 minutes

### Resource Usage
- **Sanity Queries**: Optimized with proper filtering and caching
- **Memory**: Domain mappings cached in middleware
- **Network**: Minimal API calls due to caching

## Troubleshooting

### Common Issues

#### Sitemap Not Updating
1. Check webhook configuration in Sanity
2. Verify cache tags are being invalidated
3. Test manual refresh via API endpoint

#### Domain Not Found
1. Verify domain is added to clone metadata
2. Check middleware domain resolution
3. Confirm clone is marked as active

#### Missing Pages
1. Check clone reference on pages
2. Verify page publication status  
3. Test with individual domain queries

### Debug Tools
```bash
# Test specific domain
node scripts/testSitemapSystem.js

# Generate static files for comparison
node scripts/generateAllSitemaps.js

# Check domain mappings
node sanity/getAllDomainsAndClones.js
```

## Future Enhancements

### Planned Features
- **Sitemap Index**: Master sitemap linking to domain-specific sitemaps
- **Image Sitemaps**: Include featured images from pages
- **News Sitemaps**: Support for blog/news content
- **Hreflang Support**: Multi-language sitemap attributes

### Scaling Considerations
- **CDN Integration**: Serve sitemaps from edge locations
- **Scheduled Generation**: Pre-generate sitemaps for popular domains
- **Analytics Integration**: Track sitemap usage and performance

## API Reference

### Refresh Endpoint
```
POST /api/sitemap-refresh
Content-Type: application/json

{
  "_type": "subjectPage",
  "_id": "document-id",
  "slug": { "current": "page-slug" }
}

Response:
{
  "success": true,
  "message": "Sitemap refresh completed",
  "details": {
    "affectedDomains": 16,
    "domains": ["domain1.com", "domain2.com", ...]
  }
}
```

### Sitemap Format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://domain.com</loc>
    <lastmod>2025-08-13T18:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Additional URLs... -->
</urlset>
```
