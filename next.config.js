/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static export for better Vercel performance
  output: 'standalone',
  
  // Optimize for Vercel deployment
  experimental: {
    appDir: false // Use pages directory
  },
  
  // Handle external dependencies
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle html2canvas properly
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    return config;
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'USF_BUAN_PLANNER',
    DEPLOYMENT_URL: process.env.VERCEL_URL || 'localhost:3000'
  },
  
  // Headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
