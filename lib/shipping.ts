// Shipping settings come from environment variables so the owner can change
// rates in Vercel without touching code. Read on the server only.

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function shippingConfig() {
  const countries = (process.env.SHIPPING_COUNTRIES || 'AU')
    .split(',')
    .map((c) => c.trim().toUpperCase())
    .filter((c) => /^[A-Z]{2}$/.test(c));
  return {
    flatRateCents: intEnv('SHIPPING_FLAT_RATE_CENTS', 1000),
    // 0 turns free shipping off.
    freeThresholdCents: intEnv('FREE_SHIPPING_THRESHOLD_CENTS', 15000),
    countries: countries.length ? countries : ['AU'],
  };
}
