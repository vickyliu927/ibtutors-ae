import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
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

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
