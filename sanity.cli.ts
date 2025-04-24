/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({ 
  api: { 
    projectId, 
    dataset 
  },
  cors: {
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://ibtutors-ae.vercel.app',
      'https://ibtutorsae.com',
      'https://*.vercel.app'
    ]
  }
})
