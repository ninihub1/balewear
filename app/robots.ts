import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Keep preview deployments out of search engines.
  if (!process.env.STRIPE_SECRET_KEY) return { rules: { userAgent: '*', disallow: '/' } };
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/checkout/', '/cart'] },
    sitemap: `${base}/sitemap.xml`,
  };
}
