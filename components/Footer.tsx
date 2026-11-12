import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <p className="display footer-title">Built for the streets</p>
          <a href="https://www.instagram.com/bale_wear" target="_blank" rel="noopener noreferrer">
            Follow @bale_wear on Instagram
          </a>
        </div>
        <div className="footer-cols">
          <div>
            <p className="footer-label">Help</p>
            <Link href="/info/shipping">Shipping</Link>
            <Link href="/info/returns">Returns and refunds</Link>
            <Link href="/info/size-guide">Size guide</Link>
            <Link href="/info/contact">Contact</Link>
          </div>
          <div>
            <p className="footer-label">BALE</p>
            <Link href="/shop">Shop all</Link>
            <Link href="/info/about">About</Link>
            <Link href="/info/privacy">Privacy policy</Link>
            <Link href="/info/terms">Terms</Link>
          </div>
        </div>
      </div>
      <div className="container footer-base">
        <span>© {year} BALE. Prices in AUD.</span>
        <span>Secure checkout by Stripe</span>
      </div>
    </footer>
  );
}
