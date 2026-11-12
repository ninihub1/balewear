import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container empty">
      <h1 className="display section-title">Page not found</h1>
      <p className="muted">That page doesn&apos;t exist or has moved.</p>
      <Link href="/shop" className="btn btn-light">Go to the shop</Link>
    </section>
  );
}
