import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Single client configuration that works for both preview and production
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Enable CDN for improved performance and reduced API calls
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
  useCdn: false, // Preview client should still not use CDN to ensure latest drafts
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN
})
