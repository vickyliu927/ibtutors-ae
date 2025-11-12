import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Single client configuration that works for both preview and production
// Avoid including tokens in the browser bundle to prevent CORS/auth issues
const isServer = typeof window === 'undefined'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Use CDN in the browser; server may use CDN too for speed, but token allows private reads
  useCdn: true,
  perspective: 'published',
  stega: { enabled: false },
  token: isServer ? process.env.SANITY_API_TOKEN : undefined,
})

// Create a preview client with write access
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Preview client should still not use CDN to ensure latest drafts
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN
})
