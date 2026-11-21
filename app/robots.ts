import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  // Keep preview and test-mode deployments out of search engines.
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (!key || key.startsWith('sk_test_')) return { rules: { userAgent: '*', disallow: '/' } };
  const base = getSiteUrl();
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/checkout/', '/cart'] },
    sitemap: `${base}/sitemap.xml`,
  };
}
