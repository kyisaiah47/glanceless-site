import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { PRODUCT } from '@/lib/product';

const mono = IBM_Plex_Mono({ variable: '--font-mono', subsets: ['latin'], weight: ['400', '500'] });
export const metadata: Metadata = { title: 'glanceless | page-level browser rules', description: PRODUCT.headline, metadataBase: new URL(`https://${PRODUCT.host}`) };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const org = { '@type': 'Organization', '@id': 'https://thecompound.tech/#organization', name: 'Compound Labs', url: 'https://thecompound.tech' };
  return <html lang="en" className={mono.variable}><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: PRODUCT.name, url: `https://${PRODUCT.host}`, publisher: org }) }} /></body></html>;
}
