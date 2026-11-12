'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { formatPrice, getProduct, MAX_QTY_PER_LINE } from '@/lib/products';

export default function CartPage() {
  const { items, subtotalCents, setQty, remove, ready } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(({ slug, size, qty }) => ({ slug, size, qty })) }),
      });
      const data: { url?: string; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout is unavailable right now.');
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (!ready) {
    return <section className="container empty" aria-busy="true"><p className="muted">Loading your cart…</p></section>;
  }

  if (items.length === 0) {
    return (
      <section className="container empty">
        <h1 className="display section-title">Your cart is empty</h1>
        <Link href="/shop" className="btn btn-light">Shop the drop</Link>
      </section>
    );
  }

  return (
    <section className="container">
      <h1 className="display section-title" style={{ marginTop: 64 }}>Cart</h1>
      <div className="cart">
        <ul className="cart-lines">
          {items.map((item) => {
            const p = getProduct(item.slug);
            if (!p) return null;
            return (
              <li key={`${item.slug}-${item.size}`} className="cart-line">
                <Link href={`/products/${p.slug}`} className="cart-thumb" aria-label={p.name}>
                  <Image src={p.images[0].src} alt="" fill sizes="112px" className="cover" />
                </Link>
                <div className="cart-line-body">
                  <div className="cart-line-top">
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                    <span>{formatPrice(p.priceCents * item.qty)}</span>
                  </div>
                  <span className="muted" style={{ fontSize: 14 }}>
                    Size {item.size} · {formatPrice(p.priceCents)} each
                  </span>
                  <div className="qty" role="group" aria-label={`Quantity for ${p.name}, size ${item.size}`}>
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQty(item.slug, item.size, item.qty - 1)}>−</button>
                    <span aria-live="polite">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={item.qty >= MAX_QTY_PER_LINE}
                      onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button type="button" className="link-button" onClick={() => remove(item.slug, item.size)}>
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="summary" aria-label="Order summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotalCents)}</span>
          </div>
          <div className="summary-row muted summary-total" style={{ fontSize: 15, fontWeight: 500 }}>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <button type="button" className="btn btn-accent btn-block" onClick={checkout} disabled={loading}>
            {loading ? 'Opening checkout…' : 'Checkout'}
          </button>
          {error && <p className="error" role="alert">{error}</p>}
          <p className="pay-note">Card, Apple Pay, Google Pay and Afterpay. Payment is handled securely by Stripe.</p>
        </aside>
      </div>
    </section>
  );
}
