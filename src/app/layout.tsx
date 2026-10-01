import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { PRODUCT } from '@/lib/product';
import SiteViewProvider from '@/components/site-view/SiteViewProvider';

const mono = IBM_Plex_Mono({ variable: '--font-mono', subsets: ['latin'], weight: ['400', '500'] });
const SITE_URL = `https://${PRODUCT.host}`;
const OG_IMAGE = `${SITE_URL}/og-card`;
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'glanceless | page-level browser rules',
  description: PRODUCT.headline,
  alternates: { canonical: SITE_URL },
  openGraph: { title: 'glanceless | page-level browser rules', description: PRODUCT.headline, url: SITE_URL, siteName: 'glanceless', type: 'website', images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'glanceless page-level browser rules' }] },
  twitter: { card: 'summary_large_image', title: 'glanceless | page-level browser rules', description: PRODUCT.headline, images: [OG_IMAGE] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const org = { '@type': 'Organization', '@id': 'https://thecompound.tech/#organization', name: 'Compound Labs', url: 'https://thecompound.tech' };
  return <html lang="en" className={mono.variable}><body><SiteViewProvider>{children}</SiteViewProvider><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: PRODUCT.name, url: `https://${PRODUCT.host}`, publisher: org }) }} /></body></html>;
}
