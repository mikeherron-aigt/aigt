import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.builder.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.builder.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.artigt.com",
        pathname: "/**",
      },
    ],
  },

  redirects: async () => [
    {
      source: "/eaf",
      destination: "/ethereum-art-fund",
      permanent: false,
    },
    {
      source: "/bcaf",
      destination: "/blue-chip-art-fund",
      permanent: false,
    },
  ],

  productionBrowserSourceMaps: false,

  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
