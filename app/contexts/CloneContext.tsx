'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CloneData, getAllClones, getCloneById, getBaselineClone } from '../lib/cloneUtils';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export type CloneLoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ClonePreferences {
  lastSelectedCloneId?: string;
  autoSwitchEnabled: boolean;
  debugMode: boolean;
  rememberPreferences: boolean;
}

export interface CloneError {
  message: string;
  code: string;
  timestamp: Date;
  operation: string;
}

export interface CloneContextState {
  // Core State
  currentClone: CloneData | null;
  availableClones: CloneData[];
  baselineClone: CloneData | null;
  
  // Loading States
  loadingState: CloneLoadingState;
  switchingState: CloneLoadingState;
  refreshingState: CloneLoadingState;
  
  // Error Handling
  error: CloneError | null;
  
  // User Preferences
  preferences: ClonePreferences;
  
  // Metadata
  lastUpdated: Date | null;
  isInitialized: boolean;
  sourceType: 'url' | 'localStorage' | 'header' | 'default' | null;
}

export interface CloneContextActions {
  // Core Actions
  setCurrentCloneId: (cloneId: string | null) => Promise<void>;
  switchToClone: (cloneId: string) => Promise<void>;
  switchToBaseline: () => Promise<void>;
  refreshClones: () => Promise<void>;
  
  // Utility Actions
  clearError: () => void;
  updatePreferences: (preferences: Partial<ClonePreferences>) => void;
  resetToDefault: () => Promise<void>;
  
  // Debug Actions (development only)
  enableDebugMode: () => void;
  disableDebugMode: () => void;
  exportState: () => string;
  importState: (stateJson: string) => void;
}

export interface CloneContextValue extends CloneContextState, CloneContextActions {}

// ============================================================================
// ACTION TYPES AND REDUCER
// ============================================================================

type CloneAction =
  | { type: 'SET_LOADING_STATE'; payload: CloneLoadingState }
  | { type: 'SET_SWITCHING_STATE'; payload: CloneLoadingState }
  | { type: 'SET_REFRESHING_STATE'; payload: CloneLoadingState }
  | { type: 'SET_CURRENT_CLONE'; payload: { clone: CloneData | null; sourceType: CloneContextState['sourceType'] } }
  | { type: 'SET_AVAILABLE_CLONES'; payload: CloneData[] }
  | { type: 'SET_BASELINE_CLONE'; payload: CloneData | null }
  | { type: 'SET_ERROR'; payload: CloneError | null }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<ClonePreferences> }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_STATE' };

const initialState: CloneContextState = {
  currentClone: null,
  availableClones: [],
  baselineClone: null,
  loadingState: 'idle',
  switchingState: 'idle',
  refreshingState: 'idle',
  error: null,
  preferences: {
    autoSwitchEnabled: true,
    debugMode: false,
    rememberPreferences: true,
  },
  lastUpdated: null,
  isInitialized: false,
  sourceType: null,
};

