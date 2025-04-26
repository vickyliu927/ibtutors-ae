import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

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
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
} 