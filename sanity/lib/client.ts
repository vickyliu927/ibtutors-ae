import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Single client configuration that works for both preview and production
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN to ensure we're always getting fresh data
  perspective: 'published',
  stega: {
    enabled: false
  },
  token: process.env.SANITY_API_TOKEN
})

// Create a preview client with write access
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN
})
