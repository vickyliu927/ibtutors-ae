import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    const subject = 'New Contact Form Submission';
    const text = `New contact form submission:\n\nName: ${fullName}\nCountry: ${country}\nPhone: ${phone}\nEmail: ${email}\nDetails: ${details}\nBudget: ${budget}`;

    try {
      const data = await resend.emails.send({
        from: 'Your App <onboarding@resend.dev>',
        to: 'vicliu927@gmail.com',
        subject,
        text,
      });

      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request parsing error:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
