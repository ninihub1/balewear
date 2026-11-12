'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from './CartProvider';

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/#lookbook', label: 'Lookbook' },
  { href: '/info/about', label: 'About' },
  { href: '/info/contact', label: 'Contact' },
];

export function Header({ banner }: { banner: string | null }) {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      {banner && <div className="banner">{banner}</div>}
      <header className="header">
        <div className="header-inner container">
          <Link href="/" className="brand" onClick={() => setOpen(false)}>
            <Image src="/images/logo.jpg" alt="" width={44} height={44} className="brand-mark" priority />
            <span>BALE</span>
          </Link>

          <nav className="nav-desktop" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link href="/cart" className="cart-button" aria-label={`Cart, ${ready ? count : 0} items`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 7h12l-1 13H7L6 7z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              <span>{ready ? count : 0}</span>
            </Link>
            <button
              type="button"
              className="menu-button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <nav id="mobile-nav" className="nav-mobile" aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
