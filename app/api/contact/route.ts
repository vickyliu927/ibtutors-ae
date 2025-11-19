import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { client } from '@/sanity/lib/client';
import { z } from 'zod';

// Define validation schema for contact form
const ContactFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100, "Name is too long"),
  country: z.string().min(1, "Country is required").max(100, "Country name is too long"),
  phone: z.string().min(5, "Phone number is too short").max(20, "Phone number is too long"),
  email: z.string().email("Invalid email format"),
  details: z.string().min(10, "Please provide more details").max(1000, "Details are too long"),
  budget: z.string().min(1, "Budget is required"),
  // Optional client-provided context
  sourcePath: z.string().optional(),
  sourceUrl: z.string().url().optional(),
});

// Helper function to determine website name from domain
function getWebsiteName(domain: string): string {
  if (domain.includes('dubaitutors.ae') || domain.includes('ibtutors-ae')) {
    return 'Dubai Tutors';
  } else if (domain.includes('abudhabitutors') || domain.includes('abu-dhabi')) {
    return 'Abu Dhabi Tutors';
  } else if (domain.includes('localhost') || domain.includes('vercel.app')) {
    return 'Development/Staging';
  }
  return 'Unknown Website';
}

// Helper function to encode HTML entities
function encodeHTML(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// In-memory cache for clone domains
let cachedCloneDomains: { values: string[]; expiresAt: number } | null = null;

async function getAllCloneDomains(): Promise<string[]> {
  const now = Date.now();
  if (cachedCloneDomains && cachedCloneDomains.expiresAt > now) {
    return cachedCloneDomains.values;
  }
  try {
    const query = `*[_type == "clone" && isActive == true]{
      "domains": metadata.domains[]
    }`;
    const res: Array<{ domains?: string[] }> = await client.fetch(query, {}, { cache: 'no-store' } as any);
    const domains = Array.from(new Set((res || []).flatMap(r => r.domains || []).filter(Boolean)));
    // Cache for 5 minutes
    cachedCloneDomains = { values: domains, expiresAt: now + 5 * 60 * 1000 };
    return domains;
  } catch (e) {
    console.error('Failed to fetch clone domains from Sanity:', e);
    return [];
  }
}

export async function POST(req: Request) {
  console.log('=== CONTACT FORM API CALLED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  // Kill-switch to disable outbound emails without code changes
  const emailSendingEnabled = process.env.ENABLE_CONTACT_EMAILS !== 'false';
  
  // Build allowlist from env and Sanity clone domains (cached briefly)
  const staticAllowed = (process.env.ALLOWED_CONTACT_ORIGINS || 'https://www.dubaitutors.ae,https://dubaitutors.ae')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  
  // Simple in-memory cache (module scope variables live across requests in serverless when warm)
  const domains = await getAllCloneDomains();
  const dynamicAllowed = domains.flatMap((d) => [
    `https://${d}`,
    `https://www.${d}`
  ]);
  const allowedOrigins = Array.from(new Set([...staticAllowed, ...dynamicAllowed]));
  
  if (!process.env.RESEND_API_KEY) {
    console.log('ERROR: RESEND_API_KEY is not configured');
    return NextResponse.json(
      { error: 'Resend API key is not configured' },
      { status: 500 }
    );
  }
  
  console.log('RESEND_API_KEY is configured:', !!process.env.RESEND_API_KEY);

  try {
    const formData = await req.json();
    console.log('Form data received:', formData);
    
    // Extract domain information from request headers
    const referer = req.headers.get('referer') || '';
    const origin = req.headers.get('origin') || referer || '';
    const sourceDomain = origin.replace(/^https?:\/\//, '').split('/')[0];
    const sourceWebsite = getWebsiteName(sourceDomain);
    console.log('Source domain:', sourceDomain, 'Website:', sourceWebsite);
    // Derive path and full URL from referer as a fallback
    let sourcePath = '/';
    let sourceUrl = '';
    try {
      if (referer) {
        const refUrl = new URL(referer);
        sourcePath = refUrl.pathname || '/';
        sourceUrl = refUrl.href;
      } else if (origin) {
        const o = new URL(origin.startsWith('http') ? origin : `https://${origin}`);
        sourcePath = '/';
        sourceUrl = o.href;
      }
    } catch {
      sourcePath = '/';
      sourceUrl = origin || '';
    }
    
    // If origin header exists but is not allowlisted, skip sending emails
    const originIsAllowed = !origin || allowedOrigins.some((o) => origin.startsWith(o));
    if (!originIsAllowed) {
      console.warn('Blocked contact submission from disallowed origin:', origin);
    }
    
    // Validate form data
    const result = ContactFormSchema.safeParse(formData);
    console.log('Validation result:', result.success ? 'PASSED' : 'FAILED');
    
    if (!result.success) {
      // Return validation errors
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Use validated data
    const { fullName, country, phone, email, details, budget, sourcePath: clientSourcePath, sourceUrl: clientSourceUrl } = result.data;
    // Prefer client-provided path/url when available
    if (typeof clientSourcePath === 'string' && clientSourcePath.trim()) {
      sourcePath = clientSourcePath;
    }
    if (typeof clientSourceUrl === 'string' && clientSourceUrl.trim()) {
      try {
        const u = new URL(clientSourceUrl);
        sourceUrl = u.href;
      } catch {
        // ignore invalid client-provided URL
      }
    }

    // Store the submission in Sanity
    const submission = await client.create({
      _type: 'contactFormSubmission',
      fullName,
      country,
      phone,
      email,
      details,
      budget,
      submittedAt: new Date().toISOString(),
      sourceDomain,
      sourceWebsite,
      sourcePath,
      sourceUrl,
    });

    // Send email notification with encoded HTML entities
    // Only append site name if it's known; avoid "- Unknown Website" suffix
    const subjectLenient = sourceWebsite && sourceWebsite !== 'Unknown Website' ? ` - ${sourceWebsite}` : '';
    const subject = `New Contact Form Submission${subjectLenient}`;
    const text = `New contact form submission from ${sourceWebsite}:

Name: ${encodeHTML(fullName)}
Country: ${encodeHTML(country)}
Phone: ${encodeHTML(phone)}
Email: ${encodeHTML(email)}
Details: ${encodeHTML(details)}
Budget: ${encodeHTML(budget)}

Source Website: ${encodeHTML(sourceWebsite)}
Source Domain: ${encodeHTML(sourceDomain)}
Source Path: ${encodeHTML(sourcePath)}
Source URL: ${encodeHTML(sourceUrl)}`;

    let emailData: unknown = null;
    if (emailSendingEnabled && originIsAllowed) {
      // Initialize Resend client
      const resend = new Resend(process.env.RESEND_API_KEY);
      const recipients = [
        'ghejlswd@mailparser.io',
        'rahil@tutorchase.com',
        'info@tutorchase.com',
      ];

      console.log('Attempting to send email with:', {
        from: 'onboarding@resend.dev',
        to: recipients,
        subject,
        hasText: !!text
      });

      emailData = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: recipients,
        subject,
        text,
      });

      console.log('Email send result:', emailData);
    } else {
      console.log('Email sending skipped. Enabled:', emailSendingEnabled, 'Origin allowed:', originIsAllowed);
    }

    return NextResponse.json({
      success: true,
      emailSent: !!emailData,
      sanitySubmission: submission,
      message: emailData ? 'Contact form submission stored and email sent' : 'Contact form submission stored (email skipped)',
      emailId: (emailData as any)?.data?.id || 'skipped'
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process form submission',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
 