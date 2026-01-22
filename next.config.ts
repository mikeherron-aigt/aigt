import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.builder.io',
      },
      {
        protocol: 'https',
        hostname: 'api.builder.io',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
    ],
  },
  redirects: async () => [
    {
      source: '/eaf',
      destination: '/ethereum-art-fund',
      permanent: false,
    },
    {
      source: '/bcaf',
      destination: '/blue-chip-art-fund',
      permanent: false,
    },
  ],
};

export default nextConfig;
