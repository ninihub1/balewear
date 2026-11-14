'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartProvider';
import type { Product } from '@/lib/products';

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const single = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(single ? product.sizes[0] : null);
  const [added, setAdded] = useState(false);
  const soldOut = new Set(product.soldOutSizes ?? []);

  function handleAdd() {
    if (!size || soldOut.has(size)) return;
    add(product.slug, size, 1);
    setAdded(true);
  }

  if (product.comingSoon) {
    return (
      <div className="buy">
        <button type="button" className="btn btn-block" disabled style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
          Coming soon
        </button>
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>
          Not available yet. Follow <a href="https://www.instagram.com/bale_wear" target="_blank" rel="noopener noreferrer">@bale_wear</a> for the drop.
        </p>
      </div>
    );
  }

  return (
    <div className="buy">
      {!single && (
        <fieldset className="sizes">
          <legend>
            Size: <strong>{size ?? 'select'}</strong>
          </legend>
          <div className="size-row">
            {product.sizes.map((s) => {
              const out = soldOut.has(s);
              return (
                <button
                  key={s}
                  type="button"
                  className={s === size ? 'size size-on' : 'size'}
                  aria-pressed={s === size}
                  disabled={out}
                  onClick={() => {
                    setSize(s);
                    setAdded(false);
                  }}
                >
                  {s}
                  {out && <span className="sr-only"> (sold out)</span>}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
      <button type="button" className="btn btn-accent btn-block" onClick={handleAdd} disabled={!size}>
        {size ? 'Add to cart' : 'Select a size'}
      </button>
      <p role="status" className="added">
        {added && (
          <>
            Added to cart. <Link href="/cart">View cart</Link>
          </>
        )}
      </p>
    </div>
  );
}
