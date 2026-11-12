import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCart } from '@/components/AddToCart';
import { ProductCard } from '@/components/ProductCard';
import { formatPrice, getActiveProducts, getProduct } from '@/lib/products';
import { shippingConfig } from '@/lib/shipping';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getActiveProducts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: Props): Metadata {
  const product = getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images[0].src] },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const { flatRateCents, freeThresholdCents } = shippingConfig();
  const others = getActiveProducts().filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <nav className="container breadcrumb" aria-label="Breadcrumb">
        <Link href="/shop">Shop</Link> / {product.category} / {product.name}
      </nav>

      <section className="container pdp">
        <div className="pdp-gallery">
          {product.images.map((img, i) => (
            <div
              key={img.src}
              className="pdp-main"
              style={product.photoBg ? { background: product.photoBg } : undefined}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 860px) 100vw, 60vw"
                className="contain"
              />
            </div>
          ))}
        </div>

        <div className="pdp-info">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="eyebrow">{product.category}</p>
            <h1 className="display pdp-title">{product.name}</h1>
            <p className="pdp-price">
              {formatPrice(product.priceCents)} <span className="muted" style={{ fontSize: 14, fontWeight: 500 }}>AUD</span>
            </p>
          </div>

          <p className="pdp-desc">{product.description}</p>

          <AddToCart product={product} />

          <div>
            <details open>
              <summary>Details</summary>
              <div>
                <ul>
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </details>
            <details>
              <summary>Shipping</summary>
              <div>
                Flat rate {formatPrice(flatRateCents)} Australia-wide
                {freeThresholdCents > 0 ? `, free over ${formatPrice(freeThresholdCents)}` : ''}.{' '}
                <Link href="/info/shipping">Shipping details</Link>
              </div>
            </details>
            <details>
              <summary>Returns</summary>
              <div>
                See the <Link href="/info/returns">returns policy</Link>.
              </div>
            </details>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="container" style={{ paddingBottom: 96 }}>
          <h2 className="display" style={{ margin: '0 0 24px', fontSize: 32 }}>Wear it with</h2>
          <div className="grid grid-3">
            {others.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
