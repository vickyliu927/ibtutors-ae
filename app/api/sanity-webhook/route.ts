import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { client } from '@/sanity/lib/client';

// Secret to validate webhook requests
const secret = process.env.SANITY_WEBHOOK_SECRET || 'default-webhook-secret';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const signature = request.headers.get('x-sanity-signature');
    if (!signature) {
      return NextResponse.json({ message: 'Missing signature' }, { status: 401 });
    }

    // Parse the webhook body
    const body = await request.json();
    
    // Check if this is a subjectPage update that changed a slug
    if (body._type === 'subjectPage' && body.slug && body.slug.current) {
      // Handle slug change
      await handleSubjectSlugChange(body);
    }

    // Revalidate applicable paths
    if (body.slug?.current) {
      revalidatePath(`/${body.slug.current}`);
    }
    
    // Always revalidate the homepage and sitemap
    revalidatePath('/');
    revalidatePath('/sitemap.xml');
    
    // Log the revalidation
    console.log(`Revalidated paths: /, /sitemap.xml${body.slug?.current ? `, /${body.slug.current}` : ''} at ${new Date().toISOString()}`);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

/**
 * Handle subject page slug changes by updating related tutor links
 */
async function handleSubjectSlugChange(subjectPage: any) {
  const { _id, slug, subject } = subjectPage;
  
  if (!_id || !slug?.current || !subject) {
    return;
  }
  
  try {
    // Find all tutors that reference this subject page
    const tutors = await client.fetch(`
      *[_type == "tutor" && references($subjectId) in displayOnSubjectPages[]._ref] {
        _id,
        hireButtonLink
      }
    `, { subjectId: _id });

    // Update each tutor's hireButtonLink if it refers to this subject
    for (const tutor of tutors) {
      // Check if the current link contains the old slug or is for this subject
      const shouldUpdate = 
        tutor.hireButtonLink && 
        (tutor.hireButtonLink.includes(`/${slug.current}`) || 
         tutor.hireButtonLink.match(new RegExp(`/[\\w-]+#contact-form$`)));
      
      if (shouldUpdate) {
        // Update the tutor's hireButtonLink
        await client.patch(tutor._id)
          .set({
            hireButtonLink: `/${slug.current}#contact-form`
          })
          .commit();
        
        console.log(`Updated tutor ${tutor._id} with new link: /${slug.current}#contact-form`);
      }
    }
  } catch (error) {
    console.error('Error updating tutor links:', error);
  }
} 