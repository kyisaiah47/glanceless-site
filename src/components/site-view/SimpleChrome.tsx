'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PRODUCT } from '@/lib/product';
import ViewControls from './ViewControls';

const NAV = [
  { href: '/#try', label: 'Try it' },
  { href: '/guides/what-does-glanceless-check', label: 'What it checks' },
  { href: '/guides/how-to-check-rendered-webpage', label: 'How to run it' },
];

export function SimpleHeader() {
  const path = usePathname();
  return (
    <header className="sv-nav">
      <div className="sv-in">
        <Link className="sv-brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" width={24} height={24} />
          glanceless
        </Link>
        <nav aria-label="Main navigation">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined}>{n.label}</Link>
          ))}
          <a href={PRODUCT.repo} rel="noopener">GitHub <span aria-hidden="true">{'↗'}</span></a>
        </nav>
      </div>
    </header>
  );
}

/* The four layers of the studio credit travel with the Simple footer too: the Built by mark
 * with its alt, the copyright sentence in live text and the contact address. The publisher @id
 * is in the layout and covers both views. */
export function SimpleFooter() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="sv-footer">
      <div className="sv-in">
        <div className="sv-footer-main">
          <nav aria-label="Footer">
            <a href={PRODUCT.npm} rel="noopener">npm</a>
            <a href={PRODUCT.repo} rel="noopener">Source on GitHub</a>
            <a href={`${PRODUCT.repo}/blob/main/LICENSE`} rel="noopener">MIT licence</a>
            <Link href="/guides/what-does-glanceless-check">What it checks</Link>
            <Link href="/guides/how-to-check-rendered-webpage">How to run it</Link>
            <a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a>
          </nav>
          <div className="sv-footer-credit">
            <a
              className="credit"
              href={`https://thecompound.tech/?utm_source=glanceless&utm_medium=studio_credit`}
              rel="noopener"
            >
              Built by
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="studio-credit-mark" src="/brand/compound-labs.svg" alt="Compound Labs" width={20} height={20} />
            </a>
            <span>{'©'} {year} {PRODUCT.name}. A Compound Labs product.</span>
          </div>
        </div>
        <ViewControls />
      </div>
    </footer>
  );
}
