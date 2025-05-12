'use client';

import { useState, useEffect } from 'react';
import { useServerInsertedHTML } from 'next/navigation';

// Critical CSS that will be injected into the head
// These are the most important styles needed for the initial render
const criticalCss = `
/* Critical styles for above-the-fold content */
body {
  margin: 0;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.bg-white {
  background-color: #fff;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
.font-bold {
  font-weight: 700;
}
.text-center {
  text-align: center;
}
.text-gray-600 {
  color: rgb(75, 85, 99);
}
.text-black {
  color: #000;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
`;

export function CriticalCssInjector({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  // This will only run once on the server
  useServerInsertedHTML(() => {
    return (
      <style 
        id="critical-css" 
        dangerouslySetInnerHTML={{ 
          __html: criticalCss 
        }} 
      />
    );
  });

  // Set isClient to true once component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return <>{children}</>;
} 