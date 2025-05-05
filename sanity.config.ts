'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/deskStructure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'

export default defineConfig({
  name: 'default',
  title: 'IB Tutors UAE',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  basePath: '/studio',

  plugins: [
    deskTool({
      structure
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  cors: {
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3333',
      'https://ibtutors-ae.vercel.app',
      'https://ibtutorsae.com',
      'https://*.vercel.app',
      'https://ibtutorsae-c4ingsmn1-vicky-lius-projects.vercel.app',
      'https://ibtutorsae.vercel.app'
    ]
  },
  api: {
    projectId,
    dataset,
  }
})
