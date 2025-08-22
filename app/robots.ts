import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dubaitutors.ae';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/*',
        '/studio/*',
        '/_next/*',
        '/admin/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 