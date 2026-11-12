import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { formatPrice, getActiveProducts } from '@/lib/products';
import { shippingConfig } from '@/lib/shipping';

export default function HomePage() {
  const products = getActiveProducts();
  const featured = products.find((p) => p.featured) ?? products[0];
  const rest = products.filter((p) => p.slug !== featured?.slug);
  const { flatRateCents, freeThresholdCents } = shippingConfig();

  return (
    <>
      <section className="hero">
        <Image
          src="/images/wind_worn.jpg"
          alt="Model wearing the BALE Overthrown windbreaker at night"
          fill
          priority
          sizes="100vw"
          className="cover"
          style={{ objectPosition: '50% 30%' }}
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <p className="eyebrow" style={{ color: '#c9d6f7' }}>Drop 01 · Out now</p>
          <h1 className="display hero-title">Built for the streets</h1>
          <p className="hero-copy">Heavyweight streetwear and art-print outerwear from BALE.</p>
          <div className="actions">
            <Link href="/shop" className="btn btn-light">Shop the drop</Link>
            <Link href="#lookbook" className="btn btn-outline">View lookbook</Link>
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="shop-heading">
        <div className="section-head">
          <h2 id="shop-heading" className="display section-title">Shop all</h2>
          <p className="muted" style={{ margin: 0 }}>{products.length} pieces · Prices in AUD</p>
        </div>
        <div className="grid">
          {featured && <ProductCard product={featured} large />}
          {rest.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {featured && (
        <section className="container" style={{ paddingBottom: 96 }}>
          <div className="split">
            <div className="split-copy">
              <p className="eyebrow">The {featured.name.toLowerCase()}</p>
              <h2 className="display">Classical art, worn loud</h2>
              <p>{featured.description}</p>
              <div className="actions" style={{ alignItems: 'center', gap: 20 }}>
                <span className="price-lg">{formatPrice(featured.priceCents)}</span>
                <Link href={`/products/${featured.slug}`} className="btn btn-accent">View product</Link>
              </div>
            </div>
            <div className="split-media">
              <Image
                src="/images/wind_worn.jpg"
                alt="The windbreaker worn at night"
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                className="cover"
                style={{ objectPosition: '50% 80%' }}
              />
            </div>
          </div>
        </section>
      )}

      <section id="lookbook" className="rule-top" aria-labelledby="look-heading">
        <div className="container section">
          <div className="section-head">
            <h2 id="look-heading" className="display section-title">Lookbook</h2>
            <a href="https://www.instagram.com/bale_wear" target="_blank" rel="noopener noreferrer" className="eyebrow" style={{ color: 'var(--text)' }}>
              Follow @bale_wear
            </a>
          </div>
          <div className="grid grid-3">
            <div className="look"><Image src="/images/skate.jpg" alt="Two people in BALE tees at a skatepark" fill sizes="(max-width: 860px) 100vw, 33vw" className="cover" /></div>
            <div className="look"><Image src="/images/stall.jpg" alt="The BALE market stall with a clothing rail" fill sizes="(max-width: 860px) 100vw, 33vw" className="cover" /></div>
            <div className="look"><Image src="/images/sit.jpg" alt="Two people in BALE tees and shorts at night" fill sizes="(max-width: 860px) 100vw, 33vw" className="cover" /></div>
          </div>
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
            <p>Pay by card, Apple Pay, Google Pay or Afterpay through Stripe.</p>
          </div>
        </div>
      </section>
    </>
  );
}
