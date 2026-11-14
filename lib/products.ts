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

const P = '/images/products/';

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
      { src: P + 'windbreaker-1.jpg', alt: 'Overthrown windbreaker, front, laid flat' },
      { src: P + 'windbreaker-2.jpg', alt: 'Overthrown windbreaker, back' },
      { src: P + 'windbreaker-3.jpg', alt: 'Overthrown windbreaker, front on black' },
      { src: P + 'windbreaker-4.jpg', alt: 'Overthrown windbreaker, front on grey' },
    ],
    description:
      'Full-zip hooded windbreaker in bright blue, with a classical painting printed across the body and sleeves.',
    details: ['Full zip with adjustable hood', 'All-over painting print', 'Drawcord hem', 'Elastic cuffs'],
    featured: true,
    active: true,
  },
  {
    slug: 't-shirt',
    name: 'Future T-shirt',
    priceCents: 4000,
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      { src: P + 'tshirt-1.jpg', alt: 'Black Future T-shirt, front graphic' },
      { src: P + 'tshirt-2.jpg', alt: 'Black Future T-shirt, plain back' },
    ],
    description: 'Heavyweight black tee with the Future graphic on the front and the BALE mark at the hem.',
    details: ['Boxy fit', 'Crew neck', 'Front graphic print'],
    active: true,
  },
  {
    slug: 'sweat-shorts-yellow',
    name: 'Sweat shorts · Yellow',
    priceCents: 4000,
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      { src: P + 'shorts-yellow-1.jpg', alt: 'Yellow washed sweat shorts, front' },
      { src: P + 'shorts-yellow-2.jpg', alt: 'Yellow sweat shorts, back' },
    ],
    description: 'Washed yellow sweat shorts with raw hems and the BALE mark on the leg.',
    details: ['Elastic drawstring waist', 'Side pockets and back pocket', 'Raw-cut hem'],
    active: true,
  },
  {
    slug: 'sweat-shorts-blue',
    name: 'Sweat shorts · Blue',
    priceCents: 4000,
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [{ src: P + 'shorts-blue-1.jpg', alt: 'Blue washed sweat shorts, front' }],
    description: 'Washed blue sweat shorts with raw hems and the BALE mark on the leg.',
    details: ['Elastic drawstring waist', 'Side pockets', 'Raw-cut hem'],
    active: true,
  },
  {
    slug: 'sweat-shorts-grey',
    name: 'Distressed sweat shorts · Grey',
    priceCents: 4000,
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      { src: P + 'shorts-grey-1.jpg', alt: 'Grey distressed sweat shorts, front' },
      { src: P + 'shorts-grey-2.jpg', alt: 'Grey distressed sweat shorts, back' },
    ],
    description: 'Grey sweat shorts with hand-distressed rips and a tonal BALE mark on the leg.',
    details: ['Elastic waist', 'Distressed finish', 'Raw-cut hem'],
    active: true,
  },
  {
    slug: 'beanie',
    name: 'Sun beanie',
    priceCents: 4000,
    category: 'Accessories',
    sizes: ['One size'],
    images: [
      { src: P + 'beanie-1.jpg', alt: 'Tan knit beanie with sun pattern and BALE lettering' },
      { src: P + 'beanie-2.jpg', alt: 'Back of the sun beanie' },
    ],
    description: 'Tan jacquard-knit beanie with an all-over sun pattern and BALE lettering on the front.',
    details: ['Jacquard knit', 'One size fits most'],
    active: true,
  },
  {
    slug: 'vest',
    name: 'Vest · Red',
    priceCents: 2000,
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      { src: P + 'vest-1.jpg', alt: 'Red vest with white star print' },
      { src: P + 'vest-2.jpg', alt: 'Red vest with the BALE mark' },
    ],
    description: 'Red sleeveless vest with a white star on one side and the BALE mark on the other.',
    details: ['Sleeveless', 'Screen-printed graphics'],
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
