import { MetadataRoute } from 'next'

// Add explicit content type to ensure proper rendering
export const contentType = 'text/plain';

export default function robots(): MetadataRoute.Robots {
  // Use the production URL directly instead of env variable
  const baseUrl = 'https://www.dubaitutors.ae';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`, // No double slashes, ensuring correct format
  }
} 