import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemaTypes'
import { structure } from './deskStructure'
import { visionTool } from '@sanity/vision'

export default defineConfig({
  name: 'default',
  title: 'IB Tutors UAE',
  
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
    allowOrigins: ['http://localhost:3000'],
    allowCredentials: true,
  }
}) 