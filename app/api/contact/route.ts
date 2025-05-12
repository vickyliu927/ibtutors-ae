import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { client } from '@/sanity/lib/client';
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
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Resend API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.json();
    
    // Validate form data
    const result = ContactFormSchema.safeParse(formData);
    
    if (!result.success) {
      // Return validation errors
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Use validated data
    const { fullName, country, phone, email, details, budget } = result.data;

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
    });

    // Send email notification with encoded HTML entities
    const subject = 'New Contact Form Submission';
    const text = `New contact form submission:

Name: ${encodeHTML(fullName)}
Country: ${encodeHTML(country)}
Phone: ${encodeHTML(phone)}
Email: ${encodeHTML(email)}
Details: ${encodeHTML(details)}
Budget: ${encodeHTML(budget)}`;

    const emailData = await resend.emails.send({
      from: 'Your App <onboarding@resend.dev>',
      to: 'vicliu927@gmail.com',
      subject,
      text,
    });

    return NextResponse.json({
      success: true,
      sanitySubmission: submission,
      emailData,
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}
 