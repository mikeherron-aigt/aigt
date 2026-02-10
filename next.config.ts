import type { NextConfig } from "next";

// Disable image optimization on Netlify to avoid 403 errors on deploy previews
// Netlify's Image Optimization is only available on paid plans for deploy previews
const isNetlify = process.env.NETLIFY === "true";

const nextConfig: NextConfig = {
  images: {
    unoptimized: isNetlify,
    formats: ["image/webp"],
    minimumCacheTTL: 86400,
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
      {
        protocol: "https",
        hostname: "art.artigt.com",
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
