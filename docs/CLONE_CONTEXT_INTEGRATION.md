# Clone Context Integration Guide

This guide shows how to integrate the CloneContext system into your Next.js application for client-side clone state management.

## 🚀 Quick Setup

### 1. Wrap your app with CloneProvider

Update your root layout or _app.tsx:

```tsx
// app/layout.tsx
import { CloneProvider } from './contexts/CloneContext';
import { CloneDebugPanel } from './contexts/CloneContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CloneProvider enableUrlDetection={true}>
          {children}
          
          {/* Add debug panel for development */}
          <CloneDebugPanel position="bottom" collapsed={true} />
        </CloneProvider>
      </body>
    </html>
  );
}
```

### 2. Use the CloneContext in components

```tsx
// app/components/MyComponent.tsx
'use client';

import { useCloneContext } from '../contexts/CloneContext';

export default function MyComponent() {
  const { 
    currentClone, 
    availableClones, 
    switchToClone,
    loadingState 
  } = useCloneContext();

  if (loadingState === 'loading') {
    return <div>Loading clones...</div>;
  }

  return (
    <div>
      <h2>Current Clone: {currentClone?.cloneName || 'Default'}</h2>
      
      <div>
        {availableClones.map(clone => (
          <button
            key={clone._id}
            onClick={() => switchToClone(clone.cloneId.current)}
          >
            Switch to {clone.cloneName}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### 3. Add Clone Switcher to Navigation

```tsx
// app/components/Navbar.tsx
import CloneSwitcher from './CloneSwitcher';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <div>Logo</div>
      
      {/* Add clone switcher to navigation */}
      <CloneSwitcher variant="compact" className="ml-4" />
    </nav>
  );
}
```

## 🔧 Configuration Options

### CloneProvider Props

```tsx
interface CloneProviderProps {
  children: ReactNode;
  initialCloneId?: string;        // Set initial clone
  enableUrlDetection?: boolean;   // Enable /clone/[id] routes
}

// Examples:
<CloneProvider initialCloneId="abu-dhabi">
<CloneProvider enableUrlDetection={false}>
<CloneProvider initialCloneId="baseline" enableUrlDetection={true}>
```

### CloneDebugPanel Props

```tsx
interface CloneDebugPanelProps {
  position?: 'top' | 'bottom' | 'floating';
  collapsed?: boolean;
}

// Examples:
<CloneDebugPanel position="floating" collapsed={false} />
<CloneDebugPanel position="top" />
```

## 🎯 URL-Based Clone Detection

The CloneContext supports multiple URL patterns:

### Query Parameters
```
http://localhost:3000?clone=abu-dhabi
http://localhost:3000/maths?clone=abu-dhabi
```

### Clone Routes
```
http://localhost:3000/clone/abu-dhabi
http://localhost:3000/clone/abu-dhabi/maths
```

### Priority Order
1. URL query parameter (?clone=id)
2. Clone route (/clone/id)
3. Initial prop (initialCloneId)
4. localStorage preference
5. Default/baseline

## 📦 Available Hooks & Utilities

### useCloneContext Hook

```tsx
const {
  // State
  currentClone,           // Current active clone
  availableClones,        // All available clones
  baselineClone,          // Baseline clone
  loadingState,           // 'idle' | 'loading' | 'success' | 'error'
  switchingState,         // Loading state for clone switches
  error,                  // Error object if any
  preferences,            // User preferences
  isInitialized,          // Whether context is ready
  sourceType,             // How current clone was detected
  
  // Actions
  setCurrentCloneId,      // Set clone by ID
  switchToClone,          // Switch to specific clone
  switchToBaseline,       // Switch to baseline clone
  refreshClones,          // Reload all clones
  clearError,             // Clear current error
  updatePreferences,      // Update user preferences
  resetToDefault,         // Reset to default state
  
  // Debug (development only)
  enableDebugMode,        // Enable debug mode
  disableDebugMode,       // Disable debug mode
  exportState,            // Export state as JSON
  importState,            // Import state from JSON
} = useCloneContext();
```

### Utility Functions

```tsx
import { isCloneActive, getCloneBySlug } from '../contexts/CloneContext';

// Check if a clone is currently active
const isActive = isCloneActive(someClone, currentClone);

