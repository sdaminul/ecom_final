import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Server-side rendering optimizations
  experimental: {
    // Add any experimental features if needed
  }
};

export default nextConfig;
