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

export function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return url.replace(/\/$/, '');
}