function cloneReducer(state: CloneContextState, action: CloneAction): CloneContextState {
  switch (action.type) {
    case 'SET_LOADING_STATE':
      return { ...state, loadingState: action.payload };
    
    case 'SET_SWITCHING_STATE':
      return { ...state, switchingState: action.payload };
    
    case 'SET_REFRESHING_STATE':
      return { ...state, refreshingState: action.payload };
    
    case 'SET_CURRENT_CLONE':
      return { 
        ...state, 
        currentClone: action.payload.clone,
        sourceType: action.payload.sourceType,
        lastUpdated: new Date()
      };
    
    case 'SET_AVAILABLE_CLONES':
      return { ...state, availableClones: action.payload, lastUpdated: new Date() };
    
    case 'SET_BASELINE_CLONE':
      return { ...state, baselineClone: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'UPDATE_PREFERENCES':
      return { 
        ...state, 
        preferences: { ...state.preferences, ...action.payload },
        lastUpdated: new Date()
      };
    
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'RESET_STATE':
      return { ...initialState, preferences: state.preferences };
    
    default:
      return state;
  }
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const CloneContext = createContext<CloneContextValue | null>(null);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a clone is currently active
 */
export function isCloneActive(clone: CloneData | null, currentClone: CloneData | null): boolean {
  if (!clone || !currentClone) return false;
  return clone.cloneId.current === currentClone.cloneId.current;
}

/**
 * Get clone by slug/ID from available clones
 */
export function getCloneBySlug(clones: CloneData[], slug: string): CloneData | null {
  return clones.find(clone => 
    clone.cloneId.current === slug || 
    clone.cloneName.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  ) || null;
}

/**
 * Extract clone ID from URL pathname
 */
function extractCloneIdFromUrl(pathname: string): string | null {
  const cloneRouteMatch = pathname.match(/^\/clone\/([^\/]+)/);
  return cloneRouteMatch ? cloneRouteMatch[1] : null;
}

/**
 * localStorage utilities with error handling
 */
const STORAGE_KEYS = {
  PREFERENCES: 'cloneContext_preferences',
  LAST_CLONE: 'cloneContext_lastClone',
  DEBUG_STATE: 'cloneContext_debugState',
} as const;

function getStoredPreferences(): ClonePreferences {
  try {
    if (typeof window === 'undefined') return initialState.preferences;
    
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!stored) return initialState.preferences;
    
    const parsed = JSON.parse(stored);
    return { ...initialState.preferences, ...parsed };
  } catch (error) {
    console.warn('[CloneContext] Failed to load preferences from localStorage:', error);
    return initialState.preferences;
  }
}

function setStoredPreferences(preferences: ClonePreferences): void {
  try {
    if (typeof window === 'undefined' || !preferences.rememberPreferences) return;
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.warn('[CloneContext] Failed to save preferences to localStorage:', error);
  }
}

function getStoredLastClone(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.LAST_CLONE);
  } catch (error) {
    console.warn('[CloneContext] Failed to load last clone from localStorage:', error);
    return null;
  }
}

function setStoredLastClone(cloneId: string | null): void {
  try {
    if (typeof window === 'undefined') return;
    
    if (cloneId) {
      localStorage.setItem(STORAGE_KEYS.LAST_CLONE, cloneId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.LAST_CLONE);
    }
  } catch (error) {
    console.warn('[CloneContext] Failed to save last clone to localStorage:', error);
  }
}

// ============================================================================
// CONTEXT PROVIDER
// ============================================================================

interface CloneProviderProps {
  children: ReactNode;
  initialCloneId?: string;
  enableUrlDetection?: boolean;
}

