import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Keep preview and test-mode deployments out of search engines.
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (!key || key.startsWith('sk_test_')) return { rules: { userAgent: '*', disallow: '/' } };
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || 'http://localhost:3000').replace(/\/$/, '');
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/checkout/', '/cart'] },
    sitemap: `${base}/sitemap.xml`,
  };
}
