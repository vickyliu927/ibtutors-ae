'use client';

import React, { useState } from 'react';
import { useCloneContext, isCloneActive } from '../contexts/CloneContext';

interface CloneSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'compact';
  showDebugInfo?: boolean;
  className?: string;
}

/**
 * Clone Switcher Component - Allows users to switch between clones
 * Demonstrates practical usage of the CloneContext
 */
export default function CloneSwitcher({ 
  variant = 'dropdown',
  showDebugInfo = false,
  className = ''
}: CloneSwitcherProps) {
  const {
    currentClone,
    availableClones,
    baselineClone,
    switchToClone,
    switchToBaseline,
    refreshClones,
    loadingState,
    switchingState,
    error,
    preferences,
    enableDebugMode,
    disableDebugMode
  } = useCloneContext();

  const [isOpen, setIsOpen] = useState(false);

  // Don't render if no clones available or still loading initial data
  if (loadingState === 'loading' || availableClones.length === 0) {
    return (
      <div className={`p-2 text-sm text-gray-500 ${className}`}>
        {loadingState === 'loading' ? 'Loading clones...' : 'No clones available'}
      </div>
    );
  }

  const handleCloneSwitch = async (cloneId: string) => {
    setIsOpen(false);
    await switchToClone(cloneId);
  };

  const handleBaselineSwitch = async () => {
    setIsOpen(false);
    await switchToBaseline();
  };

  // Dropdown Variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={switchingState === 'loading'}
          className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        >
          <span>
            {switchingState === 'loading' ? 'Switching...' : (currentClone?.cloneName || 'Default')}
          </span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="py-1">
              {/* Baseline Option */}
              {baselineClone && (
                <button
                  onClick={handleBaselineSwitch}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    isCloneActive(baselineClone, currentClone) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  📋 {baselineClone.cloneName} (Baseline)
                </button>
              )}

              {/* Available Clones */}
              {availableClones.filter(clone => !clone.baselineClone).map((clone) => (
                <button
                  key={clone._id}
                  onClick={() => handleCloneSwitch(clone.cloneId.current)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    isCloneActive(clone, currentClone) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  🎯 {clone.cloneName}
                  <div className="text-xs text-gray-500">
                    {clone.metadata.region} • {clone.metadata.domains.join(', ')}
                  </div>
                </button>
              ))}

              <hr className="my-1" />
              
              {/* Utility Actions */}
              <button
                onClick={refreshClones}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                🔄 Refresh Clones
              </button>

              {/* Debug Toggle */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={preferences.debugMode ? disableDebugMode : enableDebugMode}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {preferences.debugMode ? '🐛 Disable Debug' : '🔧 Enable Debug'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Click outside to close */}
        {isOpen && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  // Buttons Variant
  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {/* Baseline Button */}
        {baselineClone && (
          <button
            onClick={handleBaselineSwitch}
            disabled={switchingState === 'loading'}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
              isCloneActive(baselineClone, currentClone)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📋 {baselineClone.cloneName}
          </button>
        )}

        {/* Clone Buttons */}
        {availableClones.filter(clone => !clone.baselineClone).map((clone) => (
          <button
            key={clone._id}
            onClick={() => handleCloneSwitch(clone.cloneId.current)}
            disabled={switchingState === 'loading'}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
              isCloneActive(clone, currentClone)
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🎯 {clone.cloneName}
          </button>
        ))}
      </div>
    );
  }

  // Compact Variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 text-sm ${className}`}>
        <span className="text-gray-600">Clone:</span>
        <select
          value={currentClone?.cloneId.current || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'baseline' && baselineClone) {
              handleBaselineSwitch();
            } else if (value) {
              handleCloneSwitch(value);
            }
          }}
          disabled={switchingState === 'loading'}
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">Default</option>
          {baselineClone && (
            <option value="baseline">📋 {baselineClone.cloneName}</option>
          )}
          {availableClones.filter(clone => !clone.baselineClone).map((clone) => (
            <option key={clone._id} value={clone.cloneId.current}>
              🎯 {clone.cloneName}
            </option>
          ))}
        </select>
        
        {switchingState === 'loading' && (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        )}
      </div>
    );
  }

  return null;
}

// ============================================================================
// DEBUG INFO COMPONENT
// ============================================================================

export function CloneSwitcherDebugInfo() {
  const context = useCloneContext();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
      <h4 className="font-semibold mb-2">Clone Context Debug Info</h4>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <strong>Current Clone:</strong> {context.currentClone?.cloneName || 'None'}
        </div>
        <div>
          <strong>Source:</strong> {context.sourceType || 'Unknown'}
        </div>
        <div>
          <strong>Available:</strong> {context.availableClones.length}
        </div>
        <div>
          <strong>Loading:</strong> {context.loadingState}
        </div>
        <div>
          <strong>Switching:</strong> {context.switchingState}
        </div>
        <div>
          <strong>Initialized:</strong> {context.isInitialized ? 'Yes' : 'No'}
        </div>
      </div>
      
      {context.error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {context.error.message}
        </div>
      )}

      <div className="mt-2 flex space-x-2">
        <button
          onClick={context.refreshClones}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Refresh
        </button>
        <button
          onClick={() => console.log('Clone Context State:', context.exportState())}
          className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
        >
          Export State
        </button>
        <button
          onClick={context.preferences.debugMode ? context.disableDebugMode : context.enableDebugMode}
          className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
        >
          {context.preferences.debugMode ? 'Disable' : 'Enable'} Debug
        </button>
      </div>
    </div>
  );
} 