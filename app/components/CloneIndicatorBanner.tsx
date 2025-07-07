'use client';

import React, { useState } from 'react';
import { CloneIndicatorProps } from '../lib/clonePageUtils';

interface CloneIndicatorBannerProps extends CloneIndicatorProps {
  showByDefault?: boolean;
  position?: 'top' | 'bottom';
}

/**
 * Clone Indicator Banner - Development/Testing Component
 * Shows clone context, content sources, and debug information
 */
export default function CloneIndicatorBanner({
  cloneContext,
  cloneData,
  debugInfo,
  pageName,
  showByDefault = false,
  position = 'top'
}: CloneIndicatorBannerProps) {
  const [isExpanded, setIsExpanded] = useState(showByDefault);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getSourceColor = (source: string | null) => {
    switch (source) {
      case 'cloneSpecific': return 'text-green-600 bg-green-50';
      case 'baseline': return 'text-blue-600 bg-blue-50';
      case 'default': return 'text-gray-600 bg-gray-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  const getCloneStatusColor = () => {
    if (cloneContext.error) return 'bg-red-50 border-red-200';
    if (cloneContext.cloneId) return 'bg-green-50 border-green-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getCloneStatusText = () => {
    if (cloneContext.error) return `❌ Error: ${cloneContext.error}`;
    if (cloneContext.cloneId) {
      const clone = cloneContext.clone;
      return `🎯 ${clone?.cloneName || 'Unknown Clone'} ${cloneContext.isBaseline ? '(Baseline)' : ''}`;
    }
    return '🌐 No Clone (Default)';
  };

  const cloneInfo = cloneContext.clone;

  return (
    <div className={`${getCloneStatusColor()} border-b p-2 ${position === 'bottom' ? 'border-t border-b-0' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <details open={isExpanded} onToggle={(e) => setIsExpanded((e.target as HTMLDetailsElement).open)}>
          <summary className="font-medium text-sm cursor-pointer flex items-center justify-between hover:opacity-80 transition-opacity">
            <span>
              🔧 {pageName} Clone Debug: {getCloneStatusText()}
            </span>
            <span className="text-xs opacity-70">
              Source: {cloneContext.source} | {isExpanded ? 'Click to collapse' : 'Click for details'}
            </span>
          </summary>
          
          <div className="mt-3 p-4 bg-white rounded-lg border text-xs space-y-4">
            {/* Clone Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-gray-800">🏢 Clone Information</h4>
                <div className="space-y-1">
                  <p><span className="font-medium">ID:</span> {cloneInfo?.cloneId?.current || 'N/A'}</p>
                  <p><span className="font-medium">Name:</span> {cloneInfo?.cloneName || 'N/A'}</p>
                  <p><span className="font-medium">Status:</span> {cloneInfo?.isActive ? '✅ Active' : '❌ Inactive'}</p>
                  <p><span className="font-medium">Type:</span> {cloneContext.isBaseline ? '📋 Baseline' : '🎯 Clone'}</p>
                  <p><span className="font-medium">Source:</span> {cloneContext.source}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-gray-800">🌐 Domain & Region</h4>
                <div className="space-y-1">
                  <p><span className="font-medium">Domains:</span></p>
                  <div className="pl-2">
                    {cloneInfo?.metadata?.domains?.map((domain: string, index: number) => (
                      <p key={index} className="text-blue-600">• {domain}</p>
                    )) || <p className="text-gray-500">No domains configured</p>}
                  </div>
                  <p><span className="font-medium">Region:</span> {cloneInfo?.metadata?.region || 'N/A'}</p>
                  <p><span className="font-medium">Audience:</span> {cloneInfo?.metadata?.targetAudience || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-gray-800">🔍 Request Context</h4>
                <div className="space-y-1">
                  <p><span className="font-medium">Host:</span> {debugInfo?.requestHeaders?.host || 'N/A'}</p>
                  <p><span className="font-medium">Clone Header:</span> {debugInfo?.requestHeaders?.['x-clone-id'] || 'none'}</p>
                  <p><span className="font-medium">URL Params:</span></p>
                  <div className="pl-2">
                    {debugInfo?.urlParams && Object.keys(debugInfo.urlParams).length > 0 ? (
                      Object.entries(debugInfo.urlParams).map(([key, value]) => (
                        <p key={key} className="text-purple-600">• {key}: {value}</p>
                      ))
                    ) : (
                      <p className="text-gray-500">No URL parameters</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sources */}
            {cloneData && (
              <div>
                <h4 className="font-semibold mb-2 text-gray-800">📦 Content Sources</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {debugInfo?.contentSources && Object.entries(debugInfo.contentSources).map(([component, source]) => (
                    <div key={component} className={`px-2 py-1 rounded text-xs ${getSourceColor(source)}`}>
                      <div className="font-medium">{component}</div>
                      <div className="opacity-80">{source || 'none'}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <span className="inline-block w-3 h-3 bg-green-200 rounded mr-1"></span>Clone-specific
                  <span className="inline-block w-3 h-3 bg-blue-200 rounded mr-1 ml-3"></span>Baseline
                  <span className="inline-block w-3 h-3 bg-gray-200 rounded mr-1 ml-3"></span>Default
                  <span className="inline-block w-3 h-3 bg-red-200 rounded mr-1 ml-3"></span>Not found
                </div>
              </div>
            )}

            {/* Error Information */}
            {cloneContext.error && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <h4 className="font-semibold mb-1 text-red-800">⚠️ Error Details</h4>
                <p className="text-red-700">{cloneContext.error}</p>
              </div>
            )}

            {/* Testing Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <h4 className="font-semibold mb-2 text-yellow-800">🧪 Testing Instructions</h4>
              <div className="text-yellow-700 space-y-1">
                <p><span className="font-medium">Test with URL parameter:</span> Add <code className="bg-yellow-100 px-1 rounded">?clone=abu-dhabi</code> to URL</p>
                <p><span className="font-medium">Test with domain mapping:</span> Configure domains in Sanity clone settings</p>
                <p><span className="font-medium">Test middleware headers:</span> Check Network tab for x-clone-* headers</p>
                <p><span className="font-medium">Clear cache:</span> Add <code className="bg-yellow-100 px-1 rounded">?refresh=1</code> to bypass cache</p>
              </div>
            </div>

            {/* Performance & Timestamp */}
            {debugInfo?.timestamp && (
              <div className="text-right text-gray-500 text-xs border-t pt-2">
                Generated at: {new Date(debugInfo.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
} 