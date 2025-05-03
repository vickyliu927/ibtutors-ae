import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { client } from '@/sanity/lib/client';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Resend API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const { fullName, country, phone, email, details, budget } = await req.json();

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

    // Send email notification
    const subject = 'New Contact Form Submission';
    const text = `New contact form submission:\n\nName: ${fullName}\nCountry: ${country}\nPhone: ${phone}\nEmail: ${email}\nDetails: ${details}\nBudget: ${budget}`;

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
 