'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { formatPrice, getProduct } from '@/lib/products';

// Stand-in for Stripe Checkout while the site runs without payment keys.
export default function DemoCheckoutPage() {
  const { items, subtotalCents, clear, ready } = useCart();
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <section className="container prose">
        <p className="eyebrow">Demo order placed</p>
        <h1 className="display">That’s the flow</h1>
        <p>On the live site, the customer pays on Stripe’s secure page and lands on an order confirmation with their receipt emailed to them. Nothing was charged here.</p>
        <Link href="/shop" className="btn btn-light">Back to shop</Link>
      </section>
    );
  }

  if (ready && items.length === 0) {
    return (
      <section className="container empty">
        <h1 className="display section-title">Your cart is empty</h1>
        <Link href="/shop" className="btn btn-light">Shop the drop</Link>
      </section>
    );
  }

  return (
    <section className="container prose">
      <p className="eyebrow">Preview checkout</p>
      <h1 className="display">Payments are off</h1>
      <p>
        This is a preview of the BALE site. On the live site, this step opens Stripe’s secure checkout with card, Apple Pay, Google Pay and
        Afterpay, and collects the shipping address.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Price</th></tr>
          </thead>
          <tbody>
            {items.map((i) => {
              const p = getProduct(i.slug);
              if (!p) return null;
              return (
                <tr key={`${i.slug}-${i.size}`}>
                  <td>{p.name} · {i.size}</td>
                  <td>{i.qty}</td>
                  <td>{formatPrice(p.priceCents * i.qty)}</td>
                </tr>
              );
            })}
            <tr>
              <th scope="row">Subtotal</th>
              <td></td>
              <th>{formatPrice(subtotalCents)} AUD</th>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="btn btn-accent"
        style={{ marginTop: 24 }}
        onClick={() => {
          clear();
          setPlaced(true);
        }}
      >
        Place demo order
      </button>
    </section>
  );
}
