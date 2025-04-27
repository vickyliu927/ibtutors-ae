import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import nodemailer from 'nodemailer'

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

    // Send email notification with Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: 'vicliu927@gmail.com',
      to: 'vicliu927@gmail.com',
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