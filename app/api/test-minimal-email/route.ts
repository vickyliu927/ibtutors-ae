import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== MINIMAL EMAIL TEST ===');
  
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'No API key' }, { status: 500 });
  }
  
  try {
    // Test with direct fetch instead of SDK
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'vicky@tutorchase.com',
        subject: 'Minimal Test Email',
        text: 'This is a minimal test email sent directly via fetch.'
      })
    });
    
    const result = await response.json();
    
    console.log('Direct API response:', {
      status: response.status,
      ok: response.ok,
      result
    });
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Direct API error:', error);
    
    return NextResponse.json({
      error: 'Failed to send via direct API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
