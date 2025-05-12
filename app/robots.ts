import { MetadataRoute } from 'next'

// Add explicit content type to ensure proper rendering
export const contentType = 'text/plain';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibtutors-ae.vercel.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 