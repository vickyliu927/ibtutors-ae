'use client';

import React from 'react';
import Link from 'next/link';

// Global error boundary for client-side exceptions.
// This renders instead of the generic "Application error" screen and gives us
// a controlled place to surface a recovery action.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log to help with triage in the browser console and any connected log drains
  // (Do not expose stack to users).
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error('[GlobalErrorBoundary] Caught error:', {
      name: error?.name,
      message: error?.message,
      digest: error?.digest,
    });
  }

  return (
    <html>
      <body>
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-[#171D23] text-center">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6 text-center max-w-xl">
            The page encountered an unexpected error. Please try again. If the issue persists, return to the homepage.
          </p>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="bg-[#001A96] text-white px-5 py-2 rounded-md hover:bg-[#001A96]/90 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="bg-gray-100 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Go home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}


