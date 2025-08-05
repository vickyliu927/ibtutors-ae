'use client';

import { useEffect } from 'react';
import { initCloneDebugger } from '../lib/debugCloneResolution';

export default function DebuggerInitializer() {
  useEffect(() => {
    // Only initialize in development
    if (process.env.NODE_ENV === 'development') {
      initCloneDebugger();
    }
  }, []);

  // This component doesn't render anything
  return null;
}