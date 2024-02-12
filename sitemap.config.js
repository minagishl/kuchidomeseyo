const url = new URL(
  process.env.URL || process.env.VERCEL_URL || process.env.CF_PAGES_URL || 'http://localhost:3000'
);

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: url,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
};
