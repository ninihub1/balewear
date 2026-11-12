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
  active: boolean;
};

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
      { src: '/images/wind_worn.jpg', alt: 'BALE Overthrown windbreaker worn with the hood up' },
    ],
    description:
      'Full-zip hooded windbreaker with an all-over classical painting print and the BALE mark on the chest.',
    details: ['Full zip with hood', 'All-over print', 'BALE chest logo'],
    featured: true,
    active: true,
  },
  {
    slug: 't-shirt',
    name: 'T-shirt',
    priceCents: 4000,
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [{ src: '/images/skate.jpg', alt: 'Two people wearing BALE t-shirts at a skatepark' }],
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
    images: [{ src: '/images/sit.jpg', alt: 'BALE sweat shorts worn with a BALE tee' }],
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
    images: [{ src: '/images/logo.jpg', alt: 'BALE logo' }],
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
    images: [{ src: '/images/vest.jpg', alt: 'White BALE vest on a clothing rail' }],
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
