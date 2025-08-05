/**
 * Browser-based clone resolution debugger
 * 
 * Usage in browser console:
 * window.debugCloneResolution()
 */

declare global {
  interface Window {
    debugCloneResolution: () => void;
  }
}

export function initCloneDebugger() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    window.debugCloneResolution = async () => {
      console.group('🔍 Clone Resolution Debug');
      
      try {
        // Get current page info
        const url = new URL(window.location.href);
        const pathname = url.pathname;
        const searchParams = url.searchParams;
        
        console.log('📍 Current Page:', {
          hostname: window.location.hostname,
          pathname,
          searchParams: Object.fromEntries(searchParams.entries())
        });

        // Check headers from last request
        console.group('🌐 Request Headers');
        
        // Get headers from a fetch request to current page
        try {
          const response = await fetch(window.location.href, { method: 'HEAD' });
          const headers = {
            'x-clone-id': response.headers.get('x-clone-id'),
            'x-clone-name': response.headers.get('x-clone-name'),
            'x-clone-source': response.headers.get('x-clone-source'),
            'x-debug-middleware-executed': response.headers.get('x-debug-middleware-executed'),
            'x-debug-hostname': response.headers.get('x-debug-hostname'),
            'x-debug-clone-result': response.headers.get('x-debug-clone-result'),
          };
          
          console.table(headers);
          
          if (!headers['x-clone-id']) {
            console.error('❌ No clone ID found in headers');
            console.warn('💡 This means domain mapping failed');
          } else {
            console.log(`✅ Clone ID: ${headers['x-clone-id']}`);
            console.log(`✅ Clone Name: ${headers['x-clone-name']}`);
          }
        } catch (error) {
          console.error('Failed to fetch headers:', error);
        }
        
        console.groupEnd();

        // Check local storage for clone context
        console.group('💾 Local Storage');
        const clonePrefs = localStorage.getItem('cloneContext_preferences');
        const lastClone = localStorage.getItem('cloneContext_lastClone');
        
        console.log('Preferences:', clonePrefs ? JSON.parse(clonePrefs) : 'None');
        console.log('Last Clone:', lastClone || 'None');
        console.groupEnd();

        // Test clone parameter
        console.group('🧪 Quick Tests');
        
        const cloneId = searchParams.get('clone') || 'test-clone-id';
        const testUrl = `${window.location.origin}${pathname}?clone=${cloneId}`;
        
        console.log(`🔗 Test with clone parameter:`);
        console.log(`%c${testUrl}`, 'color: blue; text-decoration: underline;');
        
        console.log(`🔗 Test without clone parameter:`);
        const cleanUrl = `${window.location.origin}${pathname}`;
        console.log(`%c${cleanUrl}`, 'color: blue; text-decoration: underline;');
        
        console.groupEnd();

        // Show clone indicator if available
        console.group('🎯 Clone Context');
        
        // Try to get clone context from React (if available)
        const cloneIndicator = document.querySelector('[data-clone-indicator]');
        if (cloneIndicator) {
          console.log('Clone indicator found on page');
        } else {
          console.warn('No clone indicator found - add CloneIndicatorBanner to debug');
        }
        
        console.groupEnd();

        // Generate debug URLs
        console.group('🔧 Debug URLs');
        
        const subject = pathname.split('/').filter(Boolean)[0] || 'maths';
        
        console.log('Test these URLs:');
        console.log(`1. With clone param: %c${window.location.origin}/${subject}?clone=your-clone-id`, 'color: green;');
        console.log(`2. With debug param: %c${window.location.origin}/${subject}?debug=true`, 'color: green;');
        console.log(`3. Sanity Vision: %chttps://ibtutors-ae.sanity.studio/vision`, 'color: blue;');
        
        console.groupEnd();

        // Recommendations
        console.group('💡 Next Steps');
        
        console.log('1. Check browser Network tab for x-clone-id header');
        console.log('2. Verify domain mapping in Sanity Studio');
        console.log('3. Check subject page has cloneReference set');
        console.log('4. Ensure both clone and subject page are active');
        console.log('5. Try URL parameter method for testing');
        
        console.groupEnd();

      } catch (error) {
        console.error('Debug error:', error);
      }
      
      console.groupEnd();
    };
    
    console.log('🔍 Clone debugger loaded. Run window.debugCloneResolution() to debug.');
  }
}

// Common debug queries for Sanity Vision
export const debugQueries = {
  // Check all clones and their domains
  allClones: `*[_type == "clone"] {
    _id,
    cloneId,
    cloneName,
    isActive,
    baselineClone,
    "domains": metadata.domains
  } | order(cloneName asc)`,

  // Check specific domain mapping
  domainMapping: (domain: string) => `*[_type == "clone" && "${domain}" in metadata.domains] {
    _id,
    cloneId,
    cloneName,
    isActive,
    baselineClone,
    "domains": metadata.domains
  }`,

  // Check subject pages for a specific subject
  subjectPages: (subject: string) => `*[_type == "subjectPage" && slug.current == "${subject}"] {
    _id,
    title,
    slug,
    isActive,
    cloneReference-> {
      _id,
      cloneId,
      cloneName,
      isActive,
      baselineClone
    }
  }`,

  // Check clone-specific content for subject
  cloneSpecificContent: (subject: string, cloneId: string) => `{
    "cloneSpecific": *[_type == "subjectPage" && slug.current == "${subject}" && cloneReference->cloneId.current == "${cloneId}" && isActive == true][0],
    "baseline": *[_type == "subjectPage" && slug.current == "${subject}" && cloneReference->baselineClone == true && isActive == true][0],
    "default": *[_type == "subjectPage" && slug.current == "${subject}" && !defined(cloneReference) && isActive == true][0]
  }`,

  // Check inactive content
  inactiveContent: (subject: string) => `*[_type == "subjectPage" && slug.current == "${subject}" && isActive != true] {
    _id,
    title,
    isActive,
    cloneReference-> {
      cloneId,
      cloneName,
      isActive
    }
  }`
};

// Export for console access
if (typeof window !== 'undefined') {
  (window as any).debugQueries = debugQueries;
}