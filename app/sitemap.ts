import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';
import { getActiveProducts } from '@/lib/products';
import { infoPages } from '@/lib/pages';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: `${base}/` },
    { url: `${base}/shop` },
    ...getActiveProducts().map((p) => ({ url: `${base}/products/${p.slug}` })),
    ...Object.keys(infoPages).map((slug) => ({ url: `${base}/info/${slug}` })),
  ];
}
