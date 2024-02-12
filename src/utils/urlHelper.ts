export function getHostedUrl(): string {
  return process.env.URL || process.env.VERCEL_URL || process.env.CF_PAGES_URL || 'http://localhost:3000';
}
