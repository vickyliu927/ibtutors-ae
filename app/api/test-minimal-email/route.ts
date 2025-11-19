import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Protect this test endpoint via env flag and optional secret
  if (process.env.ENABLE_TEST_ENDPOINTS !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const url = new URL(request.url);
  const providedSecret = url.searchParams.get('secret') || request.headers.get('x-test-secret');
  if (process.env.TEST_ENDPOINT_SECRET && providedSecret !== process.env.TEST_ENDPOINT_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
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
        to: 'ghejlswd@mailparser.io',
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
