# BALE storefront

Online store for BALE streetwear. Built with Next.js 14 and Stripe Checkout, hosted on Vercel.

Customers browse products, pick sizes, add to a cart and pay on Stripe's hosted checkout page. Stripe handles cards, Apple Pay, Google Pay, Link and Afterpay. Card details never touch this site.

## What's in it

- Homepage, shop page, product pages with size selection, cart
- Stripe Checkout with shipping address, phone number, flat-rate shipping, free shipping over a threshold and promo codes
- Order confirmation page that reads the order back from Stripe
- Webhook endpoint that verifies Stripe's signature and logs paid orders
- Info pages: about, shipping, returns, size guide, contact, privacy, terms
- Sitemap, robots.txt, Open Graph tags, security headers

## Before launch: things the owner must check

1. **Product photos.** Product photos load from the current Shopify store's image CDN (front first, back second; cards swap to the back photo on hover). Before cancelling Shopify, download them into `public/images` and change the paths in `lib/products.ts`, or they will stop loading. The hero and lookbook images in `public/images` are low-resolution crops from Instagram; swap in full-size originals.
2. **Prices, sizes and descriptions** in `lib/products.ts`. Sizes are set to S to XL as a guess.
3. **Policies** in `lib/pages.ts`. The shipping times (3 business days to dispatch) and returns window (14 days) are defaults. Change them to what the owner offers.
4. **Shipping rates** in the environment variables below.

## Running it locally

Needs Node.js 18.18 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in your Stripe test keys
npm run dev
```

Open http://localhost:3000. Use Stripe test card `4242 4242 4242 4242`, any future expiry and any CVC.

To test the webhook locally, install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` secret it prints into `STRIPE_WEBHOOK_SECRET`.

## Deploying

### 1. Stripe account

The owner creates the Stripe account at https://dashboard.stripe.com/register, since payouts go to his bank account. He completes business verification and adds his bank details.

In the Stripe dashboard:

- **Settings > Payment methods:** turn on Apple Pay, Google Pay and Afterpay/Clearpay. Checkout shows whatever is turned on here.
- **Settings > Customer emails:** turn on "Successful payments" so customers get a receipt.
- **Settings > Public details and Branding:** add the BALE logo, colours and support email. These show on the checkout page and receipts.

### 2. Vercel

1. Sign in at https://vercel.com with GitHub and import this repository. Vercel detects Next.js; leave the build settings as they are.
2. Add the environment variables (Project > Settings > Environment Variables):

| Name | Value |
| --- | --- |
| `STRIPE_SECRET_KEY` | Secret key from Stripe > Developers > API keys (`sk_live_...` for real sales) |
| `STRIPE_WEBHOOK_SECRET` | From step 3 below |
| `NEXT_PUBLIC_SITE_URL` | The live address, for example `https://balewear.com` |
| `SHIPPING_FLAT_RATE_CENTS` | Flat shipping in cents. `1000` is $10 |
| `FREE_SHIPPING_THRESHOLD_CENTS` | Free shipping from this order total, in cents. `0` turns it off |
| `SHIPPING_COUNTRIES` | Countries to ship to, for example `AU` or `AU,NZ` |

3. Deploy.

Changing an environment variable needs a redeploy (Deployments > ... > Redeploy) before the site shows the new value.

### 3. Webhook

In Stripe > Developers > Webhooks, add an endpoint:

- URL: `https://YOUR-DOMAIN/api/webhooks/stripe`
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`

Copy the signing secret into `STRIPE_WEBHOOK_SECRET` in Vercel and redeploy.

### 4. Domain

The balewear.com domain currently points at Shopify. In Vercel > Project > Settings > Domains, add `balewear.com` and `www.balewear.com`, then update the DNS records where the domain is registered to the values Vercel shows. Keep the Shopify store running until the new site has taken a real test order.

### 5. Test before going live

Deploy first with test keys (`sk_test_...`), place an order with the test card and check it appears in Stripe under Payments. Then swap in the live keys and redeploy.

## Managing orders

Every paid order is in the Stripe dashboard under Payments, with the items, sizes, shipping address and phone number. The `order` field in the payment's metadata lists each item as `slug:size:qty`.

Stripe does not track stock. To mark a size as sold out, add it to `soldOutSizes` on that product in `lib/products.ts`. To hide a product, set `active: false`.

## Security notes

- Prices come from `lib/products.ts` on the server. The browser only sends product, size and quantity, and each is checked before a checkout session is created.
- Quantities are capped at 10 per line and 20 lines per order.
- The webhook rejects any request without a valid Stripe signature.
- Stripe errors are logged on the server and never sent to the browser.
- Secret keys live in environment variables. `.env.local` is in `.gitignore`.

## Project layout

```
app/
  page.tsx                  homepage
  shop/                     all products
  products/[slug]/          product page
  cart/                     cart
  checkout/success/         order confirmation
  info/[slug]/              about, shipping, returns, etc.
  api/checkout/             creates the Stripe Checkout session
  api/webhooks/stripe/      receives Stripe events
components/                 header, footer, cart state, product card
lib/
  products.ts               catalog and prices
  pages.ts                  info page text
  shipping.ts               shipping settings
  stripe.ts                 Stripe client
public/images/              photos
```
