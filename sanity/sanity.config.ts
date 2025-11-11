import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemaTypes'
import { structure } from './deskStructure'
import { visionTool } from '@sanity/vision'

export default defineConfig({
  name: 'default',
  title: 'Dubai Tutors',
  
  projectId: 'r689038t',
  dataset: 'production',
  basePath: '/studio',
  
  plugins: [
    deskTool({
      structure
    }),
    visionTool()
  ],
  
  schema: {
    types: schemaTypes,
  },

  cors: {
    allowOrigins: [
      'http://localhost:3000',
      'https://dubai-tutors.vercel.app',
      'https://dubai-tutors-*.vercel.app',
      'https://dubaitutors.ae',
      'https://www.dubaitutors.ae',
      'https://onlinetutors.qa',
      'https://www.onlinetutors.qa'
    ],
    allowCredentials: true,
  }
})
// redeploy: no-op change to trigger Studio rebuild