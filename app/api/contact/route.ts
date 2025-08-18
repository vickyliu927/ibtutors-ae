import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// Define validation schema for contact form
const ContactFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100, "Name is too long"),
  country: z.string().min(1, "Country is required").max(100, "Country name is too long"),
  phone: z.string().min(5, "Phone number is too short").max(20, "Phone number is too long"),
  email: z.string().email("Invalid email format"),
  details: z.string().min(10, "Please provide more details").max(1000, "Details are too long"),
  budget: z.string().min(1, "Budget is required"),
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

export async function POST(req: Request) {
  console.log('=== CONTACT FORM API CALLED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
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
    const origin = req.headers.get('origin') || req.headers.get('referer') || '';
    const sourceDomain = origin.replace(/^https?:\/\//, '').split('/')[0];
    const sourceWebsite = getWebsiteName(sourceDomain);
    console.log('Source domain:', sourceDomain, 'Website:', sourceWebsite);
    
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
    const { fullName, country, phone, email, details, budget } = result.data;

    // Send email notification with encoded HTML entities
    const subject = `New Contact Form Submission - ${sourceWebsite}`;
    const text = `New contact form submission from ${sourceWebsite}:

Name: ${encodeHTML(fullName)}
Country: ${encodeHTML(country)}
Phone: ${encodeHTML(phone)}
Email: ${encodeHTML(email)}
Details: ${encodeHTML(details)}
Budget: ${encodeHTML(budget)}

Source Website: ${encodeHTML(sourceWebsite)}
Source Domain: ${encodeHTML(sourceDomain)}`;

    console.log('Attempting to send email with:', {
      from: 'IBTutors AE <noreply@ibtutorsae.com>',
      to: 'vicky@tutorchase.com',
      subject,
      hasText: !!text
    });

    const emailData = await resend.emails.send({
      from: 'IBTutors AE <onboarding@resend.dev>',
      to: 'vicky@tutorchase.com',
      subject,
      text,
    });

    console.log('Email send result:', emailData);

    return NextResponse.json({
      success: true,
      emailSent: true,
      message: 'Contact form submission sent successfully to vicky@tutorchase.com',
      emailId: emailData?.data?.id || 'unknown'
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
 