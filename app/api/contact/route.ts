import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()
    await client.create({
      _type: 'contactFormSubmission',
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
} 