export function CloneProvider({ 
  children, 
  initialCloneId,
  enableUrlDetection = true 
}: CloneProviderProps) {
  const [state, dispatch] = useReducer(cloneReducer, {
    ...initialState,
    preferences: getStoredPreferences()
  });
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  const createError = useCallback((message: string, operation: string, code: string = 'UNKNOWN_ERROR'): CloneError => ({
    message,
    code,
    operation,
    timestamp: new Date()
  }), []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // ============================================================================
  // CORE CLONE OPERATIONS
  // ============================================================================

  const refreshClones = useCallback(async () => {
    dispatch({ type: 'SET_REFRESHING_STATE', payload: 'loading' });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const [clones, baseline] = await Promise.all([
        getAllClones(),
        getBaselineClone()
      ]);

      dispatch({ type: 'SET_AVAILABLE_CLONES', payload: clones });
      dispatch({ type: 'SET_BASELINE_CLONE', payload: baseline });
      dispatch({ type: 'SET_REFRESHING_STATE', payload: 'success' });

      console.log(`[CloneContext] Refreshed ${clones.length} clones, baseline: ${baseline?.cloneName || 'none'}`);
    } catch (error) {
      console.error('[CloneContext] Failed to refresh clones:', error);
      
      const cloneError = createError(
        error instanceof Error ? error.message : 'Failed to refresh clones',
        'refresh_clones',
        'REFRESH_ERROR'
      );
      
      dispatch({ type: 'SET_ERROR', payload: cloneError });
      dispatch({ type: 'SET_REFRESHING_STATE', payload: 'error' });
    }
  }, [createError]);

  const setCurrentCloneId = useCallback(async (cloneId: string | null) => {
    dispatch({ type: 'SET_SWITCHING_STATE', payload: 'loading' });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      let clone: CloneData | null = null;
      let sourceType: CloneContextState['sourceType'] = 'default';

      if (cloneId) {
        clone = await getCloneById(cloneId);
        sourceType = 'url';
        
        if (!clone) {
          throw new Error(`Clone with ID "${cloneId}" not found`);
        }
      } else {
        // Fall back to baseline if no clone specified
        clone = state.baselineClone;
        sourceType = 'default';
      }

      dispatch({ 
        type: 'SET_CURRENT_CLONE', 
        payload: { clone, sourceType }
      });
      
      // Store preference if enabled
      if (state.preferences.rememberPreferences) {
        setStoredLastClone(cloneId);
      }

      dispatch({ type: 'SET_SWITCHING_STATE', payload: 'success' });
      
      console.log(`[CloneContext] Set current clone: ${clone?.cloneName || 'default'} (${sourceType})`);
    } catch (error) {
      console.error('[CloneContext] Failed to set current clone:', error);
      
      const cloneError = createError(
        error instanceof Error ? error.message : 'Failed to set current clone',
        'set_current_clone',
        'SET_CLONE_ERROR'
      );
      
      dispatch({ type: 'SET_ERROR', payload: cloneError });
      dispatch({ type: 'SET_SWITCHING_STATE', payload: 'error' });
    }
  }, [state.baselineClone, state.preferences.rememberPreferences, createError]);

  const switchToClone = useCallback(async (cloneId: string) => {
    await setCurrentCloneId(cloneId);
    
    // Optionally navigate to clone-specific URL
    if (enableUrlDetection && !pathname.startsWith('/clone/')) {
      router.push(`/clone/${cloneId}${pathname}`);
    }
  }, [setCurrentCloneId, enableUrlDetection, pathname, router]);

  const switchToBaseline = useCallback(async () => {
    if (!state.baselineClone) {
      const error = createError('No baseline clone available', 'switch_to_baseline', 'NO_BASELINE');
      dispatch({ type: 'SET_ERROR', payload: error });
      return;
    }

    await setCurrentCloneId(state.baselineClone.cloneId.current);
  }, [state.baselineClone, setCurrentCloneId, createError]);

  const resetToDefault = useCallback(async () => {
    dispatch({ type: 'RESET_STATE' });
    
    // Clear localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.LAST_CLONE);
        localStorage.removeItem(STORAGE_KEYS.DEBUG_STATE);
      }
    } catch (error) {
      console.warn('[CloneContext] Failed to clear localStorage:', error);
    }

    // Reinitialize
    await refreshClones();
  }, [refreshClones]);

  // ============================================================================
  // PREFERENCES MANAGEMENT
  // ============================================================================

  const updatePreferences = useCallback((newPreferences: Partial<ClonePreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: newPreferences });
  }, []);

  // Update localStorage when preferences change
  useEffect(() => {
    setStoredPreferences(state.preferences);
  }, [state.preferences]);

  // ============================================================================
  // DEBUG UTILITIES
  // ============================================================================

  const enableDebugMode = useCallback(() => {
    updatePreferences({ debugMode: true });
    console.log('[CloneContext] Debug mode enabled');
  }, [updatePreferences]);

  const disableDebugMode = useCallback(() => {
    updatePreferences({ debugMode: false });
    console.log('[CloneContext] Debug mode disabled');
  }, [updatePreferences]);

  const exportState = useCallback((): string => {
    const exportData = {
      currentClone: state.currentClone,
      availableClones: state.availableClones,
      baselineClone: state.baselineClone,
      preferences: state.preferences,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  }, [state]);

  const importState = useCallback((stateJson: string) => {
    try {
      const importData = JSON.parse(stateJson);
      
      if (importData.currentClone) {
        dispatch({ 
          type: 'SET_CURRENT_CLONE', 
          payload: { clone: importData.currentClone, sourceType: 'url' }
        });
      }
      
      if (importData.availableClones) {
        dispatch({ type: 'SET_AVAILABLE_CLONES', payload: importData.availableClones });
      }
      
      if (importData.baselineClone) {
        dispatch({ type: 'SET_BASELINE_CLONE', payload: importData.baselineClone });
      }
      
      if (importData.preferences) {
        dispatch({ type: 'UPDATE_PREFERENCES', payload: importData.preferences });
      }
      
      console.log('[CloneContext] State imported successfully');
    } catch (error) {
      console.error('[CloneContext] Failed to import state:', error);
      const cloneError = createError(
        'Failed to import state: Invalid JSON format',
        'import_state',
        'IMPORT_ERROR'
      );
      dispatch({ type: 'SET_ERROR', payload: cloneError });
    }
  }, [createError]);

  // ============================================================================
  // URL DETECTION AND INITIALIZATION
  // ============================================================================

  // Initialize context on mount
  useEffect(() => {
    const initialize = async () => {
      dispatch({ type: 'SET_LOADING_STATE', payload: 'loading' });
      
      try {
        // Load available clones
        await refreshClones();
        
        // Determine initial clone based on priority:
        // 1. URL parameter (?clone=id)
        // 2. URL route (/clone/id)
        // 3. Initial prop
        // 4. localStorage preference
        // 5. Default/baseline
        
        let targetCloneId: string | null = null;
        let sourceType: CloneContextState['sourceType'] = 'default';
        
        // Check URL parameter
        const urlCloneParam = searchParams.get('clone');
        if (urlCloneParam) {
          targetCloneId = urlCloneParam;
          sourceType = 'url';
          console.log(`[CloneContext] Found clone in URL param: ${targetCloneId}`);
        }
        
        // Check URL route
        if (!targetCloneId && enableUrlDetection) {
          const routeCloneId = extractCloneIdFromUrl(pathname);
          if (routeCloneId) {
            targetCloneId = routeCloneId;
            sourceType = 'url';
            console.log(`[CloneContext] Found clone in URL route: ${targetCloneId}`);
          }
        }
        
        // Check initial prop
        if (!targetCloneId && initialCloneId) {
          targetCloneId = initialCloneId;
          sourceType = 'url';
          console.log(`[CloneContext] Using initial clone prop: ${targetCloneId}`);
        }
        
        // Check localStorage
        if (!targetCloneId && state.preferences.rememberPreferences) {
          const storedCloneId = getStoredLastClone();
          if (storedCloneId) {
            targetCloneId = storedCloneId;
            sourceType = 'localStorage';
            console.log(`[CloneContext] Found stored clone preference: ${targetCloneId}`);
          }
        }
        
        // Set the determined clone
        await setCurrentCloneId(targetCloneId);
        
        dispatch({ type: 'SET_LOADING_STATE', payload: 'success' });
        dispatch({ type: 'SET_INITIALIZED', payload: true });
        
        console.log(`[CloneContext] Initialized with clone: ${targetCloneId || 'default'} (${sourceType})`);
      } catch (error) {
        console.error('[CloneContext] Initialization failed:', error);
        
        const cloneError = createError(
          'Failed to initialize clone context',
          'initialization',
          'INIT_ERROR'
        );
        
        dispatch({ type: 'SET_ERROR', payload: cloneError });
        dispatch({ type: 'SET_LOADING_STATE', payload: 'error' });
      }
    };

    initialize();
  }, []); // Only run on mount

  // Watch for URL changes
  useEffect(() => {
    if (!enableUrlDetection || !state.isInitialized) return;
    
    const urlCloneParam = searchParams.get('clone');
    const routeCloneId = extractCloneIdFromUrl(pathname);
    const urlCloneId = urlCloneParam || routeCloneId;
    
    // Only update if URL clone differs from current clone
    const currentCloneId = state.currentClone?.cloneId.current;
    if (urlCloneId !== currentCloneId) {
      console.log(`[CloneContext] URL changed, switching to clone: ${urlCloneId || 'default'}`);
      setCurrentCloneId(urlCloneId);
    }
  }, [pathname, searchParams, enableUrlDetection, state.isInitialized, state.currentClone, setCurrentCloneId]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue: CloneContextValue = {
    // State
    ...state,
    
    // Actions
    setCurrentCloneId,
    switchToClone,
    switchToBaseline,
    refreshClones,
    clearError,
    updatePreferences,
    resetToDefault,
    
    // Debug Actions
    enableDebugMode,
    disableDebugMode,
    exportState,
    importState,
  };

  return (
    <CloneContext.Provider value={contextValue}>
      {children}
    </CloneContext.Provider>
  );
}

// ============================================================================
// HOOK FOR USING CONTEXT
// ============================================================================

export function useCloneContext(): CloneContextValue {
  const context = useContext(CloneContext);
  
  if (!context) {
    throw new Error('useCloneContext must be used within a CloneProvider');
  }
  
  return context;
}

// ============================================================================
// DEBUG COMPONENT
// ============================================================================

interface CloneDebugPanelProps {
  position?: 'top' | 'bottom' | 'floating';
  collapsed?: boolean;
}

export function CloneDebugPanel({ 
  position = 'bottom', 
  collapsed = true 
}: CloneDebugPanelProps) {
  const context = useCloneContext();
  
  // Only show in development when debug mode is enabled
  if (process.env.NODE_ENV !== 'development' || !context.preferences.debugMode) {
    return null;
  }

  const positionClasses = {
    top: 'fixed top-0 left-0 right-0 z-50',
    bottom: 'fixed bottom-0 left-0 right-0 z-50',
    floating: 'fixed bottom-4 right-4 z-50 max-w-md'
  };

  return (
    <div className={`${positionClasses[position]} bg-gray-900 text-white text-xs`}>
      <details defaultOpen={!collapsed}>
        <summary className="p-2 bg-purple-800 cursor-pointer hover:bg-purple-700 transition-colors">
          🐛 Clone Debug Panel - {context.currentClone?.cloneName || 'Default'} 
          {context.loadingState === 'loading' && ' (Loading...)'}
          {context.error && ' (Error!)'}
        </summary>
        
        <div className="p-3 space-y-3 max-h-96 overflow-auto">
          {/* Current State */}
          <div>
            <h4 className="font-semibold text-purple-300 mb-1">Current State</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Clone: {context.currentClone?.cloneName || 'None'}</div>
              <div>Source: {context.sourceType || 'Unknown'}</div>
              <div>Loading: {context.loadingState}</div>
              <div>Initialized: {context.isInitialized ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {/* Available Clones */}
          <div>
            <h4 className="font-semibold text-purple-300 mb-1">Available Clones ({context.availableClones.length})</h4>
            <div className="space-y-1">
              {context.availableClones.map(clone => (
                <div key={clone._id} className="flex items-center justify-between">
                  <span className={isCloneActive(clone, context.currentClone) ? 'text-green-300 font-medium' : ''}>
                    {clone.cloneName} ({clone.cloneId.current})
                  </span>
                  <button
                    onClick={() => context.switchToClone(clone.cloneId.current)}
                    className="px-1 py-0.5 bg-blue-600 hover:bg-blue-500 rounded text-xs transition-colors"
                    disabled={context.switchingState === 'loading'}
                  >
                    Switch
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="font-semibold text-purple-300 mb-1">Quick Actions</h4>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={context.refreshClones}
                className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs transition-colors"
                disabled={context.refreshingState === 'loading'}
              >
                Refresh
              </button>
              <button
                onClick={context.switchToBaseline}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs transition-colors"
                disabled={context.switchingState === 'loading'}
              >
                Baseline
              </button>
              <button
                onClick={context.resetToDefault}
                className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => console.log('[CloneDebug] State Export:', context.exportState())}
                className="px-2 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs transition-colors"
              >
                Export
              </button>
            </div>
          </div>

          {/* Error Display */}
          {context.error && (
            <div className="p-2 bg-red-800 rounded">
              <h4 className="font-semibold text-red-300 mb-1">Error</h4>
              <div className="text-xs">
                <div>Operation: {context.error.operation}</div>
                <div>Code: {context.error.code}</div>
                <div>Message: {context.error.message}</div>
                <div>Time: {context.error.timestamp.toLocaleTimeString()}</div>
              </div>
              <button
                onClick={context.clearError}
                className="mt-1 px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs transition-colors"
              >
                Clear Error
              </button>
            </div>
          )}

          {/* Preferences */}
          <div>
            <h4 className="font-semibold text-purple-300 mb-1">Preferences</h4>
            <div className="space-y-1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={context.preferences.autoSwitchEnabled}
                  onChange={(e) => context.updatePreferences({ autoSwitchEnabled: e.target.checked })}
                  className="w-3 h-3"
                />
                <span>Auto-switch enabled</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={context.preferences.rememberPreferences}
                  onChange={(e) => context.updatePreferences({ rememberPreferences: e.target.checked })}
                  className="w-3 h-3"
                />
                <span>Remember preferences</span>
              </label>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
} 