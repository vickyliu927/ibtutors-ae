/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images using Next.js Image component
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configure redirects if needed
  async redirects() {
    return []
  },

  // Configure rewrites if needed
  async rewrites() {
    return []
  },

  // Configure headers if needed
  async headers() {
    return []
  },

  // Add CSS optimization to reduce render-blocking resources
  experimental: {
    optimizeCss: true,
  },

  // Customize webpack configuration if needed
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom webpack configurations here if needed
    return config
  },
}

module.exports = nextConfig 