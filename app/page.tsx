import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { formatPrice, getActiveProducts, getProduct } from '@/lib/products';
import { shippingConfig } from '@/lib/shipping';

// Pieces shot on models lead the page; everything else sits in the rail below.
const SPOTLIGHT = ['windbreaker-blue', 'down-undr-jersey'];

const LOOKBOOK = [
  { src: '/images/lookbook/cap-hood.jpg', alt: 'Model pulling up the hood of the blue Crown windbreaker' },
  { src: '/images/lookbook/jersey-umbrella.jpg', alt: 'Model in the Down Undr jersey and bandana' },
  { src: '/images/lookbook/hood.jpg', alt: 'Blue Crown windbreaker with the hood up' },
  { src: '/images/lookbook/cap-smile.jpg', alt: 'Model smiling in the blue Crown windbreaker and a cap' },
];

export default function HomePage() {
  const products = getActiveProducts();
  const spotlight = SPOTLIGHT.map((s) => getProduct(s)).filter((p): p is NonNullable<typeof p> => !!p);
  const rail = products.filter((p) => !SPOTLIGHT.includes(p.slug));
  const windbreaker = getProduct('windbreaker-blue');
  const jersey = getProduct('down-undr-jersey');
  const { flatRateCents, freeThresholdCents } = shippingConfig();
  const marquee = 'Built for the streets · New drop out now · BALE · ';

  return (
    <>
      {/* Hero: three portrait shots side by side, wordmark across the bottom */}
      <section className="p-hero" aria-label="BALE new drop">
        <div className="p-hero-panels">
          <div className="p-hero-panel">
            <Image src="/images/lookbook/umbrella-front.jpg" alt="Model in the blue Crown windbreaker under a yellow umbrella at night" fill priority sizes="(max-width: 860px) 100vw, 34vw" className="cover" />
          </div>
          <div className="p-hero-panel p-hide-mobile">
            <Image src="/images/lookbook/jersey-night.jpg" alt="Model in the Down Undr jersey under festoon lights" fill priority sizes="34vw" className="cover" />
          </div>
          <div className="p-hero-panel p-hide-mobile">
            <Image src="/images/lookbook/jersey-walk.jpg" alt="Back of the Down Undr jersey on a night walk" fill priority sizes="34vw" className="cover" />
          </div>
        </div>
        <div className="p-hero-shade" />
        <div className="p-hero-copy">
          <div className="p-hero-meta">
            <span>New drop</span>
            <Link href="/shop" className="p-link">Shop now →</Link>
          </div>
          <h1 className="p-wordmark" aria-label="BALE">BALE</h1>
        </div>
      </section>

      <div className="p-marquee" aria-hidden="true">
        <div className="p-marquee-track">
          <span>{marquee.repeat(4)}</span>
          <span>{marquee.repeat(4)}</span>
        </div>
      </div>

      {/* New in: the model-shot pieces, big */}
      {spotlight.length > 0 && (
        <section className="p-section" aria-labelledby="new-heading">
          <div className="p-head container">
            <h2 id="new-heading" className="p-label">New in</h2>
            <Link href="/shop" className="p-link">View all</Link>
          </div>
          <div className="p-spotlight">
            {spotlight.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <ProductCard product={p} variant="tall" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Editorial: Crown windbreaker */}
      {windbreaker && (
        <section className="p-editorial">
          <Reveal className="p-ed-media">
            <Image src="/images/lookbook/hood.jpg" alt="Blue Crown windbreaker with the hood up, crown logo on the chest" fill sizes="(max-width: 860px) 100vw, 50vw" className="cover" />
          </Reveal>
          <Reveal className="p-ed-copy" delay={120}>
            <p className="p-label">01 · Outerwear</p>
            <h2 className="display p-ed-title">The Crown windbreaker</h2>
            <p className="p-ed-text">{windbreaker.description}</p>
            <div className="p-ed-cta">
              <span>{formatPrice(windbreaker.priceCents)}</span>
              <Link href={`/products/${windbreaker.slug}`} className="btn btn-light">Shop the jacket</Link>
            </div>
          </Reveal>
        </section>
      )}

      {/* Editorial: Down Undr jersey, mirrored */}
      {jersey && (
        <section className="p-editorial p-editorial-flip">
          <Reveal className="p-ed-media">
            <Image src="/images/lookbook/jersey-umbrella.jpg" alt="Model in the Down Undr jersey and bandana" fill sizes="(max-width: 860px) 100vw, 50vw" className="cover" />
          </Reveal>
          <Reveal className="p-ed-copy" delay={120}>
            <p className="p-label">02 · Tops</p>
            <h2 className="display p-ed-title">Down Undr</h2>
            <p className="p-ed-text">{jersey.description}</p>
            <div className="p-ed-cta">
              <span>{formatPrice(jersey.priceCents)}</span>
              <Link href={`/products/${jersey.slug}`} className="btn btn-light">Shop the jersey</Link>
            </div>
          </Reveal>
        </section>
      )}

      {/* The rest of the range, in a swipeable rail */}
      {rail.length > 0 && (
        <section className="p-section" aria-labelledby="range-heading">
          <div className="p-head container">
            <h2 id="range-heading" className="p-label">The range</h2>
            <Link href="/shop" className="p-link">Shop all {products.length}</Link>
          </div>
          <div className="p-rail" tabIndex={0} aria-label="More products, scroll sideways">
            {rail.map((p) => (
              <div key={p.slug} className="p-rail-item">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lookbook */}
      <section id="lookbook" className="p-section" aria-labelledby="look-heading">
        <div className="p-head container">
          <h2 id="look-heading" className="p-label">Lookbook · Night shoot</h2>
          <a href="https://www.instagram.com/bale_wear" target="_blank" rel="noopener noreferrer" className="p-link">@bale_wear</a>
        </div>
        <div className="p-look">
          {LOOKBOOK.map((img, i) => (
            <Reveal key={img.src} className="p-look-item" delay={(i % 2) * 120}>
              <Image src={img.src} alt={img.alt} fill sizes="(max-width: 860px) 50vw, 25vw" className="cover" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y" aria-label="Store information">
        <div className="container info">
          <div>
            <h3>Shipping</h3>
            <p>
              Flat rate {formatPrice(flatRateCents)} Australia-wide
              {freeThresholdCents > 0 ? `, free on orders over ${formatPrice(freeThresholdCents)}` : ''}.{' '}
              <Link href="/info/shipping">Details</Link>
            </p>
          </div>
          <div>
            <h3>Returns</h3>
            <p>Changed your mind? Read the <Link href="/info/returns">returns policy</Link>.</p>
          </div>
          <div>
            <h3>Secure checkout</h3>
            <p>Pay by card, Apple Pay, Google Pay, Afterpay and more through Stripe.</p>
          </div>
        </div>
      </section>
    </>
  );
}
