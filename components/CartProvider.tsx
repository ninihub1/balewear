'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct, MAX_QTY_PER_LINE } from '@/lib/products';

export type CartItem = { slug: string; size: string; qty: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  ready: boolean;
  add: (slug: string, size: string, qty?: number) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'bale-cart-v1';

function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((i): i is CartItem => {
      if (!i || typeof i !== 'object') return false;
      const o = i as Record<string, unknown>;
      return (
        typeof o.slug === 'string' &&
        typeof o.size === 'string' &&
        typeof o.qty === 'number' &&
        Number.isInteger(o.qty) &&
        o.qty > 0
      );
    })
    .filter((i) => {
      const p = getProduct(i.slug);
      return !!p && p.sizes.includes(i.size);
    })
    .map((i) => ({ ...i, qty: Math.min(i.qty, MAX_QTY_PER_LINE) }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(sanitize(JSON.parse(saved)));
    } catch {
      // Storage blocked or corrupted: start with an empty cart.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore: the cart still works for this visit.
    }
  }, [items, ready]);

  const add = useCallback((slug: string, size: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY_PER_LINE) } : i,
        );
      }
      return [...prev, { slug, size, qty: Math.min(qty, MAX_QTY_PER_LINE) }];
    });
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => !(i.slug === slug && i.size === size))
        : prev.map((i) =>
            i.slug === slug && i.size === size ? { ...i, qty: Math.min(qty, MAX_QTY_PER_LINE) } : i,
          ),
    );
  }, []);

  const remove = useCallback((slug: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotalCents = items.reduce((sum, i) => {
      const p = getProduct(i.slug);
      return p ? sum + p.priceCents * i.qty : sum;
    }, 0);
    return { items, count, subtotalCents, ready, add, setQty, remove, clear };
  }, [items, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
