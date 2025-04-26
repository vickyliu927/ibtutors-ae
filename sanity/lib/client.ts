import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false to force fetching fresh data from Sanity
  token: process.env.SANITY_API_TOKEN,
})
