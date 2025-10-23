import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get('email') || 'vicky@tutorchase.com';
  console.log('=== EMAIL TEST ENDPOINT CALLED ===');
  console.log('Timestamp:', new Date().toISOString());
  
  if (!process.env.RESEND_API_KEY) {
    console.log('ERROR: RESEND_API_KEY is not configured');
    return NextResponse.json(
      { error: 'Resend API key is not configured' },
      { status: 500 }
    );
  }
  
  console.log('RESEND_API_KEY is configured');
  console.log('API Key starts with:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
  console.log('API Key length:', process.env.RESEND_API_KEY?.length);
  
  try {
    console.log('Attempting to send test email...');
    
    // Initialize Resend client within the try block
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log('Sending email with params:', {
      from: 'IBTutors AE <onboarding@resend.dev>',
      to: testEmail,
      subject: `Test Email from IBTutors Contact System - ${new Date().toISOString()}`,
    });

    const emailData = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: testEmail,
      subject: `Test Email from IBTutors Contact System - ${new Date().toISOString()}`,
      text: `This is a test email to verify the Resend integration is working correctly.\n\nSent to: ${testEmail}\nTimestamp: ${new Date().toISOString()}`,
    });

    console.log('Test email sent successfully:', emailData);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      emailId: emailData?.data?.id || 'unknown',
      timestamp: new Date().toISOString(),
      debug: {
        apiKeyPresent: !!process.env.RESEND_API_KEY,
        apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
        apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) || 'none',
        emailDataReceived: !!emailData
      }
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
    }
    
    // Log the full error for debugging
    console.error('Raw error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        debug: {
          apiKeyPresent: !!process.env.RESEND_API_KEY,
          apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
          apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) || 'none'
        }
      },
      { status: 500 }
    );
  }
}
