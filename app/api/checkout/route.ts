import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { CURRENCY, getProduct, MAX_QTY_PER_LINE } from '@/lib/products';
import { shippingConfig } from '@/lib/shipping';
import { getStripe, siteUrl } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LINES = 20;
const MAX_BODY_BYTES = 10_000;

type Line = { slug: string; size: string; qty: number };

function productImage(src: string, site: string, sitePublic: boolean): string[] | undefined {
  if (src.startsWith('https://')) return [src];
  return sitePublic ? [`${site}${src}`] : undefined;
}

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Everything from the browser is untrusted. We only accept slugs, sizes and
// quantities, check each against the catalog, and look up prices server-side.
function parseLines(body: unknown): Line[] | string {
  if (!body || typeof body !== 'object' || !Array.isArray((body as { items?: unknown }).items)) {
    return 'Your cart is empty.';
  }
  const raw = (body as { items: unknown[] }).items;
  if (raw.length === 0) return 'Your cart is empty.';
  if (raw.length > MAX_LINES) return 'Too many items in the cart.';

  const merged = new Map<string, Line>();
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') return 'Invalid cart item.';
    const { slug, size, qty } = entry as Record<string, unknown>;
    if (typeof slug !== 'string' || typeof size !== 'string' || typeof qty !== 'number') {
      return 'Invalid cart item.';
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) return 'Invalid quantity.';

    const product = getProduct(slug);
    if (!product) return 'An item in your cart is no longer available.';
    if (!product.sizes.includes(size)) return `Size ${size} is not available for ${product.name}.`;
    if (product.soldOutSizes?.includes(size)) return `${product.name} in ${size} is sold out.`;

    const key = `${slug}|${size}`;
    const existing = merged.get(key);
    const total = (existing?.qty ?? 0) + qty;
    if (total > MAX_QTY_PER_LINE) return 'Invalid quantity.';
    merged.set(key, { slug, size, qty: total });
  }
  return Array.from(merged.values());
}

export async function POST(req: Request) {
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return fail('Request too large.', 413);

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return fail('Invalid request.');
  }

  const lines = parseLines(body);
  if (typeof lines === 'string') return fail(lines);

  const site = siteUrl();
  const publicImages = site.startsWith('https://');
  const { flatRateCents, freeThresholdCents, countries } = shippingConfig();

  let subtotal = 0;
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map((line) => {
    const product = getProduct(line.slug)!;
    subtotal += product.priceCents * line.qty;
    return {
      quantity: line.qty,
      price_data: {
        currency: CURRENCY,
        unit_amount: product.priceCents,
        product_data: {
          name: product.name,
          description: `Size: ${line.size}`,
          images: productImage(product.images[0].src, site, publicImages),
          metadata: { slug: product.slug, size: line.size },
        },
      },
    };
  });

  const freeShipping = freeThresholdCents > 0 && subtotal >= freeThresholdCents;
  const shippingOption: Stripe.Checkout.SessionCreateParams.ShippingOption = {
    shipping_rate_data: {
      type: 'fixed_amount',
      display_name: freeShipping ? 'Free standard shipping' : 'Standard shipping',
      fixed_amount: { amount: freeShipping ? 0 : flatRateCents, currency: CURRENCY },
    },
  };

  // Compact order summary for the dashboard and webhook (Stripe caps metadata values at 500 chars).
  const orderSummary = lines.map((l) => `${l.slug}:${l.size}:${l.qty}`).join(',').slice(0, 500);

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      currency: CURRENCY,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: countries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: [shippingOption],
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: { order: orderSummary },
      payment_intent_data: { metadata: { order: orderSummary } },
      success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/cart`,
    });

    if (!session.url) return fail('Could not start checkout.', 502);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Log the detail server-side; never send Stripe errors to the browser.
    console.error('Stripe checkout error:', err);
    return fail('Checkout is unavailable right now. Please try again.', 502);
  }
}
