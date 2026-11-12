import 'server-only';
import Stripe from 'stripe';

let client: Stripe | null = null;

// Created on first use so a missing key fails at request time with a clear
// message instead of breaking the build.
export function getStripe(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set. See .env.example.');
  }
  client = new Stripe(key, { appInfo: { name: 'balewear' } });
  return client;
}

// Preview mode: with no Stripe key set, the site runs as a demo and checkout
// goes to /checkout/demo instead of charging anyone.
export function paymentsEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function siteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL || // set by Netlify
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000';
  return url.replace(/\/$/, '');
}
