import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, type Product } from '@/lib/products';

export function ProductCard({ product, large = false }: { product: Product; large?: boolean }) {
  const img = product.images[0];
  return (
    <Link href={`/products/${product.slug}`} className={large ? 'card card-large' : 'card'}>
      <div className="card-media">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={large ? '(max-width: 860px) 100vw, 50vw' : '(max-width: 860px) 50vw, 25vw'}
          className="cover"
        />
        {product.featured && large && <span className="tag">Signature piece</span>}
      </div>
      <div className="card-row">
        <span>{product.name}</span>
        <span>{formatPrice(product.priceCents)}</span>
      </div>
    </Link>
  );
}
