// The product catalog. This file is the single source of truth for what is
// for sale and at what price. The checkout API reads prices from here, never
// from the browser, so a customer cannot change what they pay.
//
// To add a product: copy an entry, give it a unique slug, set the price in
// cents (AUD), and drop its photos into /public/images.

export type Product = {
  slug: string;
  name: string;
  priceCents: number;
  category: 'Outerwear' | 'Tops' | 'Bottoms' | 'Accessories';
  sizes: string[];
  soldOutSizes?: string[];
  images: { src: string; alt: string }[];
  description: string;
  details: string[];
  featured?: boolean;
  // Background behind photos that don't fill the frame. Defaults to light grey.
  photoBg?: string;
  active: boolean;
};

// Product photos are served from the store's Shopify CDN.
// Before closing the Shopify store, download them into /public/images and
// change these paths, or the photos will stop loading.
const CDN = 'https://cdn.shopify.com/s/files/1/0860/4270/5985/files/';

export const CURRENCY = 'aud';
export const MAX_QTY_PER_LINE = 10;

export const products: Product[] = [
  {
    slug: 'overthrown-windbreaker',
    name: 'Overthrown windbreaker',
    priceCents: 13000,
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      { src: CDN + 'IMG_1793.jpg?v=1794141682', alt: 'BALE Overthrown windbreaker, front' },
      { src: CDN + 'IMG_1796.jpg?v=1794141682', alt: 'BALE Overthrown windbreaker, back' },
      { src: CDN + 'Photoroom_20261108_195345.jpg?v=1794141683', alt: 'BALE Overthrown windbreaker, detail' },
    ],
    description:
      'Full-zip hooded windbreaker with an all-over classical painting print and the BALE mark on the chest.',
    details: ['Full zip with hood', 'All-over print', 'BALE chest logo'],
    featured: true,
    photoBg: '#000000',
    active: true,
  },
  {
    slug: 't-shirt',
    name: 'T-shirt',
    priceCents: 4000,
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      { src: CDN + 'Photoroom_20261108_200243.jpg?v=1794143311', alt: 'BALE t-shirt, front' },
      { src: CDN + 'Photoroom_20261108_200349.jpg?v=1794143311', alt: 'BALE t-shirt, back' },
    ],
    description: 'Heavyweight BALE tee with a front graphic print.',
    details: ['Crew neck', 'Front graphic'],
    active: true,
  },
  {
    slug: 'sweat-shorts',
    name: 'Sweat shorts',
    priceCents: 4000,
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      { src: CDN + 'Photoroom_20261108_200843.jpg?v=1794140944', alt: 'BALE sweat shorts, front' },
      { src: CDN + 'Photoroom_20261108_200924.jpg?v=1794140944', alt: 'BALE sweat shorts, back' },
      { src: CDN + 'Photoroom_20261108_201004.jpg?v=1794140944', alt: 'BALE sweat shorts, detail' },
    ],
    description: 'BALE sweat shorts with an elastic waist.',
    details: ['Elastic waist', 'Side pockets'],
    active: true,
  },
  {
    slug: 'beanie',
    name: 'Beanie',
    priceCents: 4000,
    category: 'Accessories',
    sizes: ['One size'],
    images: [
      { src: CDN + '4FF8405D-AA68-40EE-96A2-B508DC30FD64.png?v=1794140608', alt: 'BALE beanie, front with BALE lettering' },
      { src: CDN + 'Photoroom_20261108_200058.jpg?v=1794140608', alt: 'BALE beanie, back' },
    ],
    description: 'Knit beanie with the BALE mark.',
    details: ['One size fits most'],
    active: true,
  },
  {
    slug: 'vest',
    name: 'Vest',
    priceCents: 2000,
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      { src: CDN + 'Photoroom_20261108_200429.jpg?v=1794141541', alt: 'BALE vest, front' },
      { src: CDN + 'Photoroom_20261108_200509.jpg?v=1794141541', alt: 'BALE vest, back' },
    ],
    description: 'White sleeveless vest with the BALE logo on the front.',
    details: ['Sleeveless', 'Front logo print'],
    active: true,
  },
];

export function getActiveProducts(): Product[] {
  return products.filter((p) => p.active);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.active);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
