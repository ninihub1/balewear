import type { MetadataRoute } from 'next';
import { getActiveProducts } from '@/lib/products';
import { infoPages } from '@/lib/pages';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  return [
    { url: `${base}/` },
    { url: `${base}/shop` },
    ...getActiveProducts().map((p) => ({ url: `${base}/products/${p.slug}` })),
    ...Object.keys(infoPages).map((slug) => ({ url: `${base}/info/${slug}` })),
  ];
}
