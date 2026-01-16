/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || 'https://artinvestmentgrouptrust.com',
  generateRobotsTxt: false, // We're using a manual robots.txt
  sitemapSize: 50000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/api/*',
    '/request-access/thank-you',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    ],
  },
  additionalPaths: async (config) => {
    return [
      {
        loc: '/',
        changefreq: 'weekly',
        priority: 1,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/about',
        changefreq: 'monthly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/request-access',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/privacy',
        changefreq: 'yearly',
        priority: 0.5,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/terms',
        changefreq: 'yearly',
        priority: 0.5,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/disclosures',
        changefreq: 'yearly',
        priority: 0.5,
        lastmod: new Date().toISOString(),
      },
    ];
  },
};

module.exports = config;
