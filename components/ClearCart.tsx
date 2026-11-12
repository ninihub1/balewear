'use client';

import { useEffect } from 'react';
import { useCart } from './CartProvider';

// Empties the cart once the customer lands on the confirmation page.
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
