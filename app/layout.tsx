import type { Metadata, Viewport } from 'next';
import { Archivo_Black, Inter } from 'next/font/google';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { formatPrice } from '@/lib/products';
import { shippingConfig } from '@/lib/shipping';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const archivo = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'BALE | Built for the streets', template: '%s | BALE' },
  description: 'BALE streetwear: heavyweight pieces and art-print outerwear. Shop online, prices in AUD.',
  icons: { icon: '/images/logo.jpg', apple: '/images/logo.jpg' },
  openGraph: {
    title: 'BALE | Built for the streets',
    description: 'Heavyweight streetwear and art-print outerwear.',
    images: ['/images/wind_worn.jpg'],
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#0B0B0B' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { freeThresholdCents } = shippingConfig();
  const banner =
    freeThresholdCents > 0
      ? `Free shipping Australia-wide on orders over ${formatPrice(freeThresholdCents)}`
      : null;

  return (
    <html lang="en-AU" className={`${inter.variable} ${archivo.variable}`}>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <CartProvider>
          <Header banner={banner} />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
