import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, type Product } from '@/lib/products';

// Shows the front photo, and fades to the back photo on hover when there is one.
export function ProductCard({ product, large = false }: { product: Product; large?: boolean }) {
  const [front, back] = product.images;
  const sizes = large ? '(max-width: 860px) 100vw, 50vw' : '(max-width: 860px) 50vw, 25vw';
  return (
    <Link href={`/products/${product.slug}`} className={large ? 'card card-large' : 'card'}>
      <div
        className={back ? 'card-media has-back' : 'card-media'}
        style={product.photoBg ? { background: product.photoBg } : undefined}
      >
        <Image src={front.src} alt={front.alt} fill sizes={sizes} className="contain img-front" />
        {back && (
          <Image src={back.src} alt="" aria-hidden="true" fill sizes={sizes} className="contain img-back" />
        )}
        {product.featured && large && <span className="tag">Signature piece</span>}
        {product.comingSoon && <span className="tag tag-soon">Coming soon</span>}
      </div>
      <div className="card-row">
        <span>{product.name}</span>
        <span className={product.comingSoon ? 'muted' : undefined}>
          {product.comingSoon ? 'Coming soon' : formatPrice(product.priceCents)}
        </span>
      </div>
    </Link>
  );
}
