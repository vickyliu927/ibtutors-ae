import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { fullName, country, phone, email, details, budget } = await req.json()
    await client.create({
      _type: 'contactFormSubmission',
      name: fullName,
      country,
      phone,
      email,
      details,
      budget,
      createdAt: new Date().toISOString(),
    })

    // Send email notification
    await resend.emails.send({
      from: 'TutorChase <noreply@tutorchase.com>',
      to: 'rahil@tutorchase.com',
      subject: 'New Contact Form Submission',
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Details:</strong> ${details}</p>
        <p><strong>Budget:</strong> ${budget}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form submission error:', err);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
} 