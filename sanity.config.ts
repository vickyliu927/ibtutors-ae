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
  title: 'Location Pages',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  basePath: '/studio',

  plugins: [
    deskTool({
      structure: structure as any
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => {
      const typesNeedingCloneRef = [
        'navbarSettings',
        'hero',
        'highlightsSection',
        'tutorProfilesSection',
        'trustedInstitutionsBanner',
        'subjectGridSection',
        'advertBlockSection',
        'platformBanner',
        'testimonialSection',
        'footerSection',
        'blogPost',
        'blogCategory',
        'blogAuthor',
        'subjectHeroSection',
        'subjectPage',
        'curriculumHeroSection',
        'curriculumPage',
        'contactFormContent',
        'tutor',
        'testimonial',
        'faq',
      ]

      const cloneTemplates = typesNeedingCloneRef.map((schemaType) => ({
        id: `${schemaType}-by-clone`,
        title: `${schemaType} (by clone)`,
        schemaType,
        parameters: [{ name: 'cloneId', type: 'string' }],
        value: (params: { cloneId?: string }) =>
          params?.cloneId
            ? {
                cloneReference: {
                  _type: 'reference',
                  _ref: params.cloneId,
                },
              }
            : {},
      }))

      const faqSectionTemplate = {
        id: 'faq_section-by-clone',
        title: 'FAQ Section (by clone)',
        schemaType: 'faq_section',
        parameters: [
          { name: 'cloneId', type: 'string' },
          { name: 'pageType', type: 'string' },
        ],
        value: (params: { cloneId?: string; pageType?: string }) => ({
          ...(params?.cloneId
            ? {
                cloneReference: {
                  _type: 'reference',
                  _ref: params.cloneId,
                },
              }
            : {}),
          ...(params?.pageType ? { pageType: params.pageType } : {}),
        }),
      }

      return prev.concat([...cloneTemplates, faqSectionTemplate])
    },
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
      'https://ibtutorsae.vercel.app',
      'https://dubai-tutors.vercel.app',
      'https://dubai-tutors-*.vercel.app',
      'https://dubaitutors.ae',
      'https://www.dubaitutors.ae',
      'https://onlinetutors.qa',
      'https://www.onlinetutors.qa'
    ]
  },
  api: {
    projectId,
    dataset,
  }
})
