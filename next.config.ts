import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Production-ready config options */
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.elemotor.co',
      },
    ],
  },
};

export default nextConfig;
