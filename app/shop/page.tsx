import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { getActiveProducts } from '@/lib/products';

export const metadata: Metadata = { title: 'Shop all' };

export default function ShopPage() {
  const products = getActiveProducts();
  return (
    <section className="container section">
      <div className="section-head">
        <h1 className="display section-title">Shop all</h1>
        <p className="muted" style={{ margin: 0 }}>{products.length} pieces · Prices in AUD</p>
      </div>
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
