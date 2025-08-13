import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '@sanity/client';

// Create Sanity client for webhook verification
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r689038t',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-20',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * API endpoint to refresh sitemaps when content changes
 * Can be triggered by:
 * 1. Sanity webhooks (automatic)
 * 2. Manual API calls (for testing)
 * 3. Scheduled jobs (future enhancement)
 */
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json().catch(() => ({}));
    
    // Verify webhook signature if this is a Sanity webhook
    const signature = headers().get('sanity-webhook-signature');
    const isWebhook = !!signature;
    
    if (isWebhook) {
      // TODO: Add webhook signature verification for security
      console.log('[Sitemap Refresh] Received Sanity webhook');
    } else {
      console.log('[Sitemap Refresh] Manual API call');
    }

    // Log the trigger information
    const documentType = body._type;
    const documentId = body._id;
    const operation = body._rev ? 'update' : 'create';
    
    console.log(`[Sitemap Refresh] Document ${operation}: ${documentType} (${documentId})`);

    // Determine what needs to be refreshed based on the document type
    const refreshActions = [];

    if (documentType === 'clone') {
      // New clone added or existing clone modified
      refreshActions.push('all-sitemaps');
      console.log('[Sitemap Refresh] Clone document changed - refreshing all sitemaps');
    } else if (documentType === 'subjectPage' || documentType === 'curriculumPage') {
      // Page content changed - refresh all domain sitemaps
      refreshActions.push('all-sitemaps');
      console.log(`[Sitemap Refresh] ${documentType} changed - refreshing all sitemaps`);
    } else if (documentType === 'hero' || documentType === 'testimonialSection') {
      // Content changed but doesn't affect sitemap structure
      refreshActions.push('cache-only');
      console.log(`[Sitemap Refresh] ${documentType} changed - refreshing cache only`);
    }

    // Execute refresh actions
    for (const action of refreshActions) {
      switch (action) {
        case 'all-sitemaps':
          // Revalidate the sitemap path for all domains
          revalidatePath('/sitemap.xml');
          
          // Also revalidate the cache tags used by sitemap utils
          revalidateTag('sitemap-data');
          revalidateTag('clone-mappings');
          revalidateTag('subject-pages');
          revalidateTag('curriculum-pages');
          
          console.log('[Sitemap Refresh] Revalidated all sitemap paths and caches');
          break;
          
        case 'cache-only':
          // Just revalidate content caches
          revalidateTag('sitemap-data');
          console.log('[Sitemap Refresh] Revalidated content caches');
          break;
      }
    }

    // Get all current domain mappings for response
    const domainMappings = await client.fetch(`
      *[_type == "clone" && isActive == true] {
        "domains": metadata.domains,
        cloneId,
        cloneName
      }
    `);

    const allDomains = domainMappings.flatMap(clone => 
      clone.domains?.map((domain: string) => ({
        domain,
        cloneId: clone.cloneId?.current,
        cloneName: clone.cloneName
      })) || []
    );

    return NextResponse.json({
      success: true,
      message: 'Sitemap refresh completed',
      details: {
        trigger: isWebhook ? 'webhook' : 'manual',
        documentType,
        documentId,
        operation,
        refreshActions,
        timestamp: new Date().toISOString(),
        affectedDomains: allDomains.length,
        domains: allDomains.map(d => d.domain)
      }
    });

  } catch (error) {
    console.error('[Sitemap Refresh] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to refresh sitemap',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'Sitemap refresh API endpoint',
    usage: 'Send POST request to trigger sitemap refresh',
    endpoints: {
      refresh: 'POST /api/sitemap-refresh',
      test: 'GET /api/sitemap-refresh'
    },
    timestamp: new Date().toISOString()
  });
}