// Find clone by slug or ID
const foundClone = getCloneBySlug(availableClones, 'abu-dhabi');
```

## 🔄 State Management Examples

### Basic Clone Switching

```tsx
function CloneManager() {
  const { switchToClone, availableClones, switchingState } = useCloneContext();
  
  const handleSwitch = async (cloneId: string) => {
    try {
      await switchToClone(cloneId);
      console.log('Successfully switched to clone:', cloneId);
    } catch (error) {
      console.error('Failed to switch clone:', error);
    }
  };

  return (
    <div>
      {availableClones.map(clone => (
        <button
          key={clone._id}
          onClick={() => handleSwitch(clone.cloneId.current)}
          disabled={switchingState === 'loading'}
        >
          {clone.cloneName}
        </button>
      ))}
    </div>
  );
}
```

### Preferences Management

```tsx
function PreferencesPanel() {
  const { preferences, updatePreferences } = useCloneContext();
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={preferences.autoSwitchEnabled}
          onChange={(e) => updatePreferences({ 
            autoSwitchEnabled: e.target.checked 
          })}
        />
        Auto-switch enabled
      </label>
      
      <label>
        <input
          type="checkbox"
          checked={preferences.rememberPreferences}
          onChange={(e) => updatePreferences({ 
            rememberPreferences: e.target.checked 
          })}
        />
        Remember preferences
      </label>
    </div>
  );
}
```

### Error Handling

```tsx
function ErrorHandler() {
  const { error, clearError } = useCloneContext();
  
  if (!error) return null;
  
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong>Error:</strong> {error.message}
      <button 
        onClick={clearError}
        className="ml-2 underline"
      >
        Dismiss
      </button>
    </div>
  );
}
```

## 🐛 Development & Debugging

### Enable Debug Mode

```tsx
// Programmatically
const { enableDebugMode } = useCloneContext();
enableDebugMode();

// Via preferences
const { updatePreferences } = useCloneContext();
updatePreferences({ debugMode: true });
```

### Debug Panel Features

- **Current State**: Shows active clone and source
- **Available Clones**: List all clones with switch buttons
- **Quick Actions**: Refresh, baseline switch, reset
- **Error Display**: Shows any errors with details
- **Preferences**: Toggle settings directly
- **State Export**: Export current state as JSON

### Console Debugging

```tsx
// Export state to console
const { exportState } = useCloneContext();
console.log('Clone State:', exportState());

// Import state from JSON
const { importState } = useCloneContext();
importState(jsonString);
```

## 📱 CloneSwitcher Component Variants

### Dropdown (Default)
```tsx
<CloneSwitcher variant="dropdown" />
```

### Button Group
```tsx
<CloneSwitcher variant="buttons" />
```

### Compact Select
```tsx
<CloneSwitcher variant="compact" />
```

### With Debug Info
```tsx
<CloneSwitcher showDebugInfo={true} />
<CloneSwitcherDebugInfo />
```

## 🔄 Integration with Server-Side Clone System

The CloneContext works alongside your server-side clone detection:

1. **Server-side**: Middleware detects domain → sets headers → renders page with clone data
2. **Client-side**: CloneContext detects URL/preferences → manages clone switching → persists choices

### Hydration Considerations

```tsx
// The context handles SSR/hydration automatically
// But you can check initialization state:

function MyComponent() {
  const { isInitialized, loadingState } = useCloneContext();
  
  if (!isInitialized || loadingState === 'loading') {
    return <div>Initializing clone context...</div>;
  }
  
  // Safe to use clone data here
  return <div>Clone context ready!</div>;
}
```

## 📚 TypeScript Support

All interfaces are fully typed:

```tsx
import type {
  CloneContextState,
  CloneContextActions,
  CloneContextValue,
  ClonePreferences,
  CloneError,
  CloneLoadingState
} from '../contexts/CloneContext';
```

## 🚨 Best Practices

1. **Always check loading states** before using clone data
2. **Handle errors gracefully** with the error state
3. **Use the debug panel** during development
4. **Remember user preferences** for better UX
5. **Test URL-based detection** with different routes
6. **Combine with server-side detection** for full coverage

## 🔗 Related Components

- `CloneIndicatorBanner`: Server-side debug information
- `CloneSwitcher`: Client-side clone switching UI
- `CloneDebugPanel`: Development debugging tools

This client-side system complements your server-side clone detection middleware for a complete multi-domain solution! 🎉 