import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, type Product } from '@/lib/products';

// Shows the front photo, and fades to the back photo on hover when there is one.
export function ProductCard({
  product,
  large = false,
  variant,
}: {
  product: Product;
  large?: boolean;
  // 'tall': portrait 4:5 frame, photo fills it edge to edge (for model shots).
  variant?: 'tall';
}) {
  const [front, back] = product.images;
  const wide = large || variant === 'tall';
  const sizes = wide ? '(max-width: 860px) 100vw, 50vw' : '(max-width: 860px) 50vw, 25vw';
  const fit = variant === 'tall' ? 'cover' : 'contain';
  const cls = ['card', large && 'card-large', variant === 'tall' && 'card-tall'].filter(Boolean).join(' ');
  return (
    <Link href={`/products/${product.slug}`} className={product.soldOut ? `${cls} card-sold` : cls}>
      <div
        className={back ? 'card-media has-back' : 'card-media'}
        style={product.photoBg ? { background: product.photoBg } : undefined}
      >
        <Image src={front.src} alt={front.alt} fill sizes={sizes} className={`${fit} img-front`} />
        {back && (
          <Image src={back.src} alt="" aria-hidden="true" fill sizes={sizes} className={`${fit} img-back`} />
        )}
        {product.featured && large && <span className="tag">Signature piece</span>}
        {product.comingSoon && <span className="tag tag-soon">Coming soon</span>}
        {product.soldOut && <span className="tag tag-soon">Sold out</span>}
      </div>
      <div className="card-row">
        <span>{product.name}</span>
        <span className={product.comingSoon || product.soldOut ? 'muted' : undefined}>
          {product.soldOut ? 'Sold out' : product.comingSoon ? 'Coming soon' : formatPrice(product.priceCents)}
        </span>
      </div>
    </Link>
  );
}
