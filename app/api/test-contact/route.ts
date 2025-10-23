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
  console.log('=== TEST CONTACT API CALLED ===');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    // Test data
    const testFormData = {
      fullName: 'Test User',
      country: 'UAE',
      phone: '+971501234567',
      email: 'test@example.com',
      details: 'This is a test submission to verify the contact form is working.',
      budget: '$100-200'
    };
    
    console.log('Calling contact API with test data...');
    
    // Make a request to our own contact API
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dubaitutors.ae';
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFormData),
    });
    
    const result = await response.json();
    
    console.log('Contact API response:', {
      status: response.status,
      ok: response.ok,
      result
    });
    
    return NextResponse.json({
      success: true,
      message: 'Test contact API call completed',
      contactApiResponse: {
        status: response.status,
        ok: response.ok,
        result
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error testing contact API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to test contact API',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
