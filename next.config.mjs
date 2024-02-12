import { setupDevBindings } from '@cloudflare/next-on-pages/next-dev';
const url = process.env.URL || process.env.VERCEL_URL || process.env.CF_PAGES_URL || 'http://localhost:3000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Headers
  async headers() {
    const headers = [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: url },
        ],
      },
      {
        source: '/_next/static/css/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: url },
        ],
      },
    ];

    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
      headers.push({
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src https: data: 'unsafe-inline' 'unsafe-eval'" },
        ],
      });
    }

    return headers;
  },
};

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/8e93067/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevBindings({
    bindings: {
      // Add here the Cloudflare Bindings you want to have available during local development,
      // for more details on Bindings see: https://developers.cloudflare.com/pages/functions/bindings/)
      //
      // KV Example:
      // MY_KV: {
      //   type: 'kv',
      //   id: 'xxx',
      // }
    },
  });
}

export default nextConfig;
