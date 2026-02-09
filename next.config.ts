import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.builder.io" },
      { protocol: "https", hostname: "api.builder.io" },
      { protocol: "https", hostname: "media.licdn.com" },
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

  /**
   * CSP issue fix:
   * - Prevents eval-based source maps / tooling in production bundles.
   * - Helps strict CSP sites where 'unsafe-eval' is not allowed.
   */
  productionBrowserSourceMaps: false,

  webpack: (config, { dev }) => {
    if (!dev) {
      // safest for strict CSP (no eval / no prod source maps)
      config.devtool = false;
      // If you prefer keeping sourcemaps, use:
      // config.devtool = "source-map";
    }
    return config;
  },
};

export default nextConfig;
