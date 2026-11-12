import type { Metadata } from 'next';
import Link from 'next/link';
import type Stripe from 'stripe';
import { ClearCart } from '@/components/ClearCart';
import { formatPrice } from '@/lib/products';
import { getStripe } from '@/lib/stripe';

export const metadata: Metadata = { title: 'Order confirmed', robots: { index: false } };
export const dynamic = 'force-dynamic';

type Props = { searchParams: { session_id?: string } };

async function loadSession(id: string | undefined): Promise<Stripe.Checkout.Session | null> {
  if (!id || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return null;
  try {
    return await getStripe().checkout.sessions.retrieve(id, { expand: ['line_items'] });
  } catch {
    return null;
  }
}

export default async function SuccessPage({ searchParams }: Props) {
  const session = await loadSession(searchParams.session_id);
  const paid = session?.payment_status === 'paid';
  const pending = session?.status === 'complete' && session.payment_status === 'unpaid';

  if (!session || (!paid && !pending)) {
    return (
      <section className="container prose">
        <h1 className="display">Order not found</h1>
        <p>We couldn&apos;t find that order. If you were charged, check your email for a receipt or <Link href="/info/contact">contact us</Link>.</p>
        <Link href="/shop" className="btn btn-light">Back to shop</Link>
      </section>
    );
  }

  const firstName = session.customer_details?.name?.split(' ')[0];
  const lines = session.line_items?.data ?? [];

  return (
    <section className="container prose">
      <ClearCart />
      <p className="eyebrow">{paid ? 'Order confirmed' : 'Payment processing'}</p>
      <h1 className="display">Thanks{firstName ? `, ${firstName}` : ''}</h1>
      <p>
        {paid
          ? 'Your order is in. A receipt is on its way to your email.'
          : 'Your order is in and your payment is processing. We will email you once it clears.'}
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Price</th></tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.id}>
                <td>{l.description}</td>
                <td>{l.quantity}</td>
                <td>{formatPrice(l.amount_total)}</td>
              </tr>
            ))}
            <tr>
              <td>Shipping</td>
              <td></td>
              <td>{formatPrice(session.total_details?.amount_shipping ?? 0)}</td>
            </tr>
            <tr>
              <th scope="row">Total</th>
              <td></td>
              <th>{formatPrice(session.amount_total ?? 0)} AUD</th>
            </tr>
          </tbody>
        </table>
      </div>
      <Link href="/shop" className="btn btn-light" style={{ marginTop: 24 }}>Keep shopping</Link>
    </section>
  );
}
