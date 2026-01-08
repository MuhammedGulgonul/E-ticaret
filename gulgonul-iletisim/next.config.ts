import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Allow larger uploads for multiple images
    },
  },
  images: {
    remotePatterns: [],
    unoptimized: true, // For local images
  },
};

export default nextConfig;